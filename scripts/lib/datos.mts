/**
 * Pipeline de DATOS de En Números Rojos (lo consumen preparar-*.mts, verificar-cifras.mts, datos.mts y generar-guiones).
 *
 *   resolverDatos(refs) → SerieResuelta[]   (descarga + caché en contenido/datos/<fuente>/<indicador>.json)
 *   calcularCifra(cifra, series) → { esperado, dicho, desvio, ok, detalle }
 *   catalogo() → indicadores conocidos con etiqueta, unidad y licencia (contenido/datos/catalogo.json)
 *
 * Fuentes permitidas y licencias (verificadas 2026-11-05, docs/CONVENCIONES.md):
 *  - wdi  : https://api.worldbank.org/v2/country/all/indicator/{CODIGO}?format=json&per_page=20000  (CC BY 4.0)
 *  - owid : https://ourworldindata.org/grapher/{slug}.csv?v=1&csvType=full&useColumnShortNames=true + {slug}.metadata.json
 *           (CC BY 4.0; se cita también al proveedor original). `indicador` = slug, o `slug#columna` si el grapher
 *           trae varias columnas numéricas (por defecto, la primera numérica).
 *  - manual: valores incrustados en el guion con fuenteTexto/fuenteUrl de organismo oficial.
 *  PROHIBIDO: FMI (uso comercial exige permiso), Numbeo, OCDE y Banco Central de Chile hasta verificar sus términos.
 *
 * Caché: un archivo COMPLETO por indicador (todos los países y años); los recortes por país/año se hacen en memoria.
 * Nunca se vuelve a descargar lo que ya está (salvo `refrescar`). Cada archivo guarda `consultadoEn`, la URL exacta y la
 * licencia. Sin red, el pipeline sigue funcionando con la caché.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { claveDeRef, type Cifra, type DatoRef, type SerieResuelta } from '../../src/plantillas/comun/datos';

export const RAIZ_DATOS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'contenido', 'datos');
export const ARCHIVO_CATALOGO = path.join(RAIZ_DATOS, 'catalogo.json');
const TIMEOUT_MS = 30_000;
const REINTENTOS = 2;
const LICENCIA = 'CC BY 4.0';
/** Licencias que permiten uso comercial con atribución (regla del canal): CC BY (no NC/ND/SA), CC0, dominio público. */
export const LICENCIA_OK = /CC[ -]BY(?![ -]?(NC|ND|SA))|Creative Commons Attribution(?! ?-? ?Non)|^CC0|Public Domain|dominio público/i;
/** Licencias del proveedor original que no cumplen LICENCIA_OK (de `licencia` de una serie OWID: "…; origen: A · B"). */
export const licenciasMalas = (licencia: string): string[] => {
  const origen = /origen: (.*)$/.exec(licencia)?.[1];
  return origen ? origen.split(' · ').map((x) => x.trim()).filter((x) => x && !LICENCIA_OK.test(x)) : [];
};

export interface ResultadoCifra { esperado: number | null; dicho: number; desvio: number | null; ok: boolean; detalle: string }

/** Entrada del catálogo de indicadores (lo lee generar-guiones para saber qué datos existen). */
export interface EntradaCatalogo {
  fuente: 'wdi' | 'owid';
  indicador: string;
  /** Nombre en español para pantalla. */
  etiqueta: string;
  unidad: string;
  descripcion: string;
  /** Qué pregunta responde (para elegir el dato al escribir el guion). */
  paraQue: string;
  /** Rango de años disponible (al verificar, para Chile salvo indicación). */
  anios?: string;
  /** Fecha en que se comprobó que la API devuelve datos. */
  verificado?: string;
  /** Proveedor original (OWID). */
  proveedor?: string;
  /** Licencia(s) del proveedor original según OWID (deben ser CC BY). */
  licenciaOrigen?: string;
}

/** Archivo de caché: contenido/datos/<fuente>/<indicador>.json */
export interface CacheIndicador {
  fuente: 'wdi' | 'owid';
  indicador: string;
  url: string;
  licencia: string;
  consultadoEn: string;
  /** Nombre del indicador tal como lo publica la fuente (inglés). */
  nombreFuente: string;
  unidadFuente: string;
  fuenteTexto: string;
  fuenteUrl: string;
  /** ISO3 → nombre según la fuente. */
  paises: Record<string, string>;
  /** ISO3 → [[anio, valor], …] ordenado por año. */
  series: Record<string, Array<[number, number]>>;
}

