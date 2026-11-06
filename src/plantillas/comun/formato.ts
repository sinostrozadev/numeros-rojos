/**
 * Formato numérico es-CL (módulo puro): punto de miles, coma decimal, espacio antes de % (norma RAE).
 * Lo usan los gráficos (ejes, etiquetas, contadores) y la miniatura.
 */
import type { Grafico, SerieResuelta } from './datos';

export type OpcionesNumero = { decimales?: number; prefijo?: string; sufijo?: string; compacto?: boolean };

const conMiles = (entero: string) => entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** 1234567.8 → "1.234.567,8" (con `decimales` fijos). */
export const numeroEs = (v: number, decimales = 0): string => {
  if (!Number.isFinite(v)) return '—';
  const neg = v < 0;
  const [e, d] = Math.abs(v).toFixed(decimales).split('.');
  return `${neg ? '−' : ''}${conMiles(e)}${d ? ',' + d : ''}`;
};

/** Compacto para ejes y etiquetas: 1.500.000 → "1,5 M", 2.300.000.000 → "2,3 mil M", 25.000 → "25.000". */
export const compactoEs = (v: number): string => {
  const a = Math.abs(v);
  const fijo = (x: number) => numeroEs(x, x < 10 && x % 1 !== 0 ? 1 : 0);
  if (a >= 1e12) return `${fijo(v / 1e12)} B`; // billón (10^12) en español
  if (a >= 1e9) return `${fijo(v / 1e9)} mil M`;
  if (a >= 1e6) return `${fijo(v / 1e6)} M`;
  return numeroEs(v, a < 10 && v % 1 !== 0 ? 1 : 0);
};

export const formatear = (v: number, o: OpcionesNumero = {}): string => {
  const cuerpo = o.compacto ? compactoEs(v) : numeroEs(v, o.decimales ?? (Math.abs(v) < 10 && v % 1 !== 0 ? 1 : 0));
  return `${o.prefijo ?? ''}${cuerpo}${o.sufijo ?? ''}`;
};

/** Prefijo/sufijo por defecto según la unidad del dataset (si el guion no los da). */
export const opcionesDe = (g: Grafico, serie?: SerieResuelta): OpcionesNumero => {
  const f = g.formato ?? {};
  const unidad = (g.datos.unidad ?? serie?.unidad ?? '').trim();
  let prefijo = f.prefijo;
  let sufijo = f.sufijo;
  if (prefijo === undefined && sufijo === undefined) {
    if (/^%|por ?ciento/i.test(unidad)) sufijo = ' %';
    else if (/^(US\$|USD|d[oó]lares)/i.test(unidad)) prefijo = 'US$ ';
    else if (/^\$/.test(unidad)) prefijo = '$ ';
    else if (/^años?$/i.test(unidad)) sufijo = ' años';
  }
  return { decimales: f.decimales, prefijo, sufijo };
};

/** Marcas "bonitas" de un eje lineal (1, 2, 2,5 o 5 × 10^k), entre `min` y `max`, ~`n` marcas. */
export const marcasBonitas = (min: number, max: number, n = 5): number[] => {
  if (!(max > min)) return [min];
  const paso0 = (max - min) / Math.max(1, n);
  const mag = Math.pow(10, Math.floor(Math.log10(paso0)));
  const r = paso0 / mag;
  const paso = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / paso) * paso; v <= max + paso * 1e-6; v += paso) out.push(+v.toFixed(10));
  return out;
};

/** Marcas de un eje logarítmico: 1, 2, 5 × 10^k dentro del rango. */
export const marcasLog = (min: number, max: number): number[] => {
  const out: number[] = [];
  for (let k = Math.floor(Math.log10(Math.max(min, 1e-9))); k <= Math.ceil(Math.log10(max)); k++) {
    for (const m of [1, 2, 5]) { const v = m * Math.pow(10, k); if (v >= min * 0.999 && v <= max * 1.001) out.push(v); }
  }
  return out.length > 7 ? out.filter((v) => /^1/.test(String(v))) : out;
};

/** Paso de años del eje X según el tramo (cada 5, 10, 20 o 25 años). */
export const pasoAnios = (a0: number, a1: number, max = 8) => {
  for (const p of [1, 2, 5, 10, 20, 25, 50]) if ((a1 - a0) / p <= max) return p;
  return 100;
};
