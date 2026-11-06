import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PALETA } from '../../../marca/tokens';

/**
 * Fondo grafito con una rejilla de papel milimetrado casi invisible que se desplaza muy lento (y una viñeta):
 * así ninguna escena larga queda estática (> 8 s) aunque el gráfico ya esté completo.
 */
export const FondoRejilla: React.FC<{ frame: number; fps: number; ancho: number; alto: number; paso?: number }> = ({ frame, fps, ancho, alto, paso = 64 }) => {
  const t = frame / fps;
  const dx = (t * 6) % paso, dy = (t * 3.5) % paso;
  const lineas: React.ReactNode[] = [];
  for (let x = -paso; x < ancho + paso; x += paso) lineas.push(<line key={`v${x}`} x1={x + dx} x2={x + dx} y1={0} y2={alto} />);
  for (let y = -paso; y < alto + paso; y += paso) lineas.push(<line key={`h${y}`} x1={0} x2={ancho} y1={y + dy} y2={y + dy} />);
  return (
    <AbsoluteFill style={{ background: PALETA.fondo }}>
      <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0 }}>
        <g stroke="#FFFFFF" strokeOpacity={0.035} strokeWidth={1.5}>{lineas}</g>
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(17,20,24,0) 55%, rgba(8,10,12,0.75) 100%)' }} />
    </AbsoluteFill>
  );
};
