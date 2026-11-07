/**
 * Pictogramas de los visuales `iconos` (CC0, dibujados para el canal): trazo redondo blanco + un acento, caja 100×100.
 * Junta los del índice de En Números Rojos (comun/pictogramas), los portados de Línea Punteada y los del nicho
 * económico. Un nombre que no está aquí se dibuja como emoji (Noto Color Emoji).
 */
import React from 'react';
import { PICTOGRAMAS as BASE } from '../pictogramas';

type P = { c: string; a: string };
const T = (c: string, w = 7) => ({ stroke: c, strokeWidth: w, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/** Portados de Línea Punteada (mismo estilo). `barco` de allá es un velero: aquí se llama `velero`. */
const DE_LINEA_PUNTEADA: Record<string, React.FC<P>> = {
  guerra: ({ c, a }) => (<g>
    <path d="M22 18 L70 66" {...T(c, 8)} /><path d="M78 18 L30 66" {...T(c, 8)} />
    <path d="M60 72 L74 58 M26 58 L40 72" {...T(a, 8)} /><path d="M70 66 L82 82 M30 66 L18 82" {...T(a, 9)} />
  </g>),
  tren: ({ c, a }) => (<g>
    <rect x="22" y="16" width="56" height="54" rx="12" {...T(c)} /><path d="M22 44 H78" {...T(c)} />
    <rect x="32" y="24" width="36" height="12" rx="3" {...T(a, 5)} />
    <circle cx="36" cy="57" r="4" fill={a} /><circle cx="64" cy="57" r="4" fill={a} />
    <path d="M32 70 L22 86 M68 70 L78 86 M28 80 H72" {...T(c)} />
  </g>),
  rio: ({ c, a }) => (<g>
    <path d="M12 30 q12 -10 24 0 t24 0 t24 0 t12 -4" {...T(a)} />
    <path d="M12 52 q12 -10 24 0 t24 0 t24 0 t12 -4" {...T(c)} />
    <path d="M12 74 q12 -10 24 0 t24 0 t24 0 t12 -4" {...T(c)} />
  </g>),
  tratado: ({ c, a }) => (<g>
    <path d="M26 12 H66 L78 24 V88 H26 Z" {...T(c)} /><path d="M36 34 H66 M36 48 H66 M36 62 H54" {...T(c, 5)} />
    <circle cx="64" cy="74" r="10" {...T(a, 6)} /><path d="M58 84 L54 96 M70 84 L74 96" {...T(a, 5)} />
  </g>),
  dinero: ({ c, a }) => (<g>
    <ellipse cx="50" cy="26" rx="30" ry="10" {...T(a)} />
    <path d="M20 26 V44 M80 26 V44 M20 44 a30 10 0 0 0 60 0 M20 44 V62 M80 44 V62 M20 62 a30 10 0 0 0 60 0 M20 62 V78 M80 62 V78 M20 78 a30 10 0 0 0 60 0" {...T(c)} />
  </g>),
  tribunal: ({ c, a }) => (<g>
    <path d="M12 34 L50 12 L88 34 Z" {...T(a)} /><path d="M24 40 V74 M42 40 V74 M58 40 V74 M76 40 V74" {...T(c)} />
    <path d="M14 82 H86 M10 92 H90" {...T(c)} />
  </g>),
  hielo: ({ c, a }) => (<g>
    <path d="M50 10 V90 M15 30 L85 70 M15 70 L85 30" {...T(c)} />
    <path d="M40 18 L50 28 L60 18 M40 82 L50 72 L60 82" {...T(a, 6)} />
  </g>),
  isla: ({ c, a }) => (<g>
    <path d="M10 82 q20 -8 40 0 t40 0" {...T(c)} /><path d="M24 72 q26 -18 52 0" {...T(c)} />
    <path d="M50 66 q-2 -26 6 -42" {...T(c)} />
    <path d="M56 24 q-18 -8 -30 4 M56 24 q16 -10 30 2 M56 24 q-4 -14 -16 -16 M56 24 q10 -2 14 14" {...T(a, 6)} />
  </g>),
  velero: ({ c, a }) => (<g>
    <path d="M14 62 H86 L74 82 H26 Z" {...T(c)} /><path d="M50 62 V12" {...T(c)} />
    <path d="M54 16 L80 52 H54 Z" {...T(a, 6)} /><path d="M46 22 L26 52 H46 Z" {...T(a, 6)} />
    <path d="M8 92 q10 -6 20 0 t20 0 t20 0 t20 0" {...T(c, 5)} />
  </g>),
  montana: ({ c, a }) => (<g>
    <path d="M6 84 L38 26 L58 60 L70 42 L94 84 Z" {...T(c)} />
    <path d="M28 44 L38 26 L48 44 L42 40 L36 46 Z" {...T(a, 5)} />
  </g>),
  carretera: ({ c, a }) => (<g>
    <path d="M40 12 L14 90 M60 12 L86 90" {...T(c)} /><path d="M50 18 V30 M50 42 V56 M50 68 V88" {...T(a, 7)} />
  </g>),
  bandera: ({ c, a }) => (<g>
    <path d="M24 92 V10" {...T(c)} /><path d="M24 14 q14 -8 28 0 t28 0 V50 q-14 8 -28 0 t-28 0 Z" {...T(a, 6)} />
  </g>),
};

/** Del nicho económico (nuevos, 2026-11-07). */
const ECONOMIA: Record<string, React.FC<P>> = {
  /** Lingote de cobre/metal apilado. */
  lingote: ({ c, a }) => (<g>
    <path d="M14 78 L24 58 H56 L66 78 Z" {...T(c)} /><path d="M44 58 L54 38 H80 L90 58" {...T(c)} />
    <path d="M30 44 L38 28 H64 L70 40" {...T(a, 6)} /><path d="M24 68 H50" {...T(a, 5)} />
  </g>),
  /** Barco portacontenedores. */
  contenedor: ({ c, a }) => (<g>
    <path d="M8 60 H92 L80 82 H22 Z" {...T(c)} />
    <rect x="20" y="42" width="18" height="18" {...T(a, 5)} /><rect x="40" y="42" width="18" height="18" {...T(c, 5)} /><rect x="60" y="42" width="18" height="18" {...T(a, 5)} />
    <rect x="30" y="24" width="18" height="18" {...T(c, 5)} /><rect x="50" y="24" width="18" height="18" {...T(a, 5)} />
    <path d="M6 92 q10 -6 20 0 t20 0 t20 0 t20 0" {...T(c, 5)} />
  </g>),
  /** Universidad (birrete). */
  universidad: ({ c, a }) => (<g>
    <path d="M8 40 L50 22 L92 40 L50 58 Z" {...T(c)} /><path d="M26 48 V68 q24 16 48 0 V48" {...T(c)} />
    <path d="M92 40 V66" {...T(a, 6)} /><circle cx="92" cy="72" r="5" fill={a} />
  </g>),
  /** Bombilla: innovación, I+D. */
  bombilla: ({ c, a }) => (<g>
    <path d="M36 66 q-16 -12 -16 -30 a30 30 0 0 1 60 0 q0 18 -16 30 Z" {...T(c)} /><path d="M38 76 H62 M40 86 H60" {...T(c)} />
    <path d="M42 48 L50 36 L58 48" {...T(a, 6)} /><path d="M50 36 V62" {...T(a, 6)} />
  </g>),
  /** Patente: documento con sello y engranaje. */
  patente: ({ c, a }) => (<g>
    <path d="M22 10 H62 L76 24 V90 H22 Z" {...T(c)} /><path d="M32 30 H58 M32 42 H64" {...T(c, 5)} />
    <circle cx="50" cy="68" r="11" {...T(a, 6)} /><path d="M50 50 V54 M50 82 V86 M32 68 H36 M64 68 H68 M37 55 L40 58 M60 78 L63 81 M63 55 L60 58 M40 78 L37 81" {...T(a, 5)} />
  </g>),
  /** Billete. */
  billete: ({ c, a }) => (<g>
    <rect x="8" y="26" width="84" height="48" rx="6" {...T(c)} /><circle cx="50" cy="50" r="12" {...T(a, 6)} />
    <path d="M20 38 V62 M80 38 V62" {...T(c, 5)} />
  </g>),
  /** Carrito de compras: consumo, precios. */
  carrito: ({ c, a }) => (<g>
    <path d="M8 18 H22 L32 64 H80 L88 32 H26" {...T(c)} /><circle cx="38" cy="80" r="7" {...T(c, 6)} /><circle cx="74" cy="80" r="7" {...T(c, 6)} />
    <path d="M40 44 H76" {...T(a, 6)} />
  </g>),
  /** Chip: tecnología, semiconductores. */
  chip: ({ c, a }) => (<g>
    <rect x="24" y="24" width="52" height="52" rx="6" {...T(c)} /><rect x="38" y="38" width="24" height="24" rx="3" {...T(a, 6)} />
    <path d="M36 10 V24 M50 10 V24 M64 10 V24 M36 76 V90 M50 76 V90 M64 76 V90 M10 36 H24 M10 50 H24 M10 64 H24 M76 36 H90 M76 50 H90 M76 64 H90" {...T(c, 5)} />
  </g>),
};

export const PICTOGRAMAS: Record<string, React.FC<P>> = { ...DE_LINEA_PUNTEADA, ...BASE, ...ECONOMIA };
/** Sinónimos que el guion puede usar. */
const ALIAS: Record<string, string> = { cobre: 'lingote', metal: 'lingote', puerto: 'contenedor', exportacion: 'contenedor', educacion: 'universidad', innovacion: 'bombilla', idea: 'bombilla', plata: 'billete', consumo: 'carrito', tecnologia: 'chip', industria: 'fabrica', vivienda: 'casa', mineria: 'mina' };

export const nombrePictograma = (nombre: string): string | null => {
  const n = nombre.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (Object.prototype.hasOwnProperty.call(PICTOGRAMAS, n)) return n;
  return ALIAS[n] ?? null;
};
