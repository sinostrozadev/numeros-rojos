/**
 * Genera guiones nuevos de En Números Rojos para el backlog con `claude -p` (suscripción Max de Santiago; nunca la API de
 * Anthropic).
 *
 *   npx tsx scripts/generar-guiones.mts [--plantilla tesis|grafico] [--n 1] [--tema "…"] [--estructura comparacion|…]
 *                                        [--derivar-de <id-largo>] [--modelo X] [--dry-run] [--mostrar-prompt]
 *   npx tsx scripts/generar-guiones.mts --actualizar-ejemplos [tesis-<slug>,grafico-<slug>]
 *
 * System prompt = docs/GUION.md (tal cual). Mensaje = el contrato común TAL CUAL (src/plantillas/comun/guion.ts +
 * src/plantillas/comun/datos.ts) + el catálogo de indicadores (contenido/datos/catalogo.json, la fuente de verdad de qué
 * datos se pueden usar) + títulos ya usados + 1 ejemplo del backlog que no esté ya dentro de GUION.md + la regla de
 * rotación de estructuras (ninguna > 40 % de los largos). Se pide SOLO un array JSON; se parsea con tolerancia, se valida con
 * EnvoltorioTesis / EnvoltorioGrafico (src/plantillas/comun/guion.ts) + chequeos propios (dice/cifras literales, lista negra,
 * título ≤ 60) y, si existe, con scripts/verificar-cifras.mts. Si algo falla, se reintenta UNA vez contándole a Claude por qué.
 * Cada guion queda en contenido/backlog/<plantilla>-<slug>.json con id `pendiente-<plantilla>-<slug>`.
 *
 * v2 (2026-11-07): el contrato incluye src/plantillas/comun/visual.ts (foto/mapa/iconos/ilustración + mascota) y el system
 * prompt trae GUION.md §7b. Además de zod, los chequeos propios exigen el ritmo visual del largo (2–4 mascotas,
 * ≤ 2 ilustraciones, 2 alternativas por foto, `dice` literal, nada de fotos seguidas sin gráfico; topes v3: 8–24 visuales, 2–5
 * fotos) y cada `busqueda` de foto se
 * prueba contra la API de Wikimedia Commons (con las mismas reglas de licencia que scripts/lib/imagenes.mts).
 * v3 (2026-11-07, pedido de Santiago al ver Chile-Corea v2): `versus`, `sellos`, `marca` en iconos y `viaje` en mapa
 * (GUION.md §7c). Los chequeos exigen `dice` literal en todo eso, ≤ 2 viajes, 2–4 sellos (≤ 3 por escena), iconos o
 * versus en cada enumeración de ≥ 3 cosas (heurística `enumeraciones`), y el validador de ritmo de la plantilla
 * (`problemasDeRitmo` de tesis/plan.ts con tiempos ESTIMADOS: espera antes de un gráfico ≤ 3 s, nada fijo > 12 s…).
 * Errores de ritmo = guion descartado (reintento contándoselo a Claude); avisos = ⚠ en consola.
 * Modelo por defecto: opus (con el de la sesión no cabía en el tiempo; lección de Línea Punteada). Un guion tesis ≈ 5–12 min.
 *
 *   --derivar-de <id>      saca Shorts (`grafico`) de un largo existente: mismos hechos y datasets, texto 100 % nuevo,
 *                          `enlaceLargo` = <id>. Implica --plantilla grafico; --n por defecto 2.
 *   --revisar <guion.json> corre sobre un guion ya escrito los mismos chequeos (zod + propios + ritmo estimado), sin llamar a
 *                          Claude ni a Commons; sale con código 1 si hay errores.
 *   --actualizar-ejemplos  reescribe el bloque de ejemplos de docs/GUION.md §12 con los guiones indicados del backlog
 *                          (por defecto tesis-chile-corea,grafico-irlanda-consumo).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import type { z } from 'zod';
import {
  ESTRUCTURAS, EnvoltorioGrafico, EnvoltorioTesis, PLANTILLAS_CANAL, VOZ_POR_DEFECTO, type GuionTesis, type PlantillaCanal,
} from '../src/plantillas/comun/guion';
import { estimarTiempos } from '../src/plantillas/comun/plan';
import { claveDeVisual, type VisualesResueltos } from '../src/plantillas/comun/visual';
import { lineasTesis, planTesis, problemasDeRitmo } from '../src/plantillas/tesis/plan';
import { clasificarLicencia } from './lib/imagenes.mjs';
import { DIR_BACKLOG, DIR_GUIONES, RAIZ, asegurarDirectorios, correr, escribirJson, leerBandeja, slugificar } from './lib/operacion.mjs';

const { values: opc, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    plantilla: { type: 'string' },
    n: { type: 'string' },
    tema: { type: 'string' },
    estructura: { type: 'string' },
    'derivar-de': { type: 'string' },
    modelo: { type: 'string', default: 'opus' },
    'dry-run': { type: 'boolean', default: false },
    'mostrar-prompt': { type: 'boolean', default: false },
    'actualizar-ejemplos': { type: 'boolean', default: false },
    revisar: { type: 'string' },
  },
  allowPositionals: true,
});

const rel = (p: string) => path.relative(RAIZ, p);
const ARCHIVO_GUION = path.join(RAIZ, 'docs', 'GUION.md');
const ARCHIVO_CATALOGO = path.join(RAIZ, 'contenido', 'datos', 'catalogo.json');
const MAX_TITULO = 60;
const TOPE_ESTRUCTURA = 0.4;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Crudo = { plantilla?: string; id?: string; titulo?: string; descripcion?: string; hashtags?: string[]; props?: Record<string, any> };

// ---------------------------------------------------------------- lectura del repo
/** Guiones en crudo (no se usa leerBacklog de operacion: su GuionSchema es el de la fábrica madre). */
const leerCrudos = (dir: string): Array<Crudo & { ruta: string }> =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().flatMap((f) => {
      const ruta = path.join(dir, f);
      try { return [{ ...(JSON.parse(fs.readFileSync(ruta, 'utf8')) as Crudo), ruta }]; } catch { return []; }
    })
    : [];

