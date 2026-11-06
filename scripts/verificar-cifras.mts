/**
 * REVISOR NUMÉRICO de En Números Rojos: el gate del pipeline. Ningún video se renderiza si una cifra que dice la voz
 * no se puede recalcular contra su dataset dentro de la tolerancia (5 % por defecto).
 *
 *   npx tsx scripts/verificar-cifras.mts <guion.json | props.json> [--json] [--refrescar] [--silencioso]
 *
 * Qué hace:
 *  1. Carga el guion (envoltorio `tesis`/`grafico` de contenido/backlog o contenido/guiones, o un props.json) y lo
 *     valida con el schema zod real (EnvoltorioTesis / EnvoltorioGrafico de src/plantillas/comun/guion.ts).
 *  2. Resuelve TODOS los DatoRef (gancho.grafico, gancho.cifras, escenas[].grafico, escenas[].cifras,
 *     numeroQueNadieMira, miniatura, grafico del Short) con scripts/lib/datos.mts (caché en contenido/datos).
 *  3. Recalcula cada Cifra con calcularCifra y la compara con lo que dice la voz.
 *  4. Reglas extra: una escena `dato` con dígitos en el texto debe declarar `cifras`; una fuente `manual` debe
 *     citar un organismo oficial (y nunca FMI, OCDE, Numbeo ni el Banco Central de Chile).
 * Salida: tabla legible; exit 0 si todo cuadra, 1 si algo falla (2 = no se pudo leer el archivo).
 * Con --json escribe salida/trabajo/<id>.verificacion.json (lo guarda el diario junto al guion).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import { claveDeRef, type Cifra, type DatoRef, type Grafico, type SerieResuelta } from '../src/plantillas/comun/datos';
import { EnvoltorioGrafico, EnvoltorioTesis, GuionGrafico, GuionTesis } from '../src/plantillas/comun/guion';
import { calcularCifra, catalogo, licenciasMalas, resolverDatos, type ResultadoCifra } from './lib/datos.mjs';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const ruta = args.find((a) => !a.startsWith('--'));
const conJson = args.includes('--json');
const refrescar = args.includes('--refrescar');
const silencioso = args.includes('--silencioso');
const log = (s = '') => { if (!silencioso) console.log(s); };

if (!ruta) {
  console.error('uso: npx tsx scripts/verificar-cifras.mts <guion.json|props.json> [--json] [--refrescar]');
  process.exit(2);
}

/** Dominios de organismos oficiales aceptados para datos `manual` (añadir aquí con la licencia verificada). */
const OFICIAL = /(\.gob\.[a-z]{2}|\.gov(\.[a-z]{2})?|\.gub\.uy|\.mil\.[a-z]{2}|cepal\.org|worldbank\.org|un\.org|ilo\.org|ine\.cl|ine\.es|inegi\.org\.mx|indec\.gob\.ar|ibge\.gov\.br|dane\.gov\.co|bcrp\.gob\.pe|banxico\.org\.mx|bcra\.gob\.ar|bcu\.gub\.uy|sec\.gov|europa\.eu|ourworldindata\.org)$/i;
/** Fuentes prohibidas (docs/CONVENCIONES.md): uso comercial sin permiso o términos sin verificar. */
const PROHIBIDO = /(imf\.org|oecd\.org|numbeo\.com|bcentral\.cl|si3\.bcentral\.cl)$/i;

interface FilaCifra { donde: string; texto: string; operacion: string; resultado: ResultadoCifra }
interface Informe {
  id: string; plantilla: string; archivo: string; generadoEn: string; ok: boolean;
  schema: string[]; reglas: string[]; avisos: string[]; datos: Array<{ clave: string; ok: boolean; fuente?: string; error?: string }>;
  cifras: Array<{ donde: string; texto: string; operacion: string; dicho: number; esperado: number | null; desvio: number | null; ok: boolean; detalle: string }>;
}

// ---------------------------------------------------------------- carga
const crudo = (() => {
  try { return JSON.parse(fs.readFileSync(ruta, 'utf8')) as Record<string, any>; } catch (e) {
    console.error(`✗ no pude leer ${ruta}: ${(e as Error).message}`);
    process.exit(2);
  }
})();

/** Normaliza: envoltorio {plantilla, props} o props sueltos (props.json de preparar-*). */
const plantilla: 'tesis' | 'grafico' = crudo.plantilla ?? (crudo.props?.capitulos || crudo.capitulos ? 'tesis' : 'grafico');
const esEnvoltorio = typeof crudo.plantilla === 'string' && crudo.props;
const props: Record<string, any> = esEnvoltorio ? crudo.props : crudo;
const id: string = crudo.id ?? props.id ?? path.basename(ruta).replace(/(\.props)?\.json$/, '');

