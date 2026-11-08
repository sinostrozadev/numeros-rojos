/**
 * Geometría del visual `mapa` (módulo puro, sin Remotion): países de world-atlas countries-50m (Natural Earth,
 * dominio público), nombres en español, encuadre automático desde los países destacados y la cámara.
 *
 * Zoom del contrato (VisualMapa.zoom): 1 = el mundo entero cabe a lo ancho del lienzo; cada +1 duplica la escala
 * (3 ≈ continente, 5 ≈ país grande, 7 ≈ país chico). Proyección Mercator; ortográfica (globo) si |lat| > 60.
 */
import { geoArea, geoBounds, geoCentroid, geoInterpolate, geoMercator, geoOrthographic, type GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import mundo50 from 'world-atlas/countries-50m.json';

export type LonLat = [number, number];
export type Camara = { centro: LonLat; zoom: number };
export type TipoProyeccion = 'mercator' | 'ortografica';

/** ISO 3166-1 alfa-3 → [código numérico de world-atlas, nombre en español]. Agregar aquí si falta un país. */
export const PAISES: Record<string, [string, string]> = {
  // América del Sur
  ARG: ['032', 'Argentina'], BOL: ['068', 'Bolivia'], BRA: ['076', 'Brasil'], CHL: ['152', 'Chile'], COL: ['170', 'Colombia'],
  ECU: ['218', 'Ecuador'], GUY: ['328', 'Guyana'], PRY: ['600', 'Paraguay'], PER: ['604', 'Perú'], SUR: ['740', 'Surinam'],
  URY: ['858', 'Uruguay'], VEN: ['862', 'Venezuela'],
  // Centroamérica, Caribe y Norteamérica
  MEX: ['484', 'México'], GTM: ['320', 'Guatemala'], BLZ: ['084', 'Belice'], HND: ['340', 'Honduras'], SLV: ['222', 'El Salvador'],
  NIC: ['558', 'Nicaragua'], CRI: ['188', 'Costa Rica'], PAN: ['591', 'Panamá'], CUB: ['192', 'Cuba'], DOM: ['214', 'Rep. Dominicana'],
  HTI: ['332', 'Haití'], JAM: ['388', 'Jamaica'], PRI: ['630', 'Puerto Rico'], TTO: ['780', 'Trinidad y Tobago'], BHS: ['044', 'Bahamas'],
  USA: ['840', 'Estados Unidos'], CAN: ['124', 'Canadá'],
  // Europa
  ESP: ['724', 'España'], PRT: ['620', 'Portugal'], FRA: ['250', 'Francia'], DEU: ['276', 'Alemania'], ITA: ['380', 'Italia'],
  GBR: ['826', 'Reino Unido'], IRL: ['372', 'Irlanda'], NLD: ['528', 'Países Bajos'], BEL: ['056', 'Bélgica'], CHE: ['756', 'Suiza'],
  AUT: ['040', 'Austria'], SWE: ['752', 'Suecia'], NOR: ['578', 'Noruega'], FIN: ['246', 'Finlandia'], DNK: ['208', 'Dinamarca'],
  ISL: ['352', 'Islandia'], POL: ['616', 'Polonia'], GRC: ['300', 'Grecia'], CZE: ['203', 'Chequia'], HUN: ['348', 'Hungría'],
  ROU: ['642', 'Rumania'], BGR: ['100', 'Bulgaria'], UKR: ['804', 'Ucrania'], RUS: ['643', 'Rusia'], TUR: ['792', 'Turquía'],
  EST: ['233', 'Estonia'], LUX: ['442', 'Luxemburgo'],
  // Asia y Oceanía
  CHN: ['156', 'China'], JPN: ['392', 'Japón'], KOR: ['410', 'Corea del Sur'], PRK: ['408', 'Corea del Norte'], TWN: ['158', 'Taiwán'],
  IND: ['356', 'India'], IDN: ['360', 'Indonesia'], MYS: ['458', 'Malasia'], SGP: ['702', 'Singapur'], THA: ['764', 'Tailandia'],
  VNM: ['704', 'Vietnam'], PHL: ['608', 'Filipinas'], PAK: ['586', 'Pakistán'], BGD: ['050', 'Bangladés'], AUS: ['036', 'Australia'],
  NZL: ['554', 'Nueva Zelanda'], KAZ: ['398', 'Kazajistán'], SAU: ['682', 'Arabia Saudita'], ARE: ['784', 'Emiratos Árabes'],
  QAT: ['634', 'Catar'], ISR: ['376', 'Israel'], IRN: ['364', 'Irán'], IRQ: ['368', 'Irak'], HKG: ['344', 'Hong Kong'],
  // África
  ZAF: ['710', 'Sudáfrica'], NGA: ['566', 'Nigeria'], EGY: ['818', 'Egipto'], ETH: ['231', 'Etiopía'], KEN: ['404', 'Kenia'],
  MAR: ['504', 'Marruecos'], DZA: ['012', 'Argelia'], GHA: ['288', 'Ghana'], AGO: ['024', 'Angola'], BWA: ['072', 'Botsuana'],
  COD: ['180', 'R. D. del Congo'], ZMB: ['894', 'Zambia'],
};

export type PaisGeo = { iso?: string; num: string; nombre: string; f: Feature<Geometry, { name: string }>; principal: Feature<Polygon> };

const NUM_A_ISO = Object.fromEntries(Object.entries(PAISES).map(([iso, [num]]) => [num, iso]));

/** Polígono de mayor área (el territorio continental: Chile sin Isla de Pascua, EE. UU. sin Alaska ni Hawái). */
const principalDe = (f: Feature<Geometry>): Feature<Polygon> => {
  const g = f.geometry;
  if (g.type === 'Polygon') return { type: 'Feature', properties: {}, geometry: g };
  if (g.type !== 'MultiPolygon') return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } };
  let mejor: Polygon = { type: 'Polygon', coordinates: (g as MultiPolygon).coordinates[0] };
  let area = -1;
  for (const c of (g as MultiPolygon).coordinates) {
    const p: Polygon = { type: 'Polygon', coordinates: c };
    const a = geoArea(p);
    if (a > area) { area = a; mejor = p; }
  }
  return { type: 'Feature', properties: {}, geometry: mejor };
};

