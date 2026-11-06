/**
 * Lectura de las series resueltas para los gráficos (módulo puro, sin Remotion). Las composiciones y los planes
 * (tesis/plan.ts, grafico/plan.ts) buscan aquí la serie de un `Grafico`, su rango de años y el valor de un país.
 */
import { claveDeRef, type DatosResueltos, type Grafico, type SerieResuelta } from '../datos';
import { GRIS_BARRA, PALETA, SERIES_GRAFICO } from '../../../marca/tokens';

export const serieDe = (g: Grafico, datos?: DatosResueltos): SerieResuelta | undefined => datos?.[claveDeRef(g.datos)];

export type Punto = { anio: number; valor: number };
export type SeriePais = { iso: string; pais: string; puntos: Punto[] };

/** Países de la serie en el orden del guion, con puntos ordenados por año y recortados a desde/hasta. */
export const paisesDe = (g: Grafico, serie?: SerieResuelta): SeriePais[] => {
  if (!serie) return [];
  const d = g.datos.desde ?? -Infinity, h = g.datos.hasta ?? Infinity;
  return g.datos.paises.flatMap((iso) => {
    const s = serie.series[iso];
    if (!s) return [];
    const puntos = s.puntos.filter((p) => p.anio >= d && p.anio <= h && Number.isFinite(p.valor)).sort((a, b) => a.anio - b.anio);
    return puntos.length ? [{ iso, pais: s.pais, puntos }] : [];
  });
};

/** Años mínimo y máximo con dato entre todos los países. */
export const rangoAnios = (ps: SeriePais[], g?: Grafico): [number, number] | null => {
  const todos = ps.flatMap((p) => p.puntos.map((q) => q.anio));
  if (!todos.length) return g?.datos.desde && g?.datos.hasta ? [g.datos.desde, g.datos.hasta] : null;
  return [Math.min(...todos), Math.max(...todos)];
};

/** Valor del país en el año (o el último anterior disponible, como hace el revisor con "valor"). */
export const valorEn = (p: SeriePais, anio: number): number | null => {
  let v: number | null = null;
  for (const q of p.puntos) { if (q.anio <= anio) v = q.valor; else break; }
  return v;
};

/** Valor interpolado en un año fraccionario (la cabeza de la línea mientras se dibuja). */
export const valorInterpolado = (p: SeriePais, anio: number): number | null => {
  const ps = p.puntos;
  if (!ps.length || anio < ps[0].anio) return null;
  for (let k = 1; k < ps.length; k++) {
    if (anio <= ps[k].anio) {
      const a = ps[k - 1], b = ps[k];
      return a.valor + ((b.valor - a.valor) * (anio - a.anio)) / Math.max(1e-9, b.anio - a.anio);
    }
  }
  return ps[ps.length - 1].valor;
};

/** Año de referencia de barras/contador/mapa: `destacar.anio` o el último año en que la mayoría tiene dato. */
export const anioReferencia = (g: Grafico, ps: SeriePais[]): number | null => {
  if (g.destacar?.anio) return g.destacar.anio;
  if (!ps.length) return null;
  const conteo = new Map<number, number>();
  ps.forEach((p) => p.puntos.forEach((q) => conteo.set(q.anio, (conteo.get(q.anio) ?? 0) + 1)));
  const umbral = Math.max(1, Math.ceil(ps.length * 0.75));
  const anios = [...conteo.entries()].filter(([, n]) => n >= umbral).map(([a]) => a);
  return anios.length ? Math.max(...anios) : Math.max(...conteo.keys());
};

/** País destacado (en dorado): `destacar.pais`, o ninguno. */
export const destacadoDe = (g: Grafico) => g.destacar?.pais ?? null;

/**
 * Color de cada país en un gráfico de identidad (líneas, ranking): el destacado en dorado, el resto en
 * SERIES_GRAFICO en orden fijo (nunca ciclado por rango). Sin destacado y con un solo país: dorado.
 */
export const coloresDe = (g: Grafico, ps: SeriePais[]): Record<string, string> => {
  const dest = destacadoDe(g);
  const out: Record<string, string> = {};
  let k = 0;
  for (const p of ps) {
    if (p.iso === dest || (ps.length === 1 && !dest)) out[p.iso] = PALETA.dorado;
    else out[p.iso] = SERIES_GRAFICO[k++ % SERIES_GRAFICO.length];
  }
  return out;
};

/** Color de barras: destacado dorado y el resto gris de contexto; sin destacado, todos azul. */
export const colorBarra = (g: Grafico, iso: string) => {
  const dest = destacadoDe(g);
  if (!dest) return PALETA.azul;
  return iso === dest ? PALETA.dorado : GRIS_BARRA;
};

/** ¿La fuente es un fixture de prueba? (se marca en rojo en el pie y nunca debe publicarse). */
export const esFixture = (serie?: SerieResuelta) => !!serie && /FIXTURE/i.test(serie.fuenteTexto);
