/**
 * Pictogramas propios de En Números Rojos (dibujados para el canal, CC0): trazo redondo blanco con un acento, en
 * una caja de 100×100. Se usan en el índice de capítulos (promesa) y en la barra de progreso de capítulos.
 * `pictogramaPara(texto)` elige uno por palabras clave del título del capítulo; si nada calza, devuelve null
 * (el índice muestra el número).
 */
import React from 'react';

type P = { c: string; a: string };
const T = (c: string, w = 7) => ({ stroke: c, strokeWidth: w, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const PICTOGRAMAS: Record<string, React.FC<P>> = {
  sube: ({ c, a }) => (<g><path d="M12 86 H90 M12 86 V14" {...T(c, 6)} /><path d="M22 70 L42 52 L56 60 L84 26" {...T(a, 8)} /><path d="M70 24 H86 V40" {...T(a, 8)} /></g>),
  baja: ({ c, a }) => (<g><path d="M12 86 H90 M12 86 V14" {...T(c, 6)} /><path d="M22 26 L42 46 L56 38 L84 72" {...T(a, 8)} /><path d="M70 74 H86 V58" {...T(a, 8)} /></g>),
  moneda: ({ c, a }) => (<g><circle cx="50" cy="50" r="36" {...T(c)} /><path d="M60 36 q-10 -8 -20 -2 q-8 6 0 12 l12 6 q8 6 0 12 q-10 6 -20 -2 M50 24 V30 M50 70 V76" {...T(a, 6)} /></g>),
  fabrica: ({ c, a }) => (<g><path d="M10 88 V46 L32 58 V46 L54 58 V46 L76 58 V20 H88 V88 Z" {...T(c)} /><path d="M24 74 H34 M46 74 H56 M68 74 H78" {...T(a, 7)} /></g>),
  casa: ({ c, a }) => (<g><path d="M14 48 L50 18 L86 48" {...T(c)} /><path d="M24 42 V86 H76 V42" {...T(c)} /><rect x="42" y="60" width="16" height="26" {...T(a, 6)} /></g>),
  persona: ({ c, a }) => (<g><circle cx="50" cy="30" r="14" {...T(c)} /><path d="M22 88 q0 -32 28 -32 q28 0 28 32" {...T(c)} /><path d="M40 70 L50 80 L60 70" {...T(a, 6)} /></g>),
  globo: ({ c, a }) => (<g><circle cx="50" cy="50" r="36" {...T(c)} /><path d="M14 50 H86 M50 14 q-20 36 0 72 M50 14 q20 36 0 72" {...T(c, 5)} /><circle cx="64" cy="34" r="7" fill={a} /></g>),
  balanza: ({ c, a }) => (<g><path d="M50 14 V86 M30 86 H70 M18 28 H82" {...T(c)} /><path d="M18 28 L8 56 H28 Z M82 28 L72 56 H92 Z" {...T(a, 6)} /></g>),
  reloj: ({ c, a }) => (<g><circle cx="50" cy="52" r="34" {...T(c)} /><path d="M50 32 V52 L64 62" {...T(a, 8)} /><path d="M40 12 H60" {...T(c)} /></g>),
  mina: ({ c, a }) => (<g><path d="M14 30 q36 -22 72 0" {...T(c)} /><path d="M50 22 L50 86" {...T(c)} /><path d="M30 86 L44 66 L58 76 L70 60" {...T(a, 7)} /></g>),
  barco: ({ c, a }) => (<g><path d="M14 58 H86 L74 80 H26 Z" {...T(c)} /><rect x="30" y="36" width="18" height="22" {...T(a, 6)} /><rect x="52" y="28" width="18" height="30" {...T(a, 6)} /><path d="M8 92 q10 -6 20 0 t20 0 t20 0 t20 0" {...T(c, 5)} /></g>),
  banco: ({ c, a }) => (<g><path d="M12 36 L50 14 L88 36 Z" {...T(a)} /><path d="M24 42 V76 M42 42 V76 M58 42 V76 M76 42 V76" {...T(c)} /><path d="M14 84 H86" {...T(c)} /></g>),
  lupa: ({ c, a }) => (<g><circle cx="42" cy="42" r="26" {...T(c)} /><path d="M62 62 L86 86" {...T(c, 9)} /><path d="M32 48 L40 40 L46 46 L54 34" {...T(a, 6)} /></g>),
};

const REGLAS: [RegExp, string][] = [
  [/sueldo|salari|ingreso|trabaj|emple|gente|persona|hogar(es)?\b/i, 'persona'],
  [/vivienda|arriendo|alquiler|casa|hipotec/i, 'casa'],
  [/infla|precio|peso|d[oó]lar|moneda|ahorro|plata|dinero|costo/i, 'moneda'],
  [/industri|f[aá]brica|acero|manufactur|producci/i, 'fabrica'],
  [/cobre|litio|mina|miner|petr[oó]le|recurso/i, 'mina'],
  [/export|import|comercio|puerto|barco|tratado/i, 'barco'],
  [/banco|cr[eé]dito|deuda|tasa|inter[eé]s/i, 'banco'],
  [/mundo|global|pa[ií]ses|vecino|regi[oó]n/i, 'globo'],
  [/desigual|vs\b|frente|compar|brecha/i, 'balanza'],
  [/historia|d[eé]cada|a[nñ]os|siglo|tiempo|futuro|hoy/i, 'reloj'],
  [/ca[ií]da|crisis|perdi|baj[oó]|estanc/i, 'baja'],
  [/crec|despeg|sub|milagro|boom/i, 'sube'],
  [/n[uú]mero|dato|cifra|verdad|qui[eé]n|por qu[eé]/i, 'lupa'],
];

/** Pictograma por palabras clave del texto, o null. */
export const pictogramaPara = (texto: string): string | null => REGLAS.find(([r]) => r.test(texto))?.[1] ?? null;

export const Pictograma: React.FC<{ nombre: string; tamano: number; color: string; acento: string }> = ({ nombre, tamano, color, acento }) => {
  const Dibujo = PICTOGRAMAS[nombre];
  if (!Dibujo) return null;
  return <svg width={tamano} height={tamano} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block' }}><Dibujo c={color} a={acento} /></svg>;
};