// ---------------------------------------------------------------- nombres en español
/** Nombres en español para pantalla (si falta, se usa el de la fuente). */
export const NOMBRES_ES: Record<string, string> = {
  ARG: 'Argentina', BOL: 'Bolivia', BRA: 'Brasil', CHL: 'Chile', COL: 'Colombia', CRI: 'Costa Rica', CUB: 'Cuba',
  DOM: 'República Dominicana', ECU: 'Ecuador', SLV: 'El Salvador', GTM: 'Guatemala', HND: 'Honduras', MEX: 'México',
  NIC: 'Nicaragua', PAN: 'Panamá', PRY: 'Paraguay', PER: 'Perú', PRI: 'Puerto Rico', URY: 'Uruguay', VEN: 'Venezuela',
  HTI: 'Haití', JAM: 'Jamaica', TTO: 'Trinidad y Tobago', GUY: 'Guyana', SUR: 'Surinam', BLZ: 'Belice',
  USA: 'Estados Unidos', CAN: 'Canadá', ESP: 'España', PRT: 'Portugal', FRA: 'Francia', DEU: 'Alemania', ITA: 'Italia',
  GBR: 'Reino Unido', IRL: 'Irlanda', NLD: 'Países Bajos', BEL: 'Bélgica', CHE: 'Suiza', AUT: 'Austria', SWE: 'Suecia',
  NOR: 'Noruega', DNK: 'Dinamarca', FIN: 'Finlandia', ISL: 'Islandia', POL: 'Polonia', GRC: 'Grecia', TUR: 'Turquía',
  RUS: 'Rusia', UKR: 'Ucrania', CZE: 'Chequia', HUN: 'Hungría', ROU: 'Rumania', EST: 'Estonia',
  CHN: 'China', JPN: 'Japón', KOR: 'Corea del Sur', PRK: 'Corea del Norte', TWN: 'Taiwán', HKG: 'Hong Kong', SGP: 'Singapur',
  IND: 'India', IDN: 'Indonesia', MYS: 'Malasia', THA: 'Tailandia', VNM: 'Vietnam', PHL: 'Filipinas', BGD: 'Bangladés',
  PAK: 'Pakistán', AUS: 'Australia', NZL: 'Nueva Zelanda', ISR: 'Israel', SAU: 'Arabia Saudita', ARE: 'Emiratos Árabes Unidos',
  QAT: 'Catar', IRN: 'Irán', IRQ: 'Irak', EGY: 'Egipto', ZAF: 'Sudáfrica', NGA: 'Nigeria', KEN: 'Kenia', ETH: 'Etiopía',
  MAR: 'Marruecos', GHA: 'Ghana', BWA: 'Botsuana', ZWE: 'Zimbabue', LBN: 'Líbano', LKA: 'Sri Lanka',
  WLD: 'Mundo', LCN: 'América Latina y el Caribe', LAC: 'América Latina y el Caribe (sin altos ingresos)',
  EUU: 'Unión Europea', OED: 'Miembros de la OCDE', HIC: 'Países de ingreso alto', MIC: 'Países de ingreso medio',
  LIC: 'Países de ingreso bajo', UMC: 'Ingreso medio alto', LMC: 'Ingreso medio bajo', EAS: 'Asia oriental y el Pacífico',
  SSF: 'África subsahariana', NAC: 'América del Norte', ECS: 'Europa y Asia central', MEA: 'Oriente Medio y Norte de África',
  SAS: 'Asia meridional',
};

// ---------------------------------------------------------------- red
const dormir = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

/** GET con timeout de 30 s y 2 reintentos (espera 2 s y 4 s). */
export const obtener = async (url: string, tipo: 'json' | 'texto' = 'json'): Promise<any> => {
  let ultimo: unknown;
  for (let intento = 0; intento <= REINTENTOS; intento++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'user-agent': 'en-numeros-rojos/0.1 (datos abiertos)' } });
      if (!r.ok) throw new Error(`HTTP ${r.status} en ${url}`);
      return tipo === 'json' ? await r.json() : await r.text();
    } catch (e) {
      ultimo = e;
      if (/HTTP 404/.test(String((e as Error).message))) break; // 404 no mejora reintentando
      if (intento < REINTENTOS) await dormir(2000 * (intento + 1));
    }
  }
  throw new Error(`no pude descargar ${url}: ${(ultimo as Error)?.message ?? ultimo}`);
};