const todos = () => [...leerCrudos(DIR_GUIONES), ...leerCrudos(DIR_BACKLOG)];

const leerGuionMd = (): string => {
  if (!fs.existsSync(ARCHIVO_GUION)) throw new Error('falta docs/GUION.md (es el system prompt del generador)');
  return fs.readFileSync(ARCHIVO_GUION, 'utf8');
};

/** Contrato común tal cual: el modelo ve exactamente lo que se le exige. */
const textoSchema = () => ['guion.ts', 'datos.ts', 'visual.ts'].map((f) => {
  const ruta = path.join(RAIZ, 'src', 'plantillas', 'comun', f);
  return `// ===== src/plantillas/comun/${f} =====\n${fs.readFileSync(ruta, 'utf8')}`;
}).join('\n\n');

/** Catálogo compacto (una línea por indicador). Si no existe, se avisa: solo valen los indicadores de GUION.md §8. */
export const textoCatalogo = (): string => {
  if (!fs.existsSync(ARCHIVO_CATALOGO)) {
    console.error('  ⚠ falta contenido/datos/catalogo.json: el prompt solo trae los indicadores de GUION.md §8.');
    return '(catálogo no disponible: usa solo los indicadores listados en GUION.md §8)';
  }
  const c = JSON.parse(fs.readFileSync(ARCHIVO_CATALOGO, 'utf8')) as { indicadores?: Array<Record<string, string>> };
  return (c.indicadores ?? []).map((i) =>
    `- ${i.fuente} · ${i.indicador} · ${i.etiqueta} [${i.unidad ?? ''}] · años ${i.anios ?? '?'} · ${i.paraQue ?? i.descripcion ?? ''}`).join('\n');
};

// ---------------------------------------------------------------- rotación de estructuras
const conteoEstructuras = () => {
  const largos = todos().filter((g) => g.plantilla === 'tesis');
  const n = Object.fromEntries(ESTRUCTURAS.map((e) => [e, 0])) as Record<string, number>;
  for (const g of largos) if (g.props && g.props.estructura in n) n[g.props.estructura]++;
  return { total: largos.length, n };
};

/** Estructuras usables sin pasar del 40 % (contando los nuevos), de la menos usada a la más. */
const estructurasPermitidas = (cuantos = 1): string[] => {
  const { total, n } = conteoEstructuras();
  const ok = ESTRUCTURAS.filter((e) => total + cuantos < 3 || (n[e] + cuantos) / (total + cuantos) <= TOPE_ESTRUCTURA);
  return (ok.length ? [...ok] : [...ESTRUCTURAS]).sort((a, b) => n[a] - n[b]);
};

const textoRotacion = (cuantos: number) => {
  const { total, n } = conteoEstructuras();
  return `Largos existentes: ${total} (${ESTRUCTURAS.map((e) => `${e} ${n[e]}`).join(', ')}). Ninguna estructura puede superar el ` +
    `${TOPE_ESTRUCTURA * 100} % de los largos. Permitidas ahora, de la menos usada a la más: ${estructurasPermitidas(cuantos).join(', ')}. ` +
    'Si generas varios, varía la estructura entre ellos.';
};

// ---------------------------------------------------------------- prompt
const formaEnvoltorio = (p: PlantillaCanal) =>
  `{ "plantilla": "${p}", "id": "pendiente-${p}-<slug>", "titulo": "≤ ${MAX_TITULO} caracteres", "descripcion": "línea 1 = la pregunta…", ` +
  `"hashtags": [${p === 'grafico' ? '"#shorts", ' : ''}"#economia", …], "props": { "id": <igual al id>, …según el schema… } }`;