let cache: PaisGeo[] | null = null;
/** Todos los países (sin la Antártida), con iso y nombre en español cuando están en la tabla. Se calcula una vez. */
export const paisesGeo = (): PaisGeo[] => {
  if (cache) return cache;
  const topo = mundo50 as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const fc = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;
  cache = fc.features.filter((f) => f.properties.name !== 'Antarctica' && f.geometry).map((f) => {
    const num = String(f.id ?? '').padStart(3, '0');
    const iso = NUM_A_ISO[num];
    return { iso, num, nombre: iso ? PAISES[iso][1] : f.properties.name, f, principal: principalDe(f) };
  });
  return cache;
};

export const paisPorIso = (iso: string): PaisGeo | undefined => paisesGeo().find((p) => p.iso === iso);
/** Nombre en español (o el del atlas, en inglés, si el país no está en la tabla; o el ISO si no existe). */
export const nombrePais = (iso: string) => PAISES[iso]?.[1] ?? iso;
/** Centro geográfico del territorio principal (para etiquetas y flechas). */
export const centroPais = (iso: string): LonLat | undefined => {
  const p = paisPorIso(iso);
  return p ? (geoCentroid(p.principal) as LonLat) : undefined;
};

const normLon = (x: number) => ((((x + 180) % 360) + 360) % 360) - 180;
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * Math.PI) / 360));

/**
 * Caja [oeste, sur, este, norte] de los territorios principales, por el lado CORTO del globo (Chile + Corea cruza el
 * Pacífico, no África). `este` puede ser > 180 cuando cruza el antimeridiano.
 */
export const cajaDe = (isos: string[]): [number, number, number, number] | null => {
  const cajas = isos.flatMap((i) => { const p = paisPorIso(i); return p ? [geoBounds(p.principal)] : []; });
  if (!cajas.length) return null;
  const s = Math.min(...cajas.map((b) => b[0][1])), n = Math.max(...cajas.map((b) => b[1][1]));
  // Intervalos de longitud en [0, 360) y el hueco más grande del círculo: la caja es su complemento.
  const iv = cajas.map((b) => { const w = b[0][0], e = b[1][0] < w ? b[1][0] + 360 : b[1][0]; return [w + 180, e + 180] as [number, number]; })
    .sort((a, b) => a[0] - b[0]);
  const unidos: [number, number][] = [];
  for (const [a, b] of iv) {
    const u = unidos[unidos.length - 1];
    if (u && a <= u[1]) u[1] = Math.max(u[1], b); else unidos.push([a, b]);
  }
  let hueco = -1, oeste = unidos[0][0], este = unidos[unidos.length - 1][1];
  for (let k = 0; k < unidos.length; k++) {
    const fin = unidos[k][1], sig = k + 1 < unidos.length ? unidos[k + 1][0] : unidos[0][0] + 360;
    if (sig - fin > hueco) { hueco = sig - fin; este = fin; oeste = sig; }
  }
  // La caja va de `oeste` a `este` dando la vuelta (oeste > este en [0,360) → sumar 360 a este).
  let w = oeste - 180, e = este - 180;
  if (w >= 180) w -= 360;
  while (e < w) e += 360;
  return [w, s, e, n];
};

/** Escala d3 (px por radián) para un zoom del contrato en un lienzo de `ancho` px. */
export const escalaDeZoom = (zoom: number, ancho: number) => (ancho / (2 * Math.PI)) * Math.pow(2, zoom - 1);