// ---------------------------------------------------------------- caché
const nombreArchivo = (indicador: string) => indicador.replace(/#/g, '__').replace(/[^A-Za-z0-9._-]+/g, '_') + '.json';
export const rutaCache = (fuente: 'wdi' | 'owid', indicador: string) => path.join(RAIZ_DATOS, fuente, nombreArchivo(indicador));

const leerCache = (fuente: 'wdi' | 'owid', indicador: string): CacheIndicador | null => {
  const ruta = rutaCache(fuente, indicador);
  if (!fs.existsSync(ruta)) return null;
  try { return JSON.parse(fs.readFileSync(ruta, 'utf8')) as CacheIndicador; } catch { return null; }
};

const escribirCache = (c: CacheIndicador) => {
  const ruta = rutaCache(c.fuente, c.indicador);
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  // Una línea por país: el archivo queda legible en un diff y no pesa de más.
  const { series, ...cabecera } = c;
  const cuerpo = Object.entries(series).map(([iso, pts]) => `    ${JSON.stringify(iso)}: ${JSON.stringify(pts)}`).join(',\n');
  const texto = JSON.stringify(cabecera, null, 2).replace(/\n}$/, `,\n  "series": {\n${cuerpo}\n  }\n}\n`);
  fs.writeFileSync(ruta, texto);
};

/** Fecha local de Chile (AAAA-MM-DD): la que se ve en "consultado …". */
const hoy = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());

// ---------------------------------------------------------------- WDI
interface FilaWdi { indicator: { id: string; value: string }; country: { id: string; value: string }; countryiso3code: string; date: string; value: number | null }

/**
 * URL de la API v2. OJO (medido 2026-11-05): sin `date` la API de `country/all` responde solo los últimos años y con
 * `sourceid: null`; por eso SIEMPRE se pide `source=2` (WDI) y un rango de años explícito (1960 → año actual).
 */
export const urlWdi = (codigo: string, paises = 'all', desde?: number, hasta?: number, porPagina = 20000, pagina = 1) =>
  `https://api.worldbank.org/v2/country/${paises}/indicator/${encodeURIComponent(codigo)}?format=json&source=2&per_page=${porPagina}` +
  (pagina > 1 ? `&page=${pagina}` : '') +
  `&date=${desde ?? 1960}:${hasta ?? new Date().getFullYear()}`;

/** Descarga un indicador WDI. Por defecto TODOS los países y años (archivo completo de caché). */
export const descargarWdi = async (codigo: string, paises = 'all', desde?: number, hasta?: number): Promise<CacheIndicador> => {
  const filas: FilaWdi[] = [];
  let pagina = 1, paginas = 1;
  do {
    const j = await obtener(urlWdi(codigo, paises, desde, hasta, 20000, pagina));
    if (!Array.isArray(j) || j.length < 2) {
      const msg = Array.isArray(j) ? JSON.stringify(j[0]?.message ?? j[0]) : JSON.stringify(j).slice(0, 200);
      throw new Error(`WDI ${codigo}: respuesta sin datos (${msg})`);
    }
    paginas = j[0]?.pages ?? 1;
    filas.push(...((j[1] ?? []) as FilaWdi[]));
    pagina++;
  } while (pagina <= paginas);
  const nombresPaises: Record<string, string> = {};
  const series: Record<string, Array<[number, number]>> = {};
  let nombre = codigo;
  for (const f of filas) {
    nombre = f.indicator?.value ?? nombre;
    const iso = f.countryiso3code;
    if (!iso || !/^[A-Z]{3}$/.test(iso) || f.value === null || f.value === undefined) continue;
    const anio = parseInt(f.date, 10);
    if (!Number.isFinite(anio)) continue;
    nombresPaises[iso] = f.country?.value ?? iso;
    (series[iso] ??= []).push([anio, f.value]);
  }
  for (const s of Object.values(series)) s.sort((a, b) => a[0] - b[0]);
  return {
    fuente: 'wdi', indicador: codigo,
    url: urlWdi(codigo, paises, desde, hasta),
    licencia: LICENCIA, consultadoEn: hoy(),
    nombreFuente: nombre, unidadFuente: unidadDeNombreWdi(nombre),
    fuenteTexto: `Banco Mundial, World Development Indicators (${codigo}), ${LICENCIA}`,
    fuenteUrl: `https://data.worldbank.org/indicator/${codigo}`,
    paises: nombresPaises, series,
  };
};

