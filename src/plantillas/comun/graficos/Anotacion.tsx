import React from 'react';
import { PALETA, TIPO } from '../../../marca/tokens';
import { anchoTexto } from './tipos';

/**
 * Anotación con fecha ("1973 · golpe de Estado") sobre un gráfico temporal: guía vertical punteada en el año y
 * una etiqueta arriba que entra cuando la línea (o la voz) llega a ese año. `fila` apila etiquetas cercanas.
 */
export const Anotacion: React.FC<{
  x: number; yTop: number; yBase: number; anio: number; texto: string; fontSize: number; visible: number; fila: number; xMax: number; color?: string;
}> = ({ x, yTop, yBase, anio, texto, fontSize, visible, fila, xMax, color = PALETA.tinta }) => {
  if (visible <= 0) return null;
  const etiqueta = `${anio} · ${texto}`;
  const w = anchoTexto(etiqueta, fontSize, 0.55) + 28;
  const h = fontSize * 1.55;
  const y = yTop + fila * (h + 8);
  const izquierda = x + w > xMax ? x - w : x;
  const lineaY0 = y + h;
  return (
    <g opacity={visible}>
      <line x1={x} x2={x} y1={lineaY0} y2={lineaY0 + (yBase - lineaY0) * visible} stroke={color} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 7" />
      <g transform={`translate(${izquierda}, ${y + (1 - visible) * -10})`}>
        <rect width={w} height={h} rx={h * 0.22} fill="#1B2027" stroke={color} strokeOpacity={0.55} strokeWidth={1.5} />
        <text x={14} y={h * 0.68} fontSize={fontSize} fill={PALETA.tinta} style={{ fontFamily: TIPO.texto, fontWeight: 700 }}>
          <tspan fill={PALETA.dorado}>{anio}</tspan>{` · ${texto}`}
        </text>
      </g>
    </g>
  );
};

/** Asigna filas (0, 1, 2) a anotaciones ordenadas por x para que sus etiquetas no se encimen. */
export const filasAnotaciones = (items: { x: number; w: number }[]): number[] => {
  const finFila: number[] = [];
  return items.map((it) => {
    for (let f = 0; f < 3; f++) {
      if ((finFila[f] ?? -Infinity) < it.x - 6) { finFila[f] = it.x + it.w; return f; }
    }
    return 2;
  });
};
