import React from 'react';
import { spring } from 'remotion';
import type { z } from 'zod';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { VisualIconos as EsquemaIconos } from '../visual';
import { Icono } from './Icono';

export type VisualIconos = z.infer<typeof EsquemaIconos>;

/**
 * Lista de 2–6 conceptos con icono: vertical con 2–4 ítems (icono grande + texto + valor dorado), cuadrícula con
 * 5–6 (3 columnas si el panel es ancho, 2 si es angosto). Cada ítem entra con un resorte en su frame LOCAL
 * (`itemsFrame[k]`, resuelto por el plan desde `dice` o repartido en la escena). `frame` es local (0 = entra el visual).
 */
export const Iconos: React.FC<{ v: VisualIconos; ancho: number; alto: number; frame: number; fps: number; itemsFrame: number[] }> = ({ v, ancho, alto, frame, fps, itemsFrame }) => {
  const n = v.items.length;
  const completo = ancho >= 1200;
  // `completo`: 4–6 ítems en 2 columnas de filas horizontales (tipografía grande); `dividido`: columna (2–4) o cuadrícula de tarjetas (5–6).
  const dosCols = completo && n >= 4;
  const grilla = n >= 5 && !completo;
  const cols = grilla ? 2 : dosCols ? 2 : 1;
  const filas = Math.ceil(n / cols);
  const altoTitulo = v.titulo ? 84 : 0;
  const disponible = alto - altoTitulo;
  const altoFila = Math.min(grilla ? 230 : 170, disponible / filas);
  const icono = Math.round(Math.min(grilla ? 110 : 120, altoFila * (grilla ? 0.48 : 0.72)));
  const fsTexto = completo ? Math.round(Math.min(54, altoFila * (dosCols ? 0.34 : 0.4))) : Math.round(Math.min(grilla ? 40 : 52, altoFila * 0.3));
  const fsValor = completo ? Math.round(fsTexto * 0.82) : Math.round(fsTexto * 1.05);
  const anchoCol = grilla ? ancho / cols : dosCols ? Math.min(ancho / 2, 700) : completo ? Math.min(ancho, 1120) : Math.min(ancho, 1150);
  const anchoBloque = grilla ? ancho : dosCols ? anchoCol * 2 : anchoCol;
  const eTitulo = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ position: 'relative', width: ancho, height: alto, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {v.titulo && (
        <div style={{ height: altoTitulo, display: 'flex', alignItems: 'center', fontFamily: TIPO.display, fontWeight: 800, fontSize: 54, color: PALETA.tinta,
          letterSpacing: -0.5, opacity: Math.min(1, eTitulo * 1.4), transform: `translateY(${(1 - eTitulo) * 16}px)` }}>{v.titulo}</div>
      )}
      <div style={{ flex: 1, width: anchoBloque, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
        {v.items.map((it, k) => {
          const e = spring({ frame: frame - (itemsFrame[k] ?? 0), fps, config: { damping: 14, stiffness: 170 } });
          const visible = Math.min(1, e * 1.4);
          if (frame < (itemsFrame[k] ?? 0)) return <div key={k} style={{ width: grilla || dosCols ? anchoCol : '100%', height: altoFila }} />;
          const contenido = grilla ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <div style={{ width: icono * 1.45, height: icono * 1.45, borderRadius: '50%', background: 'rgba(245,196,81,0.10)', border: `2px solid rgba(245,196,81,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icono nombre={it.icono} tamano={icono} />
              </div>
              <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTexto, color: PALETA.tinta, lineHeight: 1.05, maxWidth: anchoCol - 30 }}>{it.texto}</div>
              {it.valor && <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsValor, color: PALETA.dorado, lineHeight: 1 }}>{it.valor}</div>}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: completo ? 28 : 34, width: '100%', paddingLeft: completo ? 0 : 10 }}>
              <div style={{ flex: 'none', width: icono * 1.4, height: icono * 1.4, borderRadius: '50%', background: 'rgba(245,196,81,0.10)', border: `2px solid rgba(245,196,81,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icono nombre={it.icono} tamano={icono} />
              </div>
              <div style={{ flex: 1, fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTexto, color: PALETA.tinta, lineHeight: 1.05, letterSpacing: -0.5 }}>{it.texto}</div>
              {it.valor && <div style={{ flex: 'none', fontFamily: TIPO.display, fontWeight: 800, fontSize: completo ? fsValor : fsValor * 1.15, color: PALETA.dorado, fontVariantNumeric: 'tabular-nums' }}>{it.valor}</div>}
            </div>
          );
          return (
            <div key={k} style={{ width: grilla || dosCols ? anchoCol : '100%', height: altoFila, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: visible, transform: `translateX(${grilla ? 0 : (1 - e) * -40}px) translateY(${grilla ? (1 - e) * 30 : 0}px) scale(${0.9 + 0.1 * e})` }}>
              {contenido}
            </div>
          );
        })}
      </div>
    </div>
  );
};
