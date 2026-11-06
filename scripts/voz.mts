/**
 * Voz de las dos plantillas del canal con msedge-tts.
 *   npx tsx scripts/voz.mts <ruta-guion.json>
 * Recibe las líneas de voz de la plantilla (tesis/plan.ts `lineasTesis`: gancho, promesa, escenas, número,
 * remate, siguiente; grafico/plan.ts `lineasGrafico`: gancho, escenas, remate), con sus silencios antes/después
 * (pausas, tarjetas, respiros), y genera public/voz/<id>/<n>.mp3 y public/voz/<id>/tiempos.json con duración y
 * límites de palabra de cada línea (subtítulos palabra a palabra, gráficos que se construyen con la voz).
 * Las líneas vacías (escena `respiro`) no se sintetizan: duran solo su silencio.
 * Cachea por hash(texto + voz + prosodia): si la línea no cambió, no vuelve a llamar al servicio.
 * Voz por defecto es-MX-JorgeNeural a +4 % (src/plantillas/comun/guion.ts).
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { parseFile } from 'music-metadata';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOZ_POR_DEFECTO, type GuionGrafico, type GuionTesis } from '../src/plantillas/comun/guion';
import { habladasDe, alinearHabladas, VERSION_ALINEACION, type Limite } from './lib/alinear.mjs';
import { armarTiempos, type LineaVoz, type MedidaLinea, type Palabra, type Tiempos } from '../src/plantillas/comun/plan';
import { lineasTesis } from '../src/plantillas/tesis/plan';
import { lineasGrafico } from '../src/plantillas/grafico/plan';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORMATO_AUDIO = OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;
/** Narración: apenas más rápida que la lectura neutra (docs/CONVENCIONES.md: +4 %). */
const PROSODIA = { rate: '+4%' };
const REINTENTOS = 3;

/** `limites` = WordBoundary crudos del servicio (para diagnosticar y realinear sin volver a sintetizar). */
type Sidecar = { hash: string; voz: string; duracionAudio: number; palabras: Palabra[]; reales: boolean; texto: string; desfaseMax?: number; alineacion?: number; limites?: { texto: string; inicio: number; fin: number }[] };

const hashDe = (texto: string, voz: string) => crypto.createHash('sha256').update(`${voz}\n${JSON.stringify(PROSODIA)}\n${texto}`).digest('hex').slice(0, 16);

/** Lee un guion (envoltorio {plantilla, props}) SIN validar: cada preparar-* valida con su schema. */
export const leerGuion = (ruta: string): { plantilla: 'tesis' | 'grafico'; props: GuionTesis | GuionGrafico } => {
  const crudo = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  if (!crudo.plantilla) throw new Error(`${ruta}: falta "plantilla" (tesis|grafico)`);
  return { plantilla: crudo.plantilla, props: crudo.props };
};

/** Líneas de voz de un guion según su plantilla. */
export const lineasDe = (plantilla: 'tesis' | 'grafico', props: GuionTesis | GuionGrafico): LineaVoz[] =>
  plantilla === 'tesis' ? lineasTesis(props as GuionTesis) : lineasGrafico(props as GuionGrafico);

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

const sintetizar = async (tts: MsEdgeTTS, texto: string): Promise<{ audio: Buffer; limites: Limite[] }> => {
  const { audioStream, metadataStream } = tts.toStream(texto, PROSODIA);
  const partes: Buffer[] = [];
  const limites: Limite[] = [];
  const metaListo = new Promise<void>((resolve) => {
    if (!metadataStream) return resolve();
    metadataStream.on('data', (c: Buffer) => { try { limites.push(...(JSON.parse(c.toString()).Metadata as Limite[])); } catch { /* trozo no JSON: se ignora */ } });
    metadataStream.once('close', () => resolve());
    metadataStream.once('end', () => resolve());
    metadataStream.once('error', () => resolve());
  });
  const limite = setTimeout(() => audioStream.destroy(new Error('tiempo agotado en la síntesis')), 60000);
  try { for await (const c of audioStream) partes.push(c as Buffer); } finally { clearTimeout(limite); }
  await Promise.race([metaListo, esperar(1500)]);
  const audio = Buffer.concat(partes);
  if (audio.length < 1000) throw new Error('audio vacío');
  return { audio, limites };
};

