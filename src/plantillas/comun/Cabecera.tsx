import React from 'react';
import { PALETA, TIPO } from '../../marca/tokens';

/** Cabecera fija arriba a la izquierda: punto rojo + título corto en mayúsculas con tracking. */
export const Cabecera: React.FC<{ texto: string; x: number; y: number; fontSize: number; maxAncho: number; opacidad?: number }> = ({ texto, x, y, fontSize, maxAncho, opacidad = 1 }) => (
  <div style={{
    position: 'absolute', top: y, left: x, maxWidth: maxAncho, display: 'flex', alignItems: 'center', gap: fontSize * 0.5, opacity: opacidad,
    fontFamily: TIPO.texto, fontWeight: 700, fontSize, letterSpacing: fontSize * 0.12, color: PALETA.tinta, textTransform: 'uppercase',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  }}>
    <span style={{ width: fontSize * 0.55, height: fontSize * 0.55, borderRadius: '50%', background: PALETA.rojo, flex: 'none' }} />
    {texto}
  </div>
);

/** Caja de acento con un rótulo corto (1–4 palabras) de la escena: dorado, o rojo en el giro. */
export const RotuloCaja: React.FC<{ texto: string; visible: number; fontSize: number; rojo?: boolean }> = ({ texto, visible, fontSize, rojo }) => (
  <div style={{
    display: 'inline-block', background: rojo ? PALETA.rojo : PALETA.dorado, color: rojo ? PALETA.tinta : PALETA.fondo, borderRadius: fontSize * 0.2,
    padding: `${fontSize * 0.14}px ${fontSize * 0.4}px`, fontFamily: TIPO.texto, fontWeight: 800, fontSize, letterSpacing: 1, textTransform: 'uppercase',
    transform: `scale(${0.85 + 0.15 * visible}) rotate(${rojo ? -1.5 : 0}deg)`, opacity: Math.min(1, visible * 1.5), boxShadow: '0 8px 24px rgba(0,0,0,0.45)', whiteSpace: 'nowrap',
  }}>{texto}</div>
);