/** "GDP per capita, PPP (constant 2021 international $)" → "US$ PPA 2021"; "(% of GDP)" → "% del PIB"… */
const unidadDeNombreWdi = (nombre: string): string => {
  const m = /\(([^()]*)\)\s*$/.exec(nombre);
  if (!m) return '';
  const u = m[1];
  if (/% of GDP/i.test(u)) return '% del PIB';
  if (/annual %/i.test(u)) return '% anual';
  if (/^%|% of/i.test(u)) return '%';
  if (/constant (\d{4}) international \$/i.test(u)) return `US$ PPA ${/(\d{4})/.exec(u)![1]}`;
  if (/current international \$/i.test(u)) return 'US$ PPA corrientes';
  if (/constant (\d{4}) US\$/i.test(u)) return `US$ de ${/(\d{4})/.exec(u)![1]}`;
  if (/current US\$/i.test(u)) return 'US$ corrientes';
  if (/years/i.test(u)) return 'años';
  return u;
};

// ---------------------------------------------------------------- OWID
export interface MetaOwid {
  chart?: { title?: string; citation?: string; originalChartUrl?: string };
  columns?: Record<string, { titleShort?: string; titleLong?: string; shortUnit?: string; unit?: string; type?: string; shortName?: string; citationShort?: string; timespan?: string; descriptionShort?: string; fullMetadata?: string }>;
}

export const urlsOwid = (slug: string) => ({
  csv: `https://ourworldindata.org/grapher/${slug}.csv?v=1&csvType=full&useColumnShortNames=true`,
  meta: `https://ourworldindata.org/grapher/${slug}.metadata.json`,
  pagina: `https://ourworldindata.org/grapher/${slug}`,
});

/** Divide una línea CSV respetando comillas. */
const partirCsv = (linea: string): string[] => {
  const out: string[] = [];
  let actual = '', comillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i++; }
      else if (c === '"') comillas = false;
      else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { out.push(actual); actual = ''; }
    else actual += c;
  }
  out.push(actual);
  return out;
};

/** Proveedor original a partir de la cita de OWID ("Bolt and van Zanden – Maddison Project Database 2023 – with minor processing…"). */
export const proveedorDe = (cita: string) =>
  cita.split(/\s+–\s+(?:with (?:minor|major) processing|processed) by Our World in Data/i)[0].replace(/\s*–\s*$/, '').trim();

export const metadatosOwid = async (slug: string): Promise<MetaOwid> => obtener(urlsOwid(slug).meta);

/** Columna numérica elegida: la indicada tras `#`, o la primera que no sea de anotaciones. */
export const elegirColumnaOwid = (meta: MetaOwid, columna?: string) => {
  const cols = Object.values(meta.columns ?? {}).filter((c) => c.shortName && c.type !== 'SeriesAnnotation' && !/annotations$/.test(c.shortName ?? ''));
  const c = columna ? cols.find((x) => x.shortName === columna) : cols.find((x) => /numeric|integer|ratio/i.test(x.type ?? 'Numeric')) ?? cols[0];
  if (!c) throw new Error(`OWID: no encuentro la columna ${columna ?? '(numérica)'}; columnas: ${cols.map((x) => x.shortName).join(', ')}`);
  return c;
};