const REGLAS = `REGLAS DURAS (si no se cumplen, el guion se descarta):
- Valida contra EnvoltorioTesis / EnvoltorioGrafico del schema de arriba (palabras, escenas, giro, reenganches, fuentes, cifras).
- SOLO datos del catálogo (fuente + indicador exactos), ISO3 reales y años dentro del rango del catálogo. Nada de FMI, Numbeo,
  OCDE, Banco Central de Chile ni slugs de OWID fuera del catálogo. "manual" solo con URL de organismo oficial.
- Cada número que dice la voz va en cifras[] de SU escena con "texto" copiado LITERAL del texto y un "calculo" que reproduzca el
  número con los datos reales (variacion en %, ver GUION.md §8). No inventes valores: si no sabes el dato exacto de un año, no lo
  afirmes con número. El revisor numérico recalcula todo contra la API con tolerancia 5 %.
- "dice" y "rotulo.dice": palabra literal del texto de esa escena. Un gráfico = un indicador. Toda escena "dato" lleva grafico.
- LARGO: dirección visual de GUION.md §7b y §7c: 8–24 escenas con "visual" de ≥ 3 tipos (foto, mapa, iconos, ilustracion, versus), 2–5
  fotos, ≤ 2 ilustraciones, 2–4 escenas con "mascota" (≤ 1 de cada 3 por capítulo, nunca en significado). Cada foto: "busqueda" en
  inglés concreta (nombre propio + lugar/año, 2–5 palabras, como el título de un archivo de Commons), 2 "alternativas", "pie" con
  lugar y año. Nunca dos escenas seguidas con foto sin gráfico. "dividido" solo si la escena tiene visual Y grafico; úsalo con
  generosidad (foto/mapa/iconos a la izquierda, gráfico a la derecha).
- "dice" literal (palabra del texto de ESA escena, con su puntuación) en: gráfico, rótulo, visual, cada ítem de iconos y de versus,
  apuesta, viaje, cada sello y mascota.
- RITMO (lo mide problemasDeRitmo con la voz estimada): la espera antes de que entre un gráfico ≤ 3 s (su "dice" en las primeras
  ~8 palabras de la escena, o un visual que cubra ese tramo); nada fijo > 12 s (foto sola, frase grande sin visual, iconos ya
  completos); un ejemplo hablado ("piensa en dos familias") lleva iconos propios, no la tarjeta de espera del gráfico.
- ENUMERACIONES: toda oración que nombra ≥ 3 cosas en fila ("no tiene petróleo, ni cobre…", "máquinas, edificios, caminos,
  puertos") lleva "iconos" (con "marca": "no" en lo que falta o sobra, "si" en lo que hay) o "versus" (dos países: lo que tiene
  y no tiene cada uno, + "apuesta" si la voz dice quién era el favorito).
- SELLOS: 2–4 en el video (≤ 3 por escena), solo en la cifra fuerte que la voz acaba de decir ("Tres a uno" → "3 A 1"; "unas
  cuatro veces" → "4×"), con la bandera del país del dato.
- VIAJE (mapa con "viaje": desde → hasta): 1–2 por video, SOLO cuando el protagonista cambia de país de forma grande (de Chile a
  Corea, de Corea a "alguien que vive en Lima"); nunca escena a escena. Puede ir "dividido" con el gráfico.
- Título ≤ ${MAX_TITULO} caracteres, sin palabras prohibidas, sin "Los 10…", no repetido ni parafraseado de la lista de usados.
- Sin consejo financiero, sin catastrofismo, sin opinión política, sin "experto", sin la lista negra de GUION.md §6.
- No incluyas campos que calcula el pipeline (datos resueltos, tiempos, duraciones).`;

const construirPrompt = (p: PlantillaCanal, n: number, extra: string, ejemplos: Crudo[], usados: string[]) => `Genera ${n} guion(es) NUEVOS de la plantilla "${p}" para En Números Rojos.
${extra}
=== CONTRATO (schema zod común, tal cual; props → Guion${p === 'tesis' ? 'Tesis' : 'Grafico'}, guion completo → Envoltorio${p === 'tesis' ? 'Tesis' : 'Grafico'}) ===
\`\`\`ts
${textoSchema()}
\`\`\`

=== FORMA DEL GUION (envoltorio) ===
${formaEnvoltorio(p)}

=== CATÁLOGO DE INDICADORES PERMITIDOS (contenido/datos/catalogo.json; fuente · indicador · etiqueta [unidad] · años · para qué) ===
${textoCatalogo()}

=== ROTACIÓN DE ESTRUCTURAS ===
${p === 'tesis' ? textoRotacion(n) : 'No aplica al Short (pero no repitas el país protagonista del último Short del backlog).'}

=== EJEMPLOS DEL BACKLOG (${ejemplos.length}; además de los de GUION.md §12) ===
${ejemplos.length ? ejemplos.map((g) => JSON.stringify(g, null, 1)).join('\n\n') : '(los de GUION.md §12 bastan)'}

=== TÍTULOS YA USADOS (no repetir ni parafrasear; sus temas están tomados salvo que se pida derivar) ===
${usados.length ? usados.map((t) => `- ${t}`).join('\n') : '(ninguno)'}

${REGLAS}

RESPONDE SOLO con un array JSON válido de ${n} objeto(s) con la forma del envoltorio. Sin texto antes ni después, sin comentarios, sin bloque de código markdown.`;