const erroresSchema: string[] = [];
{
  const schema: z.ZodTypeAny = esEnvoltorio ? (plantilla === 'tesis' ? EnvoltorioTesis : EnvoltorioGrafico) : (plantilla === 'tesis' ? GuionTesis : GuionGrafico);
  const r = schema.safeParse(esEnvoltorio ? crudo : props);
  if (!r.success) for (const i of r.error.issues) erroresSchema.push(`${i.path.join('.') || '(raíz)'}: ${i.message}`);
}

// ---------------------------------------------------------------- recolección
const refs = new Map<string, DatoRef>();
const cifras: Array<{ donde: string; cifra: Cifra }> = [];
const reglas: string[] = [];
const agregarRef = (r?: DatoRef) => { if (r && r.fuente) refs.set(claveDeRef(r), r); };
const agregarGrafico = (g?: Grafico) => agregarRef(g?.datos);
const agregarCifras = (donde: string, lista?: Cifra[]) => {
  for (const [i, c] of (lista ?? []).entries()) {
    cifras.push({ donde: `${donde}.cifras[${i}]`, cifra: c });
    agregarRef(c?.calculo?.datos);
  }
};
const DIGITOS = /\d/;

agregarGrafico(props.gancho?.grafico);
agregarCifras('gancho', props.gancho?.cifras);
if (plantilla === 'tesis') {
  for (const [ci, cap] of (props.capitulos ?? []).entries()) {
    for (const [ei, e] of (cap.escenas ?? []).entries()) {
      const donde = `cap${ci + 1}.esc${ei + 1}(${e.tipo})`;
      agregarGrafico(e.grafico);
      agregarCifras(donde, e.cifras);
      if (e.tipo === 'dato' && DIGITOS.test(e.texto ?? '') && !(e.cifras?.length)) reglas.push(`${donde}: escena dato con números en la voz y sin \`cifras\` declaradas ("${String(e.texto).slice(0, 70)}…")`);
    }
  }
  agregarGrafico(props.numeroQueNadieMira?.grafico);
  agregarCifras('numeroQueNadieMira', props.numeroQueNadieMira?.cifras);
  agregarGrafico(props.miniatura?.grafico);
} else {
  agregarGrafico(props.grafico);
  for (const [ei, e] of (props.escenas ?? []).entries()) {
    const donde = `esc${ei + 1}(${e.tipo})`;
    agregarGrafico(e.grafico);
    agregarCifras(donde, e.cifras);
    if (e.tipo === 'dato' && DIGITOS.test(e.texto ?? '') && !(e.cifras?.length)) reglas.push(`${donde}: escena dato con números en la voz y sin \`cifras\` declaradas ("${String(e.texto).slice(0, 70)}…")`);
  }
}
for (const r of refs.values()) {
  if (r.fuente !== 'manual') continue;
  let host = '';
  try { host = new URL(r.fuenteUrl ?? '').hostname; } catch { /* url inválida */ }
  if (!host) reglas.push(`manual ${r.indicador}: falta fuenteUrl válida`);
  else if (PROHIBIDO.test(host)) reglas.push(`manual ${r.indicador}: fuente PROHIBIDA (${host}): FMI, OCDE, Numbeo y Banco Central de Chile no se usan`);
  else if (!OFICIAL.test(host)) reglas.push(`manual ${r.indicador}: ${host} no está en la lista de organismos oficiales (verifica la licencia y agrégalo a OFICIAL en verificar-cifras.mts)`);
}