export const descargarOwid = async (indicador: string): Promise<CacheIndicador> => {
  const [slug, columna] = indicador.split('#');
  const u = urlsOwid(slug);
  const meta = await metadatosOwid(slug);
  const col = elegirColumnaOwid(meta, columna);
  const csv: string = await obtener(u.csv, 'texto');
  const lineas = csv.split(/\r?\n/).filter((l) => l.trim());
  const cab = partirCsv(lineas[0]).map((h) => h.trim().toLowerCase());
  const iEnt = cab.indexOf('entity'), iCod = cab.indexOf('code'), iAnio = cab.findIndex((h) => h === 'year');
  const iVal = cab.indexOf((col.shortName ?? '').toLowerCase());
  if (iEnt < 0 || iCod < 0 || iAnio < 0 || iVal < 0) throw new Error(`OWID ${slug}: cabecera inesperada (${cab.join(',')})`);
  const paises: Record<string, string> = {};
  const series: Record<string, Array<[number, number]>> = {};
  for (const l of lineas.slice(1)) {
    const c = partirCsv(l);
    const iso = c[iCod]?.trim();
    // OWID usa OWID_WRL para el mundo: se normaliza a WLD (como el Banco Mundial).
    const codigo = iso === 'OWID_WRL' ? 'WLD' : iso;
    if (!codigo || !/^[A-Z]{3}$/.test(codigo)) continue;
    const anio = parseInt(c[iAnio], 10);
    const valor = parseFloat(c[iVal]);
    if (!Number.isFinite(anio) || !Number.isFinite(valor)) continue;
    paises[codigo] = c[iEnt];
    (series[codigo] ??= []).push([anio, valor]);
  }
  for (const s of Object.values(series)) s.sort((a, b) => a[0] - b[0]);
  const proveedor = proveedorDe(col.citationShort ?? meta.chart?.citation ?? '') || 'ver página del gráfico';
  // Licencia de cada proveedor original (la de OWID es CC BY 4.0; la del dato de origen puede ser CC BY 3.0 IGO, CC0…).
  let licencia = `${LICENCIA} (Our World in Data)`;
  try {
    const completo = col.fullMetadata ? await obtener(col.fullMetadata) as { origins?: Array<{ license?: { name?: string } }> } : {};
    const origen = [...new Set((completo.origins ?? []).map((o) => o.license?.name).filter(Boolean))];
    if (origen.length) licencia += `; origen: ${origen.join(' · ')}`;
  } catch { /* sin metadata completa: queda la de OWID */ }
  return {
    fuente: 'owid', indicador,
    url: u.csv, licencia, consultadoEn: hoy(),
    nombreFuente: col.titleShort ?? meta.chart?.title ?? slug,
    unidadFuente: col.shortUnit || col.unit || '',
    fuenteTexto: `Our World in Data (${slug}); datos de ${proveedor}; ${LICENCIA}`,
    fuenteUrl: u.pagina,
    paises, series,
  };
};

// ---------------------------------------------------------------- catálogo
export const catalogo = (): EntradaCatalogo[] => {
  if (!fs.existsSync(ARCHIVO_CATALOGO)) return [];
  const j = JSON.parse(fs.readFileSync(ARCHIVO_CATALOGO, 'utf8')) as { indicadores?: EntradaCatalogo[] } | EntradaCatalogo[];
  return Array.isArray(j) ? j : j.indicadores ?? [];
};

const delCatalogo = (fuente: string, indicador: string) => catalogo().find((e) => e.fuente === fuente && e.indicador === indicador);

// ---------------------------------------------------------------- resolver
/** Trae (de la caché o de la red) el archivo completo de un indicador. */
export const cargarIndicador = async (fuente: 'wdi' | 'owid', indicador: string, refrescar = false): Promise<CacheIndicador> => {
  if (!refrescar) {
    const c = leerCache(fuente, indicador);
    if (c) return c;
  }
  try {
    const c = fuente === 'wdi' ? await descargarWdi(indicador) : await descargarOwid(indicador);
    if (Object.keys(c.series).length === 0) throw new Error(`${fuente} ${indicador}: la fuente no devolvió ningún valor`);
    escribirCache(c);
    return c;
  } catch (e) {
    // Sin red: si hay caché (aunque se pidiera refrescar), se usa.
    const c = leerCache(fuente, indicador);
    if (c) { console.error(`⚠ ${(e as Error).message} → uso la caché del ${c.consultadoEn}`); return c; }
    throw e;
  }
};

const recortar = (pts: Array<[number, number]>, desde?: number, hasta?: number) =>
  pts.filter(([a]) => (desde === undefined || a >= desde) && (hasta === undefined || a <= hasta)).map(([anio, valor]) => ({ anio, valor }));

const resolverManual = (ref: DatoRef): SerieResuelta => {
  const series: SerieResuelta['series'] = {};
  for (const iso of ref.paises) {
    const pts = (ref.valores?.[iso] ?? []) as Array<[number, number]>;
    series[iso] = { pais: NOMBRES_ES[iso] ?? iso, puntos: recortar([...pts].sort((a, b) => a[0] - b[0]), ref.desde, ref.hasta) };
  }
  return {
    ref, etiqueta: ref.etiqueta ?? ref.indicador, unidad: ref.unidad ?? '',
    fuenteTexto: ref.fuenteTexto ?? '(sin fuente)', fuenteUrl: ref.fuenteUrl ?? 'https://example.invalid/',
    licencia: 'dato oficial citado (ver fuente)', consultadoEn: hoy(), series,
  };
};