// ---------------------------------------------------------------- claude
const llamarClaude = async (prompt: string): Promise<string> => {
  const args = ['-p', '--output-format', 'text', '--system-prompt', leerGuionMd()];
  if (opc.modelo) args.push('--model', opc.modelo);
  args.push('Sigue las instrucciones del texto que recibes por stdin y responde exactamente lo que piden.');
  const r = await correr('claude', args, { silencioso: true, entrada: prompt, env: { CLAUDECODE: '' }, timeoutMs: 20 * 60_000 });
  if (r.codigo !== 0) throw new Error(`claude -p terminó con código ${r.codigo}: ${r.salida.slice(-500)}`);
  if (r.salida.length < 400 && /hit your .*limit/i.test(r.salida)) throw new Error(`cupo de la suscripción agotado: ${r.salida.trim()}`);
  return r.salida;
};

/** Primer array JSON de un texto (tolera texto alrededor, cercos de código y comas colgantes). */
export const extraerArray = (texto: string): unknown[] => {
  const sinCercos = texto.replace(/```(?:json)?/g, '');
  const ini = sinCercos.indexOf('[');
  const fin = sinCercos.lastIndexOf(']');
  if (ini < 0 || fin <= ini) throw new Error(`La respuesta no contiene un array JSON:\n${texto.slice(0, 400)}`);
  const candidato = sinCercos.slice(ini, fin + 1);
  let v: unknown;
  try { v = JSON.parse(candidato); } catch { v = JSON.parse(candidato.replace(/,\s*([\]}])/g, '$1')); }
  if (!Array.isArray(v)) throw new Error('la respuesta no es un array');
  return v;
};

// ---------------------------------------------------------------- validación
const NEGRA = /\b(sin embargo|además|es importante destacar|cabe (mencionar|destacar)|increíble|fascinante|curiosamente|sorprendentemente|sabías que|sin duda|en este video|hoy vamos a ver|como ya sabes|en conclusión|en resumen|sin más preludios|experto)\b/i;

const problemasZod = (r: z.SafeParseReturnType<unknown, unknown>) =>
  r.success ? [] : r.error.issues.slice(0, 8).map((i) => `${i.path.join('.') || '(raíz)'}: ${i.message}`);

/** Chequeos que el schema no hace: literalidad de dice/cifras, lista negra, título ≤ 60. */
const chequeosPropios = (g: Crudo): string[] => {
  const mal: string[] = [];
  const p = g.props ?? {};
  if ((g.titulo ?? '').length > MAX_TITULO) mal.push(`título de ${(g.titulo ?? '').length} caracteres (> ${MAX_TITULO})`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const escenas: any[] = g.plantilla === 'tesis' ? (p.capitulos ?? []).flatMap((c: any) => c.escenas ?? []) : (p.escenas ?? []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloques: Array<{ texto: string; cifras?: any[]; dices: string[] }> = [
    { texto: p.gancho?.texto ?? '', cifras: p.gancho?.cifras, dices: [] },
    ...escenas.map((e) => ({ texto: e.texto ?? '', cifras: e.cifras, dices: [e.grafico?.dice, e.rotulo?.dice].filter(Boolean) })),
  ];
  if (p.numeroQueNadieMira) bloques.push({ texto: p.numeroQueNadieMira.texto ?? '', cifras: p.numeroQueNadieMira.cifras, dices: [p.numeroQueNadieMira.grafico?.dice].filter(Boolean) });
  for (const b of bloques) {
    for (const d of b.dices) if (!b.texto.includes(d)) mal.push(`dice "${d}" no está literal en "${b.texto.slice(0, 50)}…"`);
    for (const c of b.cifras ?? []) if (!b.texto.includes(c.texto)) mal.push(`cifra "${c.texto}" no está literal en "${b.texto.slice(0, 50)}…"`);
    if (NEGRA.test(b.texto)) mal.push(`lista negra en "${b.texto.slice(0, 60)}…"`);
  }
  if (g.plantilla === 'tesis') mal.push(...chequeosVisuales(escenas));
  return mal.slice(0, 10);
};

const palabrasDe = (t: string) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
/** Un tramo que empieza con preposición ("en 1962", "según el Banco Mundial", "durante veinte años") o trae cifras es contexto, no ítem. */
const NO_ITEM = /^(?:en|de|del|entre|seg[uú]n|durante|para|por|con|desde|hasta|sobre|hacia|que|como)\b|\d/i;

/** Muletillas con "y"/"o"/coma que no son listas. */
const MODISMOS = /\b(?:tarde o temprano|m[aá]s o menos|sobre todo|uno a uno|en cambio|por ejemplo|poco a poco|año tras año)\b/gi;

/**
 * ¿La oración enumera ≥ 3 cosas? Tramos separados por comas, ":", ";", " ni ", " y ", " o ". Un tramo es ÍTEM si tiene ≤ 4
 * palabras (el primero de la racha ≤ 6: trae la cabeza "Corea también tuvo una guerra") y no es contexto (empieza con preposición o
 * trae cifras). Cuenta una racha de ≥ 3 ítems seguidos si además: tiene ≥ 4 ítems, o un " y "/" o "/" ni " dentro, o todos sus ítems
 * menos el primero son de ≤ 2 palabras ("pescado, minerales, seda cruda"). Así "Pero la línea, mirada de lejos, sube." no cuenta.
 */
const enumera = (oracion: string) => {
  const partes = oracion.replace(MODISMOS, 'MODISMO').split(/(\s*[,:;]\s*|\s+(?:ni|y|o)\s+)/i);
  let items: number[] = [];
  let conjuncion = false;
  const cierra = () => {
    const ok = items.length >= 3 && (items.length >= 4 || conjuncion || items.slice(1).every((n) => n <= 2));
    items = []; conjuncion = false;
    return ok;
  };
  for (let k = 0; k < partes.length; k += 2) {
    const t = partes[k].replace(/^[¿¡"«]+|[.?!…"»]+$/g, '').trim();
    const sep = (partes[k - 1] ?? '').trim().toLowerCase();
    const n = palabrasDe(t);
    const esItem = !!t && !NO_ITEM.test(t) && !/MODISMO/.test(t) && (n <= 4 || (items.length === 0 && n <= 6));
    // "…, un Estado que funciona y universidades con más de un siglo de historia": la conjunción cierra la lista aunque el
    // último ítem sea largo.
    if (!esItem) { if (/^(?:y|o|ni)$/.test(sep)) conjuncion = true; if (cierra()) return true; continue; }
    if (items.length && /^(?:y|o|ni)$/.test(sep)) conjuncion = true;
    items.push(n);
  }
  return cierra();
};

/**
 * Oraciones del texto que enumeran ≥ 3 cosas (heurística, GUION.md §7c): ≥ 3 tramos cortos SEGUIDOS (≤ 4 palabras; el primero ≤ 6)
 * que no son contexto (preposición o cifra). Caza "Chile tiene minas, puertos, un Estado que funciona y…", "pescado, minerales,
 * seda cruda", "máquinas, edificios, caminos, puertos", "una guerra, ayuda extranjera y gobiernos militares"; deja pasar
 * "Corea, en cambio, vivía de…", "Entre 1981 y 1983, …" y "Según el Banco Mundial, en el año 2000…".
 */
export const enumeraciones = (texto: string): string[] =>
  texto.split(/(?<=[.?!…])\s+/).filter(enumera);

/** Ritmo visual del largo (GUION.md §7b): lo que zod no mide. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chequeosVisuales = (escenas: any[]): string[] => {
  const mal: string[] = [];
  const con = escenas.filter((e) => e.visual);
  const tipos = new Set(con.map((e) => e.visual.tipo));
  const n = (t: string) => con.filter((e) => e.visual.tipo === t).length;
  const mascotas = escenas.filter((e) => e.mascota).length;
  const viajes = con.filter((e) => e.visual.tipo === 'mapa' && e.visual.viaje).length;
  const sellos = escenas.reduce((s, e) => s + (e.sellos?.length ?? 0), 0);
  if (con.length < 8 || con.length > 24) mal.push(`${con.length} escenas con visual; el largo lleva 8–24 (§7b)`);
  if (tipos.size < 3) mal.push(`visuales de solo ${tipos.size} tipo(s); mezcla ≥ 3 de foto/mapa/iconos/ilustracion/versus`);
  if (n('foto') < 2 || n('foto') > 5) mal.push(`${n('foto')} fotos; van 2–5`);
  if (n('ilustracion') > 2) mal.push(`${n('ilustracion')} ilustraciones; máximo 2`);
  if (mascotas < 2 || mascotas > 4) mal.push(`${mascotas} mascotas; van 2–4`);
  if (viajes > 2) mal.push(`${viajes} mapas con viaje; máximo 2 (solo en los cambios grandes de país)`);
  if (sellos < 2 || sellos > 4) mal.push(`${sellos} sellos; van 2–4 en el video, en las cifras fuertes`);
  escenas.forEach((e, i) => {
    const t: string = e.texto ?? '';
    const v = e.visual ?? {};
    const dices: string[] = [
      v.dice, v.apuesta?.dice, v.viaje?.dice, e.mascota?.dice,
      ...(v.items ?? []).map((it: { dice?: string }) => it.dice),
      ...(v.lados ?? []).flatMap((l: { items?: Array<{ dice?: string }> }) => (l.items ?? []).map((it) => it.dice)),
      ...(e.sellos ?? []).map((s: { dice?: string }) => s.dice),
    ].filter(Boolean);
    for (const d of dices) if (!t.includes(d)) mal.push(`dice visual "${d}" no está literal en "${t.slice(0, 50)}…"`);
    if ((e.sellos?.length ?? 0) > 3) mal.push(`escena "${t.slice(0, 40)}…": ${e.sellos.length} sellos; máximo 3 por escena`);
    if (e.mascota && e.tipo === 'significado') mal.push('la mascota no va en significado');
    const enums = enumeraciones(t);
    if (enums.length && !['iconos', 'versus'].includes(v.tipo)) mal.push(`enumeración sin iconos ni versus: "${enums[0].slice(0, 70)}"`);
    if (v.tipo === 'foto') {
      if ((v.alternativas ?? []).length < 2) mal.push(`foto "${v.busqueda}" sin 2 alternativas`);
      if (!v.pie) mal.push(`foto "${v.busqueda}" sin pie (lugar y año)`);
      const previa = escenas[i - 1];
      if (i > 0 && previa?.visual?.tipo === 'foto' && !e.grafico && !previa.grafico) mal.push(`dos fotos seguidas sin gráfico en medio ("${previa.visual.busqueda}", "${v.busqueda}")`);
    }
  });
  return mal;
};

/**
 * Validador de ritmo de la plantilla (tesis/plan.ts) con tiempos ESTIMADOS de la voz. Las fotos cuentan como resueltas (ya se
 * comprobó que Commons las tiene); las ilustraciones no (pueden no llegar: el ritmo tiene que aguantar sin ellas).
 */
const ritmoTesis = (g: GuionTesis): { errores: string[]; avisos: string[] } => {
  const visuales: VisualesResueltos = {};
  g.capitulos.forEach((c, ci) => c.escenas.forEach((e, k) => {
    if (e.visual?.tipo === 'foto') visuales[claveDeVisual(ci, k)] = { foto: { archivo: 'estimado.jpg', ancho: 1600, alto: 900, titulo: e.visual.busqueda, autor: '-', licencia: 'CC0', pagina: 'https://commons.wikimedia.org/' } };
  }));
  const conVisuales = { ...g, visuales };
  const plan = planTesis(conVisuales, estimarTiempos(g.id, VOZ_POR_DEFECTO, lineasTesis(g)));
  return problemasDeRitmo(plan, conVisuales as GuionTesis);
};

// ---------------------------------------------------------------- fotos: ¿Commons tiene algo con licencia?
const UA_COMMONS = 'EnNumerosRojos/1.0 (canal de YouTube En Numeros Rojos; contacto: sinostrozadev@gmail.com)';

/** true si la búsqueda devuelve ≥ 1 jpg/png ≥ 1200 px con licencia libre y sin restricciones (mismas reglas que lib/imagenes). */
const hayFotoEnCommons = async (busqueda: string): Promise<boolean> => {
  const p = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '1', prop: 'imageinfo', iiprop: 'extmetadata|size|mime',
    iiextmetadatafilter: 'LicenseShortName|Restrictions', generator: 'search', gsrsearch: `${busqueda} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '20',
  });
  const r = await fetch(`https://commons.wikimedia.org/w/api.php?${p}`, { headers: { 'User-Agent': UA_COMMONS, 'Api-User-Agent': UA_COMMONS } });
  if (!r.ok) throw new Error(`Commons respondió ${r.status}`);
  const d = (await r.json()) as { query?: { pages?: Record<string, { imageinfo?: Array<{ width: number; height: number; mime: string; extmetadata?: Record<string, { value: string }> }> }> } };
  return Object.values(d.query?.pages ?? {}).some((pg) => {
    const ii = pg.imageinfo?.[0];
    const m = ii?.extmetadata ?? {};
    return !!ii && /^image\/(jpeg|png)$/.test(ii.mime) && Math.max(ii.width, ii.height) >= 1200 && !!clasificarLicencia(m.LicenseShortName?.value)
      && !(m.Restrictions?.value ?? '').replace(/<[^>]*>/g, '').trim();
  });
};

