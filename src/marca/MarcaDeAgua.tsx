import React from 'react';
import { MARCA, PALETA, TIPO } from './tokens';
import { Logo } from './Logo';

/** Marca de agua discreta (isotipo + nombre) arriba a la derecha, dentro de la zona segura que se le pase. */
export const MarcaDeAgua: React.FC<{ top: number; right: number; escala?: number }> = ({ top, right, escala = 1 }) => (
  <div style={{
    position: 'absolute', top, right, display: 'flex', alignItems: 'center', gap: 10 * escala, opacity: MARCA.marcaDeAgua.opacidad, pointerEvents: 'none',
    fontFamily: TIPO.display, fontWeight: TIPO.pesoDisplay, fontSize: MARCA.marcaDeAgua.tamano * escala, color: PALETA.tinta,
  }}>
    <Logo tamano={40 * escala} />
    {MARCA.nombre}
  </div>
);