/**
 * Resuelve cada DatoRef a una SerieResuelta (mismo orden que `refs`). Descarga cada indicador UNA vez (archivo
 * completo) y recorta en memoria. Lanza error si un país pedido no tiene ningún dato en el rango.
 */
export const resolverDatos = async (refs: DatoRef[], opciones: { refrescar?: boolean } = {}): Promise<SerieResuelta[]> => {
  const cargados = new Map<string, CacheIndicador>();
  const salida: SerieResuelta[] = [];
  for (const ref of refs) {
    if (ref.fuente === 'manual') { salida.push(resolverManual(ref)); continue; }
    const k = `${ref.fuente}:${ref.indicador}`;
    if (!cargados.has(k)) cargados.set(k, await cargarIndicador(ref.fuente, ref.indicador, opciones.refrescar));
    const c = cargados.get(k)!;
    const cat = delCatalogo(ref.fuente, ref.indicador);
    const series: SerieResuelta['series'] = {};
    const vacios: string[] = [];
    for (const iso of ref.paises) {
      const puntos = recortar(c.series[iso] ?? [], ref.desde, ref.hasta);
      if (puntos.length === 0) vacios.push(iso);
      series[iso] = { pais: NOMBRES_ES[iso] ?? c.paises[iso] ?? iso, puntos };
    }
    if (vacios.length) {
      throw new Error(`${ref.fuente} ${ref.indicador}: sin datos para ${vacios.join(', ')}${ref.desde || ref.hasta ? ` en ${ref.desde ?? '…'}–${ref.hasta ?? '…'}` : ''} (caché del ${c.consultadoEn}; prueba --refrescar o cambia el rango)`);
    }
    salida.push({
      ref,
      etiqueta: ref.etiqueta ?? cat?.etiqueta ?? c.nombreFuente,
      unidad: ref.unidad ?? cat?.unidad ?? c.unidadFuente,
      fuenteTexto: c.fuenteTexto,
      fuenteUrl: c.fuenteUrl,
      licencia: c.licencia,
      consultadoEn: c.consultadoEn,
      series,
    });
  }
  return salida;
};

// ---------------------------------------------------------------- cifras
export const fmtNumero = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n) ? '—'
    : Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('es-CL')
      : Math.abs(n) >= 10 ? n.toFixed(1).replace('.', ',')
        : n.toFixed(3).replace('.', ',');
const fmt = fmtNumero;

/** Busca la serie de una referencia: misma clave, o mismo indicador con todos los países que hacen falta. */
const encontrarSerie = (ref: DatoRef, series: SerieResuelta[]): SerieResuelta | undefined => {
  const k = claveDeRef(ref);
  return series.find((s) => claveDeRef(s.ref) === k)
    ?? series.find((s) => s.ref.fuente === ref.fuente && s.ref.indicador === ref.indicador && ref.paises.every((p) => s.series[p]));
};

/** Factor de escala que implica el texto hablado ("19 millones" → 1e6), por si `valor` viene en esas unidades. */
const escalaDelTexto = (texto: string): number[] => {
  const t = texto.toLowerCase();
  if (/mil millones/.test(t)) return [1e9];
  if (/billones?\b|bill[oó]n/.test(t)) return [1e12, 1e9];
  if (/mill[oó]n|millones/.test(t)) return [1e6];
  if (/\bmil\b/.test(t)) return [1e3];
  return [];
};

