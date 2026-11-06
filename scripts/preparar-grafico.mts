/**
 * Prepara un guion de la plantilla `grafico` (Short 9:16) para renderizar:
 *   npx tsx scripts/preparar-grafico.mts <guion.json> [--fixture <series.json>] [--refrescar] [--permitir-duracion]
 * Igual que preparar-tesis: valida (EnvoltorioGrafico) → datos (lib/datos.mts o FIXTURE marcado) → voz
 * (lineasGrafico) → plan (grafico/plan.ts) y duración (RITMO.shortMin–shortMax) → cama + SFX →
 * salida/trabajo/<id>.props.json. Luego:
 *   flock -w 1800 /tmp/bolita-render.lock npx remotion render src/index.ts Grafico salida/bandeja/<id>.mp4 --props=salida/trabajo/<id>.props.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { generarVoz, RAIZ } from './voz.mjs';
import { generarSonido } from './sonido.mjs';
import { EnvoltorioGrafico, lineasDeVozGrafico, palabrasGrafico, type GuionGrafico } from '../src/plantillas/comun/guion';
import { claveDeRef, type DatoRef, type DatosResueltos, type SerieResuelta } from '../src/plantillas/comun/datos';
import { serieFixture } from '../src/plantillas/comun/graficos/fixture';
import { lineasGrafico, planGrafico } from '../src/plantillas/grafico/plan';
import { RITMO } from '../src/marca/tokens';

const args = process.argv.slice(2);
const iFix = args.indexOf('--fixture');
const rutaFixture = iFix >= 0 ? args[iFix + 1] : undefined;
const ruta = args.find((a, i) => !a.startsWith('--') && (iFix < 0 || i !== iFix + 1));
if (!ruta) { console.error('uso: npx tsx scripts/preparar-grafico.mts <guion.json> [--fixture <series.json>] [--refrescar] [--permitir-duracion]'); process.exit(2); }

const crudo = JSON.parse(fs.readFileSync(path.resolve(ruta), 'utf8'));
const v = EnvoltorioGrafico.safeParse(crudo);
if (!v.success) {
  console.error(`✗ guion inválido: ${v.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  process.exit(1);
}
const guion: GuionGrafico = v.data.props;
console.log(`guion ${guion.id}: ${guion.escenas.length} escenas, ${palabrasGrafico(guion)} palabras habladas`);

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
    console.log(`datos: ${series.length} series resueltas`);
    return { datos, fixture: false };
  } catch (e) {
    if (/aún no implementado/.test((e as Error).message)) return usarFixture();
    throw e;
  }
};

const refs = [guion.grafico, ...guion.escenas.flatMap((e) => (e.grafico ? [e.grafico] : []))].map((g) => g.datos);
const { datos, fixture } = await prepararDatos(refs, rutaFixture, args.includes('--refrescar'));

const lineas = lineasGrafico(guion);
const contrato = lineasDeVozGrafico(guion);
if (lineas.length !== contrato.length || lineas.some((l, i) => l.texto !== contrato[i])) throw new Error('lineasGrafico no coincide con lineasDeVozGrafico del contrato');
const tiempos = await generarVoz(guion.id, guion.voz, lineas);

const plan = planGrafico(guion, tiempos, datos);
console.log(`duración: ${plan.duracionSeg.toFixed(1)} s (${plan.duracionFrames} frames a ${plan.fps} fps)`);
if ((plan.duracionSeg < RITMO.shortMin || plan.duracionSeg > RITMO.shortMax) && !args.includes('--permitir-duracion')) {
  console.error(`✗ duración ${plan.duracionSeg.toFixed(1)} s fuera de ${RITMO.shortMin}–${RITMO.shortMax} s. ${plan.duracionSeg < RITMO.shortMin ? 'Alarga' : 'Recorta'} el guion (o --permitir-duracion para pruebas).`);
  process.exit(1);
}
const audio = generarSonido(guion.id, plan.duracionSeg, plan.eventos);

const dir = path.join(RAIZ, 'salida/trabajo');
fs.mkdirSync(dir, { recursive: true });
const props = { ...guion, datos, tiempos, audio, duracionFrames: plan.duracionFrames };
fs.writeFileSync(path.join(dir, `${guion.id}.props.json`), JSON.stringify(props) + '\n');
console.log(`✓ salida/trabajo/${guion.id}.props.json${fixture ? ' (FIXTURE: no publicar)' : ''}`);
