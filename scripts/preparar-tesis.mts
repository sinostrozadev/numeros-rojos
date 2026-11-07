/**
 * Prepara un guion de la plantilla `tesis` (largo 16:9) para renderizar:
 *   npx tsx scripts/preparar-tesis.mts <guion.json> [--fixture <series.json>] [--refrescar] [--permitir-duracion]
 * 1) valida el guion (EnvoltorioTesis),
 * 2) resuelve los datos de cada gráfico con scripts/lib/datos.mts (WDI/OWID/manual, con caché) y los guarda en
 *    props.datos[claveDeRef(ref)]; con --fixture (o si el pipeline de datos aún no existe) usa series FIXTURE
 *    (salida/pruebas/fixture-series.json) que el pie de cada gráfico marca en rojo: NO se publica,
 * 2b) visuales v2: fotos de Wikimedia Commons (scripts/lib/imagenes.mts → public/imagenes/<id>/<clave>.*), ilustraciones
 *    ya entregadas (public/ilustraciones/<id>/<clave>.png) y poses de mascota con imagen (public/mascota/<pose>.png);
 *    lo que no se resuelve se avisa con ⚠ y la escena cae al gráfico previo (nunca bloquea el render),
 * 3) voz (msedge-tts) de lineasTesis → public/voz/<id>/ + tiempos.json,
 * 4) plan (tesis/plan.ts) y control de duración (RITMO.largoMin–largoMax, 8:30–12:30),
 * 5) cama + SFX → public/audio/generado/<id>.wav,
 * y escribe salida/trabajo/<id>.props.json (guion + datos + tiempos + audio + duracionFrames) y
 * salida/trabajo/<id>.plan.json (capítulos con timestamps para la descripción, mid-rolls, fixture sí/no).
 * Luego (de madrugada, con flock y por tramos si hace falta; skill videos-largos §5):
 *   npx remotion render src/index.ts Tesis salida/largos/<id>.mp4 --props=salida/trabajo/<id>.props.json
 *   npx remotion still src/index.ts Miniatura salida/largos/<id>-mini.png --props=salida/trabajo/<id>.props.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { generarVoz, RAIZ } from './voz.mjs';
import { generarSonido } from './sonido.mjs';
import { EnvoltorioTesis, lineasDeVozTesis, palabrasTesis, type GuionTesis } from '../src/plantillas/comun/guion';
import { claveDeRef, type DatoRef, type DatosResueltos, type SerieResuelta } from '../src/plantillas/comun/datos';
import { serieFixture } from '../src/plantillas/comun/graficos/fixture';
import { graficosTesis, lineasTesis, planTesis, capitulosDescripcion, reloj } from '../src/plantillas/tesis/plan';
import { RITMO } from '../src/marca/tokens';
import { POSES_MASCOTA, claveDeVisual, type VisualesResueltos } from '../src/plantillas/comun/visual';
import { prepararFotos } from './lib/imagenes.mjs';

const args = process.argv.slice(2);
const ruta = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--fixture');
const iFix = args.indexOf('--fixture');
const rutaFixture = iFix >= 0 ? args[iFix + 1] : undefined;
if (!ruta) { console.error('uso: npx tsx scripts/preparar-tesis.mts <guion.json> [--fixture <series.json>] [--refrescar] [--permitir-duracion]'); process.exit(2); }

const crudo = JSON.parse(fs.readFileSync(path.resolve(ruta), 'utf8'));
const v = EnvoltorioTesis.safeParse(crudo);
if (!v.success) {
  console.error(`✗ guion inválido: ${v.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  process.exit(1);
}
const guion: GuionTesis = v.data.props;
console.log(`guion ${guion.id}: ${guion.capitulos.length} capítulos, ${palabrasTesis(guion)} palabras habladas`);

// ---------------------------------------------------------------- datos
const prepararDatos = async (refs: DatoRef[], fixture: string | undefined, refrescar: boolean): Promise<{ datos: DatosResueltos; fixture: boolean }> => {
  const unicos = [...new Map(refs.map((r) => [claveDeRef(r), r])).values()];
  const datos: DatosResueltos = {};
  const usarFixture = (desde?: string) => {
    const dados: SerieResuelta[] = desde && fs.existsSync(desde) ? [].concat(JSON.parse(fs.readFileSync(desde, 'utf8'))) : [];
    const porClave = new Map(dados.map((s) => [claveDeRef(s.ref), s]));
    for (const r of unicos) datos[claveDeRef(r)] = porClave.get(claveDeRef(r)) ?? serieFixture(r);
    const salida = path.join(RAIZ, 'salida/pruebas/fixture-series.json');
    fs.mkdirSync(path.dirname(salida), { recursive: true });
    fs.writeFileSync(salida, JSON.stringify(Object.values(datos), null, 2) + '\n');
    console.warn(`⚠ datos FIXTURE (inventados, marcados en rojo en pantalla): ${path.relative(RAIZ, salida)} — este video NO se publica`);
    return { datos, fixture: true };
  };
  if (fixture) return usarFixture(path.resolve(fixture));
  try {
    const { resolverDatos } = await import('./lib/datos.mjs');
    const series = await resolverDatos(unicos, { refrescar });
    series.forEach((s, i) => { datos[claveDeRef(unicos[i])] = s; });
    console.log(`datos: ${series.length} series resueltas (${[...new Set(series.map((s) => s.licencia))].join(', ')})`);
    return { datos, fixture: false };
  } catch (e) {
    if (/aún no implementado/.test((e as Error).message)) return usarFixture();
    throw e;
  }
};

const refs = graficosTesis(guion).map((g) => g.datos);
const { datos, fixture } = await prepararDatos(refs, rutaFixture, args.includes('--refrescar'));

// ---------------------------------------------------------------- visuales v2
const pedidosFoto = guion.capitulos.flatMap((c, ci) => c.escenas.flatMap((e, k) => (e.visual?.tipo === 'foto' ? [{ clave: claveDeVisual(ci, k), visual: e.visual }] : [])));
const fotos = await prepararFotos(guion.id, pedidosFoto);
const visuales: VisualesResueltos = { ...fotos.visuales };
for (const clave of fotos.fallidas) console.warn(`⚠ foto ${clave}: sin foto con licencia clara; la escena cae al gráfico previo`);
const ilustraciones: string[] = [];
guion.capitulos.forEach((c, ci) => c.escenas.forEach((e, k) => {
  if (e.visual?.tipo !== 'ilustracion') return;
  const clave = claveDeVisual(ci, k);
  const rel = `ilustraciones/${guion.id}/${clave}.png`;
  if (fs.existsSync(path.join(RAIZ, 'public', rel))) { visuales[clave] = { ...visuales[clave], ilustracion: rel }; ilustraciones.push(clave); }
  else console.warn(`⚠ ilustración ${clave}: falta public/${rel} (pedirla con la skill caratulas-con-gpt); la escena cae al gráfico previo`);
}));
const mascotaPoses = POSES_MASCOTA.filter((p) => fs.existsSync(path.join(RAIZ, 'public', 'mascota', `${p}.png`)));
const conMascota = guion.capitulos.flatMap((c) => c.escenas.filter((e) => e.mascota)).length;
if (conMascota && mascotaPoses.length < POSES_MASCOTA.length) console.warn(`⚠ mascota: ${POSES_MASCOTA.length - mascotaPoses.length} poses sin imagen en public/mascota/ → dibujo de reserva`);
const creditos = [fotos.creditos, ilustraciones.length ? 'Ilustraciones: hechas para el canal con IA (planas, no son fotos reales).' : ''].filter(Boolean).join('\n');
console.log(`visuales: ${Object.values(visuales).filter((x) => x.foto).length}/${pedidosFoto.length} fotos, ${ilustraciones.length} ilustraciones, mascota con ${mascotaPoses.length}/${POSES_MASCOTA.length} poses en imagen`);

// ---------------------------------------------------------------- voz
const lineas = lineasTesis(guion);
const contrato = lineasDeVozTesis(guion);
if (lineas.length !== contrato.length || lineas.some((l, i) => l.texto !== contrato[i])) throw new Error('lineasTesis no coincide con lineasDeVozTesis del contrato');
const tiempos = await generarVoz(guion.id, guion.voz, lineas);

// ---------------------------------------------------------------- plan y duración
const plan = planTesis({ ...guion, visuales }, tiempos, datos);
console.log(`duración: ${reloj(plan.duracionSeg)} (${plan.duracionFrames} frames a ${plan.fps} fps) · mid-rolls en ${plan.midrolls.map(reloj).join(', ')}`);
if ((plan.duracionSeg < RITMO.largoMin || plan.duracionSeg > RITMO.largoMax) && !args.includes('--permitir-duracion')) {
  console.error(`✗ duración ${reloj(plan.duracionSeg)} fuera de ${reloj(RITMO.largoMin)}–${reloj(RITMO.largoMax)}. ${plan.duracionSeg < RITMO.largoMin ? 'Alarga' : 'Recorta'} el guion (o --permitir-duracion para pruebas).`);
  process.exit(1);
}
const primerCorte = plan.midrolls[0];
if (primerCorte !== undefined && primerCorte < 150) console.warn(`⚠ primer mid-roll en ${reloj(primerCorte)} (< 2:30): YouTube lo tolera, pero la skill videos-largos recomienda ≥ 2:30`);

// ---------------------------------------------------------------- sonido
const audio = generarSonido(guion.id, plan.duracionSeg, plan.eventos, plan.capitulos.slice(1).map((c) => c.seg));

// ---------------------------------------------------------------- props y plan
const dir = path.join(RAIZ, 'salida/trabajo');
fs.mkdirSync(dir, { recursive: true });
// capitulosTiempos: lo lee scripts/diario.mts para los timestamps de la descripción.
const capitulosTiempos = plan.capitulos.map((c) => ({ titulo: c.titulo, inicio: +c.seg.toFixed(2), inicioSeg: +c.seg.toFixed(2) }));
const props = { ...guion, datos, visuales, mascotaPoses, tiempos, audio, duracionFrames: plan.duracionFrames, capitulosTiempos, midrollsSeg: plan.midrolls.map((s) => +s.toFixed(2)) };
fs.writeFileSync(path.join(dir, `${guion.id}.props.json`), JSON.stringify(props) + '\n');
const resumen = {
  id: guion.id, plantilla: 'tesis', fixture, duracionSeg: +plan.duracionSeg.toFixed(2), duracionFrames: plan.duracionFrames, fps: plan.fps,
  capitulos: plan.capitulos.map((c) => ({ titulo: c.titulo, seg: +c.seg.toFixed(2), reloj: reloj(c.seg) })),
  descripcionCapitulos: capitulosDescripcion(plan),
  midrolls: plan.midrolls.map((s) => ({ seg: +s.toFixed(2), reloj: reloj(s) })),
  fuentesDatos: [...new Set(Object.values(datos).map((s) => `${s.fuenteTexto} — ${s.fuenteUrl} (${s.licencia})`))],
  /** Créditos de fotos/ilustraciones: scripts/diario.mts los agrega a la descripción antes de las fuentes. */
  creditos,
  visualesSinResolver: [...fotos.fallidas, ...guion.capitulos.flatMap((c, ci) => c.escenas.flatMap((e, k) => (e.visual?.tipo === 'ilustracion' && !visuales[claveDeVisual(ci, k)]?.ilustracion ? [claveDeVisual(ci, k)] : [])))],
};
fs.writeFileSync(path.join(dir, `${guion.id}.plan.json`), JSON.stringify(resumen, null, 2) + '\n');
console.log(`✓ salida/trabajo/${guion.id}.props.json + .plan.json${fixture ? ' (FIXTURE: no publicar)' : ''}`);
console.log(resumen.descripcionCapitulos);