/**
 * Recalcula una Cifra contra las series resueltas. Convenciones (también en docs/OPERACION.md):
 *  - valor:      dato de `pais` en `anio` (si falta `anio`, el último año con dato de ese país en el rango).
 *  - razon:      pais / paisB en `anio` (si falta, el último año en que ambos tienen dato).
 *  - variacion:  (v(anioB) − v(anio)) / v(anio) de `pais` (anio = desde, anioB = hasta; si faltan, primer y último
 *                año con dato). `valor` puede venir en % (45 = +45 %) o como fracción (0,45): se acepta el que calce.
 *  - diferencia: con `paisB` → pais − paisB en `anio`; sin `paisB` (o con `anioB`) → v(anioB) − v(anio) de `pais`.
 *  - maximo / minimo / promedio: de `pais` entre `anio` y `anioB` (o en todo el rango del DatoRef).
 *  - ranking:    posición (1 = mayor) de `pais` entre los `paises` del DatoRef en `anio`; exige coincidencia exacta.
 * `pais` por defecto = primer país del DatoRef; `paisB` = el segundo. Tolerancia por defecto 5 %.
 * Si `texto` dice "mil / millones / mil millones / billones" y `valor` < 10.000, también se prueba `valor` × esa escala.
 */
export const calcularCifra = (cifra: Cifra, series: SerieResuelta[]): ResultadoCifra => {
  const c = cifra.calculo;
  const tol = cifra.tolerancia ?? 0.05;
  const dicho = cifra.valor;
  const mal = (detalle: string): ResultadoCifra => ({ esperado: null, dicho, desvio: null, ok: false, detalle });
  const s = encontrarSerie(c.datos, series);
  if (!s) return mal(`no hay serie resuelta para ${claveDeRef(c.datos)}`);
  const pais = c.pais ?? c.datos.paises[0];
  const pts = (iso?: string) => (iso ? s.series[iso]?.puntos ?? [] : []);
  const en = (iso: string, anio: number) => pts(iso).find((p) => p.anio === anio)?.valor;
  const ultimo = (iso: string) => pts(iso).at(-1)?.anio;
  const primero = (iso: string) => pts(iso)[0]?.anio;
  const nombre = (iso?: string) => (iso ? s.series[iso]?.pais ?? iso : '?');
  if (!pts(pais).length) return mal(`${pais} sin datos en ${c.datos.indicador}`);

  let esperado: number | undefined;
  let detalle = '';
  const alternativas: Array<{ v: number; nota: string }> = [];
  switch (c.operacion) {
    case 'valor': {
      const anio = c.anio ?? ultimo(pais)!;
      esperado = en(pais, anio);
      if (esperado === undefined) return mal(`${nombre(pais)} no tiene dato en ${anio}`);
      detalle = `${nombre(pais)} ${anio} = ${fmt(esperado)}`;
      break;
    }
    case 'razon': {
      const paisB = c.paisB ?? c.datos.paises[1];
      if (!paisB) return mal('razon: falta paisB (o un segundo país en datos.paises)');
      const comunes = pts(pais).map((p) => p.anio).filter((a) => en(paisB, a) !== undefined);
      const anio = c.anio ?? comunes.at(-1);
      if (anio === undefined) return mal(`razon: ${pais} y ${paisB} no comparten años con dato`);
      const a = en(pais, anio), b = en(paisB, anio);
      if (a === undefined || b === undefined || b === 0) return mal(`razon: falta dato en ${anio} (${pais}=${fmt(a)}, ${paisB}=${fmt(b)})`);
      esperado = a / b;
      detalle = `${nombre(pais)} ${fmt(a)} / ${nombre(paisB)} ${fmt(b)} (${anio}) = ${fmt(esperado)}×`;
      break;
    }
    case 'variacion': {
      const desde = c.anio ?? primero(pais)!;
      const hasta = c.anioB ?? ultimo(pais)!;
      const a = en(pais, desde), b = en(pais, hasta);
      if (a === undefined || b === undefined) return mal(`variacion: ${nombre(pais)} sin dato en ${a === undefined ? desde : hasta}`);
      if (a === 0) return mal('variacion: valor inicial 0');
      esperado = (b - a) / Math.abs(a);
      alternativas.push({ v: esperado * 100, nota: 'en %' });
      detalle = `${nombre(pais)} ${desde} ${fmt(a)} → ${hasta} ${fmt(b)}: ${(esperado * 100).toFixed(1).replace('.', ',')} %`;
      break;
    }
    case 'diferencia': {
      const paisB = c.paisB;
      if (paisB && c.anioB === undefined) {
        const comunes = pts(pais).map((p) => p.anio).filter((a) => en(paisB, a) !== undefined);
        const anio = c.anio ?? comunes.at(-1);
        if (anio === undefined) return mal(`diferencia: ${pais} y ${paisB} no comparten años con dato`);
        const a = en(pais, anio), b = en(paisB, anio);
        if (a === undefined || b === undefined) return mal(`diferencia: falta dato en ${anio}`);
        esperado = a - b;
        detalle = `${nombre(pais)} ${fmt(a)} − ${nombre(paisB)} ${fmt(b)} (${anio}) = ${fmt(esperado)}`;
      } else {
        const desde = c.anio ?? primero(pais)!, hasta = c.anioB ?? ultimo(pais)!;
        const a = en(pais, desde), b = en(pais, hasta);
        if (a === undefined || b === undefined) return mal(`diferencia: ${nombre(pais)} sin dato en ${a === undefined ? desde : hasta}`);
        esperado = b - a;
        detalle = `${nombre(pais)} ${hasta} ${fmt(b)} − ${desde} ${fmt(a)} = ${fmt(esperado)}`;
      }
      break;
    }
    case 'maximo': case 'minimo': case 'promedio': {
      const desde = c.anio ?? -Infinity, hasta = c.anioB ?? Infinity;
      const rango = pts(pais).filter((p) => p.anio >= desde && p.anio <= hasta);
      if (!rango.length) return mal(`${c.operacion}: ${nombre(pais)} sin datos en el rango`);
      if (c.operacion === 'promedio') {
        esperado = rango.reduce((acc, p) => acc + p.valor, 0) / rango.length;
        detalle = `promedio ${nombre(pais)} ${rango[0].anio}–${rango.at(-1)!.anio} (${rango.length} años) = ${fmt(esperado)}`;
      } else {
        const elegido = rango.reduce((m, p) => ((c.operacion === 'maximo' ? p.valor > m.valor : p.valor < m.valor) ? p : m));
        esperado = elegido.valor;
        detalle = `${c.operacion} ${nombre(pais)} ${rango[0].anio}–${rango.at(-1)!.anio} = ${fmt(esperado)} (en ${elegido.anio})`;
      }
      break;
    }
    case 'ranking': {
      const anio = c.anio ?? Math.min(...c.datos.paises.map((p) => ultimo(p) ?? Infinity));
      const vals = c.datos.paises.map((p) => ({ p, v: en(p, anio) })).filter((x): x is { p: string; v: number } => x.v !== undefined);
      if (!vals.some((x) => x.p === pais)) return mal(`ranking: ${nombre(pais)} sin dato en ${anio}`);
      vals.sort((a, b) => b.v - a.v);
      const puesto = vals.findIndex((x) => x.p === pais) + 1;
      const ok = dicho === puesto;
      return { esperado: puesto, dicho, desvio: (dicho - puesto) / puesto, ok, detalle: `${nombre(pais)} puesto ${puesto} de ${vals.length} en ${anio} (${vals.map((x) => x.p).join(' > ')}) · dicho ${dicho}` };
    }
  }
  if (esperado === undefined || !Number.isFinite(esperado)) return mal(`no se pudo calcular (${detalle})`);
  const desvioDe = (v: number, d = dicho) => (v === 0 ? (d === 0 ? 0 : Infinity) : (d - v) / Math.abs(v));
  // Candidatos: el esperado tal cual, sus alternativas (variación en %) y, si la voz dice "millones…", el dicho escalado.
  const candidatos: Array<{ v: number; desvio: number; nota: string }> = [{ v: esperado, desvio: desvioDe(esperado), nota: '' }];
  for (const a of alternativas) candidatos.push({ v: a.v, desvio: desvioDe(a.v), nota: a.nota });
  if (Math.abs(dicho) < 1e4) {
    for (const f of escalaDelTexto(cifra.texto)) candidatos.push({ v: esperado / f, desvio: desvioDe(esperado, dicho * f), nota: `escala ×${f.toExponential(0)} por "${cifra.texto}"` });
  }
  const mejor = candidatos.reduce((m, x) => (Math.abs(x.desvio) < Math.abs(m.desvio) ? x : m));
  const ok = Math.abs(mejor.desvio) <= tol;
  return {
    esperado: mejor.v, dicho, desvio: mejor.desvio, ok,
    detalle: `${detalle}${mejor.nota ? ` [${mejor.nota}]` : ''} · dicho ${fmt(dicho)} · desvío ${(mejor.desvio * 100).toFixed(1).replace('.', ',')} % (tol. ${Math.round(tol * 100)} %)`,
  };
};