/** Fotos del guion cuya búsqueda Y alternativas no devuelven nada usable. Si Commons no responde, avisa y no bloquea. */
const verificarFotos = async (g: Crudo): Promise<string[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fotos = (g.props?.capitulos ?? []).flatMap((c: any) => c.escenas ?? []).map((e: any) => e.visual).filter((v: any) => v?.tipo === 'foto');
  const mal: string[] = [];
  try {
    for (const v of fotos) {
      let ok = false;
      for (const q of [v.busqueda, ...(v.alternativas ?? [])]) if ((ok = await hayFotoEnCommons(q))) break;
      if (!ok) mal.push(`foto sin resultado con licencia en Commons: "${v.busqueda}" ni sus alternativas (usa nombre propio + lugar/año en inglés)`);
    }
  } catch (e) {
    console.error(`  ⚠ no pude consultar Commons (${(e as Error).message}); las fotos se resuelven en preparar-tesis`);
  }
  return mal;
};

/** Corre el revisor numérico (scripts/verificar-cifras.mts). Devuelve los problemas, o [] si pasa o no existe. */
const verificarCifras = async (ruta: string): Promise<string[]> => {
  const script = path.join(RAIZ, 'scripts', 'verificar-cifras.mts');
  if (!fs.existsSync(script)) return [];
  const r = await correr('npx', ['tsx', script, ruta], { silencioso: true, timeoutMs: 10 * 60_000 });
  if (r.codigo === 0) return [];
  const lineas = r.salida.split('\n').filter((l) => /✗/.test(l)).map((l) => l.trim()).slice(0, 8);
  return lineas.length ? lineas : [r.salida.trim().split('\n').slice(-3).join(' ')];
};

