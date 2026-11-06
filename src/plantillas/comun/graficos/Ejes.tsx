import React from 'react';
import { PALETA, TIPO } from '../../../marca/tokens';

export type MarcaEje = { v: number; pos: number; texto: string };

/**
 * Rejilla y ejes recesivos: líneas horizontales finas en `borde`, etiquetas del eje Y a la izquierda (cifras
 * tabulares), marcas del eje X abajo y la línea base un poco más clara. `aparicion` 0→1 las hace entrar
 * (las líneas se extienden de izquierda a derecha).
 */
export const Ejes: React.FC<{
  x0: number; x1: number; y0: number; y1: number;
  marcasY: MarcaEje[]; marcasX: MarcaEje[]; fontSize: number; aparicion: number; base?: number;
}> = ({ x0, x1, y0, y1, marcasY, marcasX, fontSize, aparicion, base }) => {
  const largo = (x1 - x0) * Math.min(1, aparicion * 1.2);
  const estilo: React.CSSProperties = { fontFamily: TIPO.texto, fontWeight: 500, fontVariantNumeric: 'tabular-nums' };
  return (
    <g opacity={Math.min(1, aparicion * 1.5)}>
      {marcasY.map((m) => (
        <g key={`y${m.v}`}>
          <line x1={x0} x2={x0 + largo} y1={m.pos} y2={m.pos} stroke={PALETA.borde} strokeWidth={1.5} />
          <text x={x0 - 14} y={m.pos + fontSize * 0.35} textAnchor="end" fontSize={fontSize} fill={PALETA.tintaSuave} style={estilo}>{m.texto}</text>
        </g>
      ))}
      {base !== undefined && <line x1={x0} x2={x0 + largo} y1={base} y2={base} stroke="#4A5462" strokeWidth={2.5} />}
      {marcasX.map((m) => (
        <g key={`x${m.v}`}>
          <line x1={m.pos} x2={m.pos} y1={y1} y2={y1 + 8} stroke="#4A5462" strokeWidth={2} />
          <text x={m.pos} y={y1 + 12 + fontSize} textAnchor="middle" fontSize={fontSize} fill={PALETA.tintaSuave} style={estilo}>{m.texto}</text>
        </g>
      ))}
      <line x1={x0} x2={x0} y1={y0} y2={y0} />
    </g>
  );
};