/** Genera (o reutiliza) la voz de las líneas y escribe tiempos.json. Devuelve los tiempos. */
export const generarVoz = async (id: string, vozElegida: string | undefined, lineas: LineaVoz[]): Promise<Tiempos> => {
  const voz = vozElegida ?? VOZ_POR_DEFECTO;
  const dir = path.join(RAIZ, 'public/voz', id);
  fs.mkdirSync(dir, { recursive: true });
  let tts: MsEdgeTTS | null = null;
  const medidas: MedidaLinea[] = [];
  try {
    for (let i = 0; i < lineas.length; i++) {
      const { tipo, texto } = lineas[i];
      if (!texto.trim()) {
        medidas.push({ ...lineas[i], archivo: '', duracionAudio: 0, palabras: [], reales: true });
        console.log(`· voz ${id}/${i} (${tipo}): silencio de ${lineas[i].despues ?? 0}s`);
        continue;
      }
      const mp3 = path.join(dir, `${i}.mp3`);
      const sidecarRuta = path.join(dir, `${i}.json`);
      const hash = hashDe(texto, voz);
      let sidecar: Sidecar | null = null;
      if (fs.existsSync(mp3) && fs.existsSync(sidecarRuta)) {
        const previo = JSON.parse(fs.readFileSync(sidecarRuta, 'utf8')) as Sidecar;
        if (previo.hash === hash && previo.limites) {
          sidecar = previo;
          if (previo.alineacion !== VERSION_ALINEACION) {
            // Otro algoritmo de alineación: se recalcula con los límites guardados, sin llamar al servicio.
            const r = alinearHabladas(texto, previo.limites, previo.duracionAudio);
            sidecar = { ...previo, palabras: r.palabras, reales: r.reales, desfaseMax: r.desfaseMax, alineacion: VERSION_ALINEACION };
            fs.writeFileSync(sidecarRuta, JSON.stringify(sidecar, null, 2) + '\n');
            console.log(`~ voz ${id}/${i} (${tipo}): realineada (desfase máx ${r.desfaseMax}s)`);
          }
        } // sin `limites` (sidecar antiguo): se vuelve a sintetizar para guardarlos
      }
      if (!sidecar) {
        let ultimoError: unknown = null;
        for (let intento = 1; intento <= REINTENTOS && !sidecar; intento++) {
          try {
            if (!tts) { tts = new MsEdgeTTS({ connectionTimeoutMs: 15000, synthesisTimeoutMs: 30000 }); await tts.setMetadata(voz, FORMATO_AUDIO, { wordBoundaryEnabled: true }); }
            const { audio, limites } = await sintetizar(tts, texto);
            const tmp = `${mp3}.tmp.mp3`;
            fs.writeFileSync(tmp, audio);
            const meta = await parseFile(tmp);
            const duracionAudio = meta.format.duration ?? 0;
            if (!(duracionAudio > 0)) throw new Error('mp3 sin duración válida');
            fs.renameSync(tmp, mp3);
            const habladas = habladasDe(limites);
            const { palabras, reales, desfaseMax } = alinearHabladas(texto, habladas, duracionAudio);
            sidecar = { hash, voz, duracionAudio: +duracionAudio.toFixed(3), palabras, reales, texto, desfaseMax, alineacion: VERSION_ALINEACION, limites: habladas };
            fs.writeFileSync(sidecarRuta, JSON.stringify(sidecar, null, 2) + '\n');
            console.log(`+ voz ${id}/${i} (${tipo}): ${sidecar.duracionAudio}s, ${palabras.length} palabras${reales ? '' : ' (estimadas)'}`);
          } catch (e) {
            ultimoError = e;
            console.warn(`! voz ${id}/${i} intento ${intento}/${REINTENTOS} falló: ${(e as Error).message}`);
            try { tts?.close(); } catch { /* ya cerrado */ }
            tts = null;
            await esperar(1200 * intento);
          }
        }
        if (!sidecar) throw new Error(`No se pudo sintetizar la línea ${i} ("${texto.slice(0, 40)}…"): ${(ultimoError as Error)?.message}`);
      } else {
        console.log(`= voz ${id}/${i} (${tipo}): en caché`);
      }
      medidas.push({ ...lineas[i], archivo: `voz/${id}/${i}.mp3`, duracionAudio: sidecar.duracionAudio, palabras: sidecar.palabras, reales: sidecar.reales, desfaseMax: sidecar.desfaseMax });
    }
  } finally {
    try { tts?.close(); } catch { /* nada */ }
  }
  const tiempos = armarTiempos(id, voz, medidas);
  fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify(tiempos, null, 2) + '\n');
  console.log(`tiempos.json: ${tiempos.lineas.length} líneas, ${tiempos.total.toFixed(2)}s de voz, límites ${tiempos.limitesReales ? 'reales' : 'estimados'}`);
  return tiempos;
};

const esPrincipal = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esPrincipal) {
  const [rutaGuion] = process.argv.slice(2);
  if (!rutaGuion) { console.error('uso: npx tsx scripts/voz.mts <ruta-guion.json>'); process.exit(2); }
  const { plantilla, props } = leerGuion(path.resolve(rutaGuion));
  generarVoz(props.id, props.voz, lineasDe(plantilla, props)).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
