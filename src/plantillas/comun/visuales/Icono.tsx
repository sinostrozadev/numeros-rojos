import React from 'react';
import { PALETA, TIPO } from '../../../marca/tokens';
import { PICTOGRAMAS, nombrePictograma } from './pictogramas';

/**
 * Icono de los visuales: pictograma propio por nombre ("fabrica", "lingote", "contenedor"…; ver ./pictogramas) o, si
 * no es un nombre conocido, el texto como emoji (Noto Color Emoji, instalada en el sistema). `tamano` en px.
 */
export const Icono: React.FC<{ nombre: string; tamano: number; acento?: string; color?: string; sombra?: boolean }> = ({ nombre, tamano, acento = PALETA.dorado, color = PALETA.tinta, sombra = true }) => {
  const pict = nombrePictograma(nombre);
  if (pict) {
    const Dibujo = PICTOGRAMAS[pict];
    return (
      <svg width={tamano} height={tamano} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block', filter: sombra ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' : undefined }}>
        <Dibujo c={color} a={acento} />
      </svg>
    );
  }
  return (
    <span style={{
      fontFamily: TIPO.emoji, fontSize: tamano * 0.82, lineHeight: `${tamano}px`, width: tamano, height: tamano, display: 'inline-block', textAlign: 'center',
      filter: sombra ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' : undefined,
    }}>{nombre}</span>
  );
};
