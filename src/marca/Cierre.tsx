import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { MARCA, PALETA, TIPO, fondoAlfa } from './tokens';
import { cargarFuentes } from './fuentes';
import { Logo } from './Logo';

/**
 * Cierre de marca (1,2 s): velo grafito sobre la última imagen, el isotipo que se dibuja (sube en verde, cae en
 * rojo), el nombre y el lema. Funciona en 16:9 y 9:16 (se adapta al ancho del video).
 */
export const Cierre: React.FC = () => {
  cargarFuentes();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const k = vertical ? width / 1080 : height / 1080;
  const velo = interpolate(frame, [0, 0.25 * fps], [0.5, 0.96], { extrapolateRight: 'clamp' });
  const avance = interpolate(frame, [0.05 * fps, 0.75 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const entrada = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const lema = interpolate(frame, [0.45 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: fondoAlfa(velo), justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: 36 * k, transform: `scale(${0.9 + 0.1 * entrada})`, opacity: Math.min(1, 0.2 + entrada) }}>
        <Logo tamano={(vertical ? 220 : 200) * k} avance={avance} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: vertical ? 'center' : 'flex-start', gap: 10 * k }}>
          <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 104 * k, color: PALETA.tinta, letterSpacing: -2 * k, lineHeight: 1 }}>
            En Números <span style={{ color: PALETA.rojo }}>Rojos</span>
          </div>
          <div style={{ fontFamily: TIPO.texto, fontWeight: 600, fontSize: 38 * k, color: PALETA.tintaSuave, opacity: lema }}>{MARCA.lema}</div>
          <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: 34 * k, color: PALETA.dorado, opacity: lema }}>{MARCA.handle}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
