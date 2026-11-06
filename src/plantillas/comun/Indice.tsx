import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { PALETA, TIPO } from '../../marca/tokens';
import { Pictograma, pictogramaPara } from './pictogramas';

/**
 * Índice de capítulos de la promesa: lista con pictograma (o número) por parada, que entra ítem a ítem.
 * `desde[k]` = frame (relativo al índice) en que entra el ítem k.
 */
export const IndiceLista: React.FC<{ items: string[]; frame: number; desde: number[]; fontSize: number; ancho: number }> = ({ items, frame, desde, fontSize, ancho }) => {
  const { fps } = useVideoConfig();
  const lado = fontSize * 1.9;
  return (
    <div style={{ width: ancho, display: 'flex', flexDirection: 'column', gap: fontSize * 0.55 }}>
      <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: fontSize * 0.5, letterSpacing: fontSize * 0.12, color: PALETA.rojo }}>EN ESTE VIDEO</div>
      {items.map((it, k) => {
        const e = spring({ frame: frame - desde[k], fps, config: { damping: 15, stiffness: 170 } });
        const pic = pictogramaPara(it);
        return (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: fontSize * 0.6, opacity: frame < desde[k] ? 0.12 : Math.min(1, 0.12 + e), transform: `translateX(${(1 - e) * -40}px)` }}>
            <div style={{ width: lado, height: lado, borderRadius: lado * 0.24, background: PALETA.fondo2, border: `2px solid ${PALETA.borde}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              {pic ? <Pictograma nombre={pic} tamano={lado * 0.66} color={PALETA.tinta} acento={PALETA.dorado} />
                : <span style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fontSize * 0.9, color: PALETA.dorado }}>{k + 1}</span>}
            </div>
            <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize, color: PALETA.tinta }}>
              <span style={{ color: PALETA.tintaSuave, fontVariantNumeric: 'tabular-nums' }}>{String(k + 1).padStart(2, '0')} </span>{it}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Barra de progreso de capítulos (arriba, todo el video desde la promesa): un segmento por capítulo con su título
 * corto; el actual se llena en dorado según avanza, los pasados quedan en blanco tenue.
 */
export const BarraCapitulos: React.FC<{ items: string[]; actual: number; avance: number; ancho: number; fontSize: number; opacidad?: number }> = ({ items, actual, avance, ancho, fontSize, opacidad = 1 }) => {
  const gap = 10;
  const w = (ancho - gap * (items.length - 1)) / items.length;
  return (
    <div style={{ width: ancho, display: 'flex', gap, opacity: opacidad }}>
      {items.map((it, k) => {
        const lleno = k < actual ? 1 : k === actual ? avance : 0;
        const pic = pictogramaPara(it);
        return (
          <div key={k} style={{ width: w, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 6, borderRadius: 3, background: PALETA.borde, overflow: 'hidden' }}>
              <div style={{ width: `${lleno * 100}%`, height: '100%', background: k === actual ? PALETA.dorado : '#6B7684' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: TIPO.texto, fontWeight: 700, fontSize, color: k === actual ? PALETA.tinta : PALETA.tintaSuave, opacity: k === actual ? 1 : 0.6, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {pic && <Pictograma nombre={pic} tamano={fontSize * 1.2} color={k === actual ? PALETA.tinta : PALETA.tintaSuave} acento={k === actual ? PALETA.dorado : PALETA.tintaSuave} />}
              {it}
            </div>
          </div>
        );
      })}
    </div>
  );
};