// ---------------------------------------------------------------- ejemplos en GUION.md
const actualizarEjemplos = (nombres: string[]) => {
  const md = leerGuionMd();
  const ini = '<!-- EJEMPLOS:INICIO';
  const fin = '<!-- EJEMPLOS:FIN -->';
  const a = md.indexOf(ini);
  const b = md.indexOf(fin);
  if (a < 0 || b < a) throw new Error('docs/GUION.md no tiene los marcadores EJEMPLOS:INICIO / EJEMPLOS:FIN');
  const cabecera = md.slice(a, md.indexOf('-->', a) + 3);
  const bloques = nombres.map((nom) => {
    const archivo = nom.endsWith('.json') ? nom : `${nom}.json`;
    const enGuiones = fs.existsSync(DIR_GUIONES) ? fs.readdirSync(DIR_GUIONES).find((f) => f.endsWith(`-${archivo}`)) : undefined;
    const ruta = fs.existsSync(path.join(DIR_BACKLOG, archivo)) || !enGuiones ? path.join(DIR_BACKLOG, archivo) : path.join(DIR_GUIONES, enGuiones);
    const g = JSON.parse(fs.readFileSync(ruta, 'utf8')) as Crudo;
    return `### Ejemplo \`${g.plantilla}\` — ${g.id} (${rel(ruta)})\n\n\`\`\`json\n${JSON.stringify(g, null, 1)}\n\`\`\``;
  });
  fs.writeFileSync(ARCHIVO_GUION, `${md.slice(0, a)}${cabecera}\n\n${bloques.join('\n\n')}\n\n${md.slice(b)}`);
  console.log(`✓ docs/GUION.md §12 actualizado con: ${nombres.join(', ')}`);
};

