import React from 'react';
import { PALETA, TIPO } from '../../../marca/tokens';

/** Leyenda en una fila (≥ 2 series): marca de color + nombre en tinta (el texto nunca va en el color de la serie). */
export const Leyenda: React.FC<{ items: { nombre: string; color: string; destacado?: boolean }[]; fontSize: number; aparicion?: number }> = ({ items, fontSize, aparicion = 1 }) => {
  if (items.length < 2) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: `6px ${fontSize * 1.1}px`, opacity: aparicion, fontFamily: TIPO.texto, fontWeight: 600, fontSize, color: PALETA.tintaSuave }}>
      {items.map((it) => (
        <div key={it.nombre} style={{ display: 'flex', alignItems: 'center', gap: fontSize * 0.4, color: it.destacado ? PALETA.tinta : PALETA.tintaSuave }}>
          <span style={{ width: fontSize * 1.1, height: it.destacado ? 7 : 5, borderRadius: 4, background: it.color }} />
          {it.nombre}
        </div>
      ))}
    </div>
  );
};