/** Centro y zoom que encuadran los países destacados con margen (los que el guion no fija). */
export const encuadre = (isos: string[], ancho: number, alto: number, margen = 0.62): Camara => {
  const c = cajaDe(isos);
  if (!c) return { centro: [0, 20], zoom: 1 };
  const [w, s, e, n] = c;
  const centro: LonLat = [normLon((w + e) / 2), (s + n) / 2];
  const dLon = Math.max(4, e - w) * (Math.PI / 180);
  const dY = Math.max(0.08, mercY(n) - mercY(s));
  const k = Math.min((ancho * margen) / dLon, (alto * margen) / dY);
  const zoom = 1 + Math.log2((k * 2 * Math.PI) / ancho);
  return { centro, zoom: Math.max(1, Math.min(7, +zoom.toFixed(2))) };
};

export const tipoProyeccion = (centro: LonLat): TipoProyeccion => (Math.abs(centro[1]) > 60 ? 'ortografica' : 'mercator');

/** Proyección para una cámara y un lienzo (ancho × alto px). Mercator rota la longitud: cruza el antimeridiano sin cortes. */
export const proyeccion = (cam: Camara, ancho: number, alto: number): GeoProjection => {
  const k = escalaDeZoom(cam.zoom, ancho);
  if (tipoProyeccion(cam.centro) === 'ortografica') {
    return geoOrthographic().scale(k).translate([ancho / 2, alto / 2]).rotate([-cam.centro[0], -cam.centro[1], 0]).clipAngle(90);
  }
  return geoMercator().rotate([-cam.centro[0], 0, 0]).center([0, cam.centro[1]]).scale(k).translate([ancho / 2, alto / 2])
    .clipExtent([[-40, -40], [ancho + 40, alto + 40]]);
};

/** Caja de una etiqueta en px. */
export type Caja = { x: number; y: number; w: number; h: number };
const chocan = (a: Caja, b: Caja, m = 6) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;

/**
 * Anticolisión simple: cada etiqueta prueba su posición y, si choca con una ya puesta (o sale del lienzo), se
 * desplaza abajo/arriba en pasos de su alto; si no encuentra lugar en 6 intentos, no se dibuja (null).
 */
export const ubicarEtiquetas = (cajas: Caja[], ancho: number, alto: number, margen = 12): (Caja | null)[] => {
  const puestas: Caja[] = [];
  return cajas.map((c) => {
    const pasos = [0, 1, -1, 2, -2, 3, -3];
    for (const p of pasos) {
      const x = Math.max(margen, Math.min(ancho - margen - c.w, c.x));
      const k: Caja = { ...c, x, y: c.y + p * (c.h + 4) };
      if (k.y < margen || k.y + k.h > alto - margen) continue;
      if (puestas.some((o) => chocan(o, k))) continue;
      puestas.push(k);
      return k;
    }
    return null;
  });
};

/**
 * VIAJE v3 entre dos países (cambio grande de protagonista): cámara de país sobre `desde`, cámara de país sobre
 * `hasta` y el zoom mínimo de la mitad del camino (el que encuadra a ambos, nunca < 1). Se calcula una vez por mapa.
 */
export type PlanViaje = { a: Camara; b: Camara; zoomMedio: number; origen: LonLat; destino: LonLat; centro: (t: number) => LonLat; ruta: (t: number) => LonLat };
export const planViaje = (desde: string, hasta: string, ancho: number, alto: number): PlanViaje | null => {
  if (!paisPorIso(desde) || !paisPorIso(hasta)) return null;
  const a = encuadre([desde], ancho, alto), b = encuadre([hasta], ancho, alto);
  // La ruta une los centros de cámara (centro de la caja de cada país, siempre sobre tierra en países alargados como
  // Chile, donde el centroide cae al mar): al aterrizar, la línea termina justo en el centro de la pantalla.
  const origen = a.centro, destino = b.centro;
  const ambos = encuadre([desde, hasta], ancho, alto);
  const zoomMedio = Math.max(1, Math.min(ambos.zoom, a.zoom, b.zoom));
  const ic = geoInterpolate(a.centro, b.centro);
  return { a, b, zoomMedio, origen, destino, centro: (t) => ic(t) as LonLat, ruta: (t) => ic(t) as LonLat };
};

/**
 * Cámara del viaje en el avance `p` (0–1, ya suavizado): el centro va por el círculo máximo y el zoom sigue una
 * parábola que parte en el zoom de `desde`, toca `zoomMedio` a mitad de camino y termina en el de `hasta` (sin
 * quiebres: una sola curva suave).
 */
export const camaraEnViaje = (pv: PlanViaje, p: number): Camara => {
  const lineal = pv.a.zoom + (pv.b.zoom - pv.a.zoom) * p;
  const hundir = (pv.a.zoom + pv.b.zoom) / 2 - pv.zoomMedio;
  return { centro: pv.centro(p), zoom: lineal - Math.max(0, hundir) * 4 * p * (1 - p) };
};
