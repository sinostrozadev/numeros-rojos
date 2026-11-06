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
 *   --derivar-de <id>      saca Shorts (`grafico`) de un largo existente: mismos hechos y datasets, texto 100 % nuevo,
 *                          `enlaceLargo` = <id>. Implica --plantilla grafico; --n por defecto 2.
 *   --actualizar-ejemplos  reescribe el bloque de ejemplos de docs/GUION.md §12 con los guiones indicados del backlog
 *                          (por defecto tesis-chile-corea,grafico-irlanda-consumo).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import type { z } from 'zod';
import {
  ESTRUCTURAS, EnvoltorioGrafico, EnvoltorioTesis, PLANTILLAS_CANAL, type PlantillaCanal,
} from '../src/plantillas/comun/guion';
import { DIR_BACKLOG, DIR_GUIONES, RAIZ, asegurarDirectorios, correr, escribirJson, leerBandeja, slugificar } from './lib/operacion.mjs';

const { values: opc, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    plantilla: { type: 'string' },
    n: { type: 'string' },
    tema: { type: 'string' },
    estructura: { type: 'string' },
    'derivar-de': { type: 'string' },
    modelo: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    'mostrar-prompt': { type: 'boolean', default: false },
    'actualizar-ejemplos': { type: 'boolean', default: false },
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
const textoSchema = () => ['guion.ts', 'datos.ts'].map((f) => {
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
  return mal.slice(0, 8);
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
    const ruta = path.join(DIR_BACKLOG, nom.endsWith('.json') ? nom : `${nom}.json`);
    const g = JSON.parse(fs.readFileSync(ruta, 'utf8')) as Crudo;
    return `### Ejemplo \`${g.plantilla}\` — ${g.id} (${rel(ruta)})\n\n\`\`\`json\n${JSON.stringify(g, null, 1)}\n\`\`\``;
  });
  fs.writeFileSync(ARCHIVO_GUION, `${md.slice(0, a)}${cabecera}\n\n${bloques.join('\n\n')}\n\n${md.slice(b)}`);
  console.log(`✓ docs/GUION.md §12 actualizado con: ${nombres.join(', ')}`);
};

// ---------------------------------------------------------------- main
const main = async () => {
  asegurarDirectorios();
  if (opc['actualizar-ejemplos']) return actualizarEjemplos((positionals[0] ?? 'tesis-chile-corea,grafico-irlanda-consumo').split(','));

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
  console.log(`Generando ${n} guion(es) "${plantilla}"${derivar ? ` derivados de ${derivar}` : ''} con claude -p (${opc.modelo ?? 'modelo por defecto'}; ` +
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

      const mal = [...problemasZod(Envoltorio.safeParse(g)), ...chequeosPropios(g)];
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