// ---------------------------------------------------------------- main
const main = async () => {
  asegurarDirectorios();
  if (opc.revisar) {
    const g = JSON.parse(fs.readFileSync(path.resolve(opc.revisar), 'utf8')) as Crudo;
    const Env = g.plantilla === 'grafico' ? EnvoltorioGrafico : EnvoltorioTesis;
    const parseado = Env.safeParse(g);
    const mal = [...problemasZod(parseado), ...chequeosPropios(g)];
    if (g.plantilla === 'tesis' && parseado.success) {
      const ritmo = ritmoTesis((parseado.data as { props: GuionTesis }).props);
      for (const a of ritmo.avisos) console.warn(`⚠ ritmo: ${a}`);
      mal.push(...ritmo.errores.map((e) => `ritmo: ${e}`));
    }
    for (const m of mal) console.error(`✗ ${m}`);
    console.log(mal.length ? `${mal.length} problema(s) en ${g.id}` : `✓ ${g.id}: sin problemas`);
    if (mal.length) process.exitCode = 1;
    return;
  }
  if (opc['actualizar-ejemplos']) return actualizarEjemplos((positionals[0] ?? 'tesis-chile-corea-v2,grafico-irlanda-consumo').split(','));

  const derivar = opc['derivar-de'];
  const plantilla = (derivar ? 'grafico' : opc.plantilla ?? 'tesis') as PlantillaCanal;
  if (!(PLANTILLAS_CANAL as readonly string[]).includes(plantilla)) throw new Error(`plantilla desconocida: ${plantilla} (usa ${PLANTILLAS_CANAL.join('|')})`);
  const n = Math.max(1, parseInt(opc.n ?? (derivar ? '2' : '1'), 10) || 1);
  if (opc.estructura && !(ESTRUCTURAS as readonly string[]).includes(opc.estructura)) throw new Error(`estructura desconocida: ${opc.estructura} (usa ${ESTRUCTURAS.join('|')})`);
  if (opc.estructura && plantilla !== 'tesis') throw new Error('--estructura solo aplica a --plantilla tesis');
  if (opc.estructura && !estructurasPermitidas(n).includes(opc.estructura)) console.error(`  ⚠ ${opc.estructura} pasaría del 40 % de los largos; se pide igual porque lo forzaste.`);

  const existentes = todos();
  const usados = [...new Set([...existentes.map((g) => g.titulo ?? ''), ...leerBandeja(true).map((e) => e.titulo)].filter(Boolean))];
  const md = leerGuionMd();
  const limpiar = ({ ruta: _r, ...g }: Crudo & { ruta: string }): Crudo => g;

  let extra = '';
  let ejemplos: Crudo[] = [];
  if (derivar) {
    const largo = existentes.find((g) => g.id === derivar);
    if (!largo || largo.plantilla !== 'tesis') throw new Error(`no encuentro el largo ${derivar} en contenido/backlog ni contenido/guiones`);
    const ya = existentes.filter((g) => g.props?.enlaceLargo === derivar).map((g) => `- ${g.titulo}`);
    extra = `\nMODO DERIVAR: saca ${n} Short(s) del largo de abajo. Reutiliza sus HECHOS, DatoRef y fuentes (sin datasets nuevos), pero ` +
      'escribe TODO el texto de nuevo (otra apertura, otro orden, ninguna frase copiada). Cada Short toma UNA cifra/gráfico distinto ' +
      `del largo. "enlaceLargo": "${derivar}". La descripción remite al video largo.\n` +
      (ya.length ? `Shorts que ya salieron de este largo (elige otras cifras):\n${ya.join('\n')}\n` : '') +
      `\n=== LARGO DE ORIGEN ===\n${JSON.stringify(limpiar(largo), null, 1)}\n`;
  } else {
    if (opc.tema) extra += `\nTEMA PEDIDO: ${opc.tema}. Comprueba que el título sea verdadero con los datos del catálogo antes de escribirlo.\n`;
    if (opc.estructura) extra += `\nESTRUCTURA OBLIGATORIA: ${opc.estructura}.\n`;
    ejemplos = existentes.filter((g) => g.plantilla === plantilla && g.id && !md.includes(`"id": "${g.id}"`)).slice(0, 1).map(limpiar);
  }

  const prompt = construirPrompt(plantilla, n, extra, ejemplos, usados);
  if (opc['mostrar-prompt']) console.log(prompt);
  console.log(`Generando ${n} guion(es) "${plantilla}"${derivar ? ` derivados de ${derivar}` : ''} con claude -p (${opc.modelo}; ` +
    `prompt ${prompt.length} chars + system ${md.length}; ${ejemplos.length} ejemplo(s); ${usados.length} títulos usados)…`);
  if (opc['dry-run']) return console.log('[dry-run] no se llama a claude.');

  const Envoltorio = plantilla === 'tesis' ? EnvoltorioTesis : EnvoltorioGrafico;
  const yaUsados = new Set(usados.map((t) => t.toLowerCase()));
  const rechazos: string[] = [];
  let escritos = 0;
  for (let intento = 1; intento <= 2 && escritos < n; intento++) {
    const faltan = n - escritos;
    const texto = intento === 1 ? prompt : construirPrompt(plantilla, faltan, extra, ejemplos, [...yaUsados]) +
      `\n\nEN EL INTENTO ANTERIOR SE DESCARTARON GUIONES POR:\n${rechazos.slice(-10).map((r) => `- ${r}`).join('\n')}\nCorrígelo.`;
    let crudos: unknown[];
    try {
      crudos = extraerArray(await llamarClaude(texto));
    } catch (e) {
      const m = (e as Error).message.split('\n')[0];
      console.error(`  ✗ intento ${intento}: ${m}`);
      rechazos.push(m);
      if (/cupo/.test(m)) break;
      continue;
    }
    for (const crudo of crudos.slice(0, faltan) as Crudo[]) {
      const g: Crudo = { ...crudo, plantilla };
      g.titulo = (g.titulo ?? '').trim();
      if (yaUsados.has(g.titulo.toLowerCase())) { rechazos.push(`título repetido: ${g.titulo}`); console.error(`  ✗ título repetido: ${g.titulo}`); continue; }
      const tags = [...new Set((g.hashtags ?? []).map((h) => '#' + h.replace(/^#+/, '').replace(/\s+/g, '').toLowerCase()))].filter((h) => h.length > 1 && h !== '#shorts');
      g.hashtags = (plantilla === 'grafico' ? ['#shorts', ...tags] : tags).slice(0, 6);
      const slug = slugificar(g.titulo || 'sin-titulo');
      let nombre = `${plantilla}-${slug}`;
      for (let k = 2; fs.existsSync(path.join(DIR_BACKLOG, `${nombre}.json`)); k++) nombre = `${plantilla}-${slug}-${k}`;
      g.id = `pendiente-${nombre}`;
      g.props = { ...(g.props ?? {}), id: g.id };
      if (derivar) g.props.enlaceLargo = derivar;

      const parseado = Envoltorio.safeParse(g);
      const mal = [...problemasZod(parseado), ...chequeosPropios(g)];
      if (!mal.length && plantilla === 'tesis' && parseado.success) {
        try {
          const ritmo = ritmoTesis((parseado.data as { props: GuionTesis }).props);
          for (const a of ritmo.avisos) console.warn(`  ⚠ "${g.titulo}" ritmo: ${a}`);
          mal.push(...ritmo.errores.map((e) => `ritmo: ${e}`));
        } catch (e) {
          console.error(`  ⚠ no pude medir el ritmo (${(e as Error).message}); lo mide preparar-tesis`);
        }
      }
      if (!mal.length && plantilla === 'tesis') mal.push(...await verificarFotos(g));
      if (mal.length) { rechazos.push(`"${g.titulo}": ${mal.join('; ')}`); console.error(`  ✗ "${g.titulo}": ${mal.join('; ')}`); continue; }

      const destino = path.join(DIR_BACKLOG, `${nombre}.json`);
      escribirJson(destino, g);
      const cifrasMal = await verificarCifras(destino);
      if (cifrasMal.length) {
        fs.rmSync(destino);
        rechazos.push(`"${g.titulo}": cifras o datos que no pasan verificar-cifras: ${cifrasMal.join('; ')}`);
        console.error(`  ✗ "${g.titulo}": verificar-cifras falló: ${cifrasMal.join('; ')}`);
        continue;
      }
      yaUsados.add(g.titulo.toLowerCase());
      escritos++;
      console.log(`  ✓ ${rel(destino)} — ${g.titulo} (${g.titulo.length} c${plantilla === 'tesis' ? `, ${g.props.estructura}` : ''})`);
    }
  }
  console.log(`${escritos}/${n} guion(es) escritos en ${rel(DIR_BACKLOG)}. Falta el revisor independiente (guiones-de-video §6) antes de promoverlos.`);
  if (escritos === 0) process.exitCode = 1;
};

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