// ---------------------------------------------------------------- cálculo
const main = async () => {
  const datosInforme: Informe['datos'] = [];
  const avisos: string[] = [];
  const series: SerieResuelta[] = [];
  for (const [clave, ref] of refs) {
    try {
      const [s] = await resolverDatos([ref], { refrescar });
      series.push(s);
      datosInforme.push({ clave, ok: true, fuente: s.fuenteTexto });
      // Licencia del proveedor original (OWID agrega datos de terceros): debe permitir uso comercial con atribución.
      const malas = licenciasMalas(s.licencia);
      if (malas.length) reglas.push(`${clave}: licencia del proveedor original no es CC BY (${malas.join(' · ')}): no se puede usar en un canal monetizado`);
      else if (ref.fuente !== 'manual' && !catalogo().some((e) => e.fuente === ref.fuente && e.indicador === ref.indicador)) avisos.push(`${clave}: indicador fuera del catálogo (contenido/datos/catalogo.json); verifícalo con datos.mts verificar-catalogo`);
    } catch (e) {
      datosInforme.push({ clave, ok: false, error: (e as Error).message });
    }
  }
  const filas: FilaCifra[] = cifras.map(({ donde, cifra }) => {
    let resultado: ResultadoCifra;
    try { resultado = calcularCifra(cifra, series); } catch (e) {
      resultado = { esperado: null, dicho: cifra?.valor, desvio: null, ok: false, detalle: `excepción: ${(e as Error).message}` };
    }
    return { donde, texto: cifra?.texto ?? '?', operacion: cifra?.calculo?.operacion ?? '?', resultado };
  });

  const fallanDatos = datosInforme.filter((d) => !d.ok);
  const fallanCifras = filas.filter((f) => !f.resultado.ok);
  const ok = erroresSchema.length === 0 && reglas.length === 0 && fallanDatos.length === 0 && fallanCifras.length === 0 && filas.length > 0;

  // ---------------- salida legible
  log(`VERIFICAR CIFRAS · ${id} (${plantilla}) · ${path.relative(RAIZ, path.resolve(ruta)) || ruta}`);
  log(`Schema zod: ${erroresSchema.length ? `✗ ${erroresSchema.length} problema(s)` : '✓'}`);
  for (const e of erroresSchema) log(`  ✗ ${e}`);
  log(`Datos: ${refs.size} referencia(s), ${fallanDatos.length} sin resolver`);
  for (const d of datosInforme) log(`  ${d.ok ? '✓' : '✗'} ${d.clave}${d.ok ? '' : `  → ${d.error}`}`);
  log(`Cifras: ${filas.length} declarada(s), ${fallanCifras.length} fuera de tolerancia`);
  const ancho = { donde: 26, texto: 30 };
  log(`  ${'dónde'.padEnd(ancho.donde)} ${'texto'.padEnd(ancho.texto)} ${'operación'.padEnd(10)} ${'dicho'.padStart(12)} ${'esperado'.padStart(12)} ${'desvío'.padStart(8)}`);
  for (const f of filas) {
    const r = f.resultado;
    const num = (n: number | null) => (n === null || n === undefined || !Number.isFinite(n) ? '—' : Math.abs(n) >= 100 ? Math.round(n).toLocaleString('es-CL') : n.toFixed(3).replace('.', ','));
    log(`${r.ok ? '✓' : '✗'} ${f.donde.slice(0, ancho.donde).padEnd(ancho.donde)} ${f.texto.slice(0, ancho.texto).padEnd(ancho.texto)} ${f.operacion.padEnd(10)} ${num(r.dicho).padStart(12)} ${num(r.esperado).padStart(12)} ${(r.desvio === null || !Number.isFinite(r.desvio) ? '—' : `${(r.desvio * 100).toFixed(1).replace('.', ',')} %`).padStart(8)}`);
    log(`    ${r.detalle}`);
  }
  if (filas.length === 0) log('  ✗ ninguna cifra declarada: el revisor no tiene nada que comprobar');
  if (reglas.length) { log('Reglas:'); for (const r of reglas) log(`  ✗ ${r}`); }
  for (const a of avisos) log(`  ⚠ ${a}`);
  log(ok ? '\n✓ TODAS LAS CIFRAS CUADRAN' : '\n✗ EL GUION NO PASA EL REVISOR NUMÉRICO (no se renderiza)');

  if (conJson) {
    const informe: Informe = {
      id, plantilla, archivo: path.resolve(ruta), generadoEn: new Date().toISOString(), ok,
      schema: erroresSchema, reglas, avisos, datos: datosInforme,
      cifras: filas.map((f) => ({ donde: f.donde, texto: f.texto, operacion: f.operacion, dicho: f.resultado.dicho, esperado: f.resultado.esperado, desvio: f.resultado.desvio, ok: f.resultado.ok, detalle: f.resultado.detalle })),
    };
    const destino = path.join(RAIZ, 'salida', 'trabajo', `${id}.verificacion.json`);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, JSON.stringify(informe, null, 2) + '\n');
    log(`→ ${path.relative(RAIZ, destino)}`);
  }
  // Resumen de una línea a stderr para que el diario lo pueda citar en el estado 'error'.
  if (!ok) {
    const primero = erroresSchema[0] ?? reglas[0] ?? (fallanDatos[0] && `${fallanDatos[0].clave}: ${fallanDatos[0].error}`) ?? (fallanCifras[0] && `"${fallanCifras[0].texto}" (${fallanCifras[0].donde}): ${fallanCifras[0].resultado.detalle}`) ?? 'sin cifras declaradas';
    console.error(`RESUMEN: ${erroresSchema.length} schema, ${reglas.length} reglas, ${fallanDatos.length} datos, ${fallanCifras.length}/${filas.length} cifras mal · primero: ${primero}`);
  }
  process.exit(ok ? 0 : 1);
};

main().catch((e) => { console.error(`✗ ${(e as Error).stack ?? e}`); process.exit(1); });
