import React from 'react';
import { PALETA } from './tokens';

/**
 * Isotipo de En Números Rojos (mismo dibujo que marca-canal/logo.svg): un cuadro grafito con una línea de gráfico que sube en verde billete y en el
 * último tramo CAE y se vuelve roja, terminando en un punto rojo. Legible a 48 px (trazo grueso, 3 vértices).
 * `avance` (0–1) dibuja la línea (cierre de marca).
 */
export const Logo: React.FC<{ tamano: number; avance?: number }> = ({ tamano, avance = 1 }) => {
  const a = Math.max(0, Math.min(1, avance));
  const subida = Math.min(1, a / 0.62);
  const caida = Math.max(0, (a - 0.62) / 0.38);
  return (
    <svg viewBox="0 0 100 100" width={tamano} height={tamano} style={{ display: 'block' }}>
      <rect x="0" y="0" width="100" height="100" rx="22" fill={PALETA.fondo} stroke="#2E3640" strokeWidth="2" />
      <path d="M18 84 H84" stroke="#3A4350" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 64 L36 46 L50 54 L62 26" fill="none" stroke={PALETA.verde} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={`${subida} 1`} />
      {caida > 0 && (
        <path d="M62 26 L80 70" fill="none" stroke={PALETA.rojo} strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray={`${caida} 1`} />
      )}
      <circle cx="80" cy="70" r={8.5 * Math.min(1, Math.max(0, (a - 0.92) / 0.08))} fill={PALETA.rojo} />
    </svg>
  );
};
