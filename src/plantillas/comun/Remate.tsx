import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { PALETA, TIPO, fondoAlfa } from '../../marca/tokens';
import { mitadesRemate } from './remate-texto';

export { mitadesRemate };

/**
 * Remate simétrico GIGANTE: velo sobre el último gráfico, primera mitad en blanco, una línea de gráfico que se
 * dibuja entre ambas, y la segunda mitad en dorado que entra con golpe cuando la voz llega a ella.
 * `ancho`/`centroY` lo ubican en 16:9 o 9:16; `fsMax` limita el tamaño.
 */
export const Remate: React.FC<{ texto: string; frame: number; segundaEn: number; ancho: number; izquierda: number; centroY: number; fsMax: number }> = ({ texto, frame, segundaEn, ancho, izquierda, centroY, fsMax }) => {
  const { fps } = useVideoConfig();
  const [a, b] = mitadesRemate(texto);
  const largo = Math.max(a.length, b.length);
  const fs = Math.max(fsMax * 0.55, Math.min(fsMax, (ancho * 2.1) / Math.max(1, largo)));
  const velo = interpolate(frame, [0, 14], [0, 0.82], { extrapolateRight: 'clamp' });
  const e1 = spring({ frame, fps, config: { damping: 14, stiffness: 170 } });
  const e2 = spring({ frame: frame - segundaEn, fps, config: { damping: 11, stiffness: 190 } });
  const linea = interpolate(frame, [6, segundaEn], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const estilo: React.CSSProperties = { fontFamily: TIPO.display, fontWeight: TIPO.pesoDisplay, fontSize: fs, lineHeight: 1.05, letterSpacing: -1.2, textAlign: 'center' };
  const w = ancho * 0.5;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: fondoAlfa(velo) }} />
      <div style={{ position: 'absolute', left: izquierda, width: ancho, top: centroY - 500, height: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: fs * 0.35 }}>
        <div style={{ ...estilo, color: PALETA.tinta, transform: `scale(${1.15 - 0.15 * e1})`, opacity: Math.min(1, e1 * 1.5) }}>{a}</div>
        <svg width={w} height={fs * 0.5} viewBox={`0 0 ${w} ${fs * 0.5}`}>
          <path d={`M0 ${fs * 0.1} L${w * 0.3} ${fs * 0.3} L${w * 0.5} ${fs * 0.2} L${w} ${fs * 0.42}`} fill="none" stroke={PALETA.rojo} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} strokeDasharray={`${linea} 1`} />
        </svg>
        {b && <div style={{ ...estilo, color: PALETA.dorado, transform: `scale(${1.25 - 0.25 * e2})`, opacity: frame < segundaEn ? 0 : Math.min(1, e2 * 1.5) }}>{b}</div>}
      </div>
    </>
  );
};
