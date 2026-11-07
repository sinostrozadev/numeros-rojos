import React from 'react';
import type { VisualesResueltos } from '../visual';
import { PanelImagen } from './Foto';

/**
 * Ilustración plana pedida a GPT (props.visuales[clave].ilustracion = ruta en public/ilustraciones/<id>/). Igual que
 * la foto (panel, ken-burns, velo), con el pie "Ilustración" (o el del guion) para que nunca pase por foto real.
 * Si el archivo no está resuelto no dibuja nada (el contenedor cae al gráfico previo).
 */
export const Ilustracion: React.FC<{ visuales?: VisualesResueltos; clave: string; ancho: number; alto: number; frame: number; frames: number; pie?: string; variante?: number }> = ({ visuales, clave, pie, ...r }) => {
  const src = visuales?.[clave]?.ilustracion;
  if (!src) return null;
  return <PanelImagen src={src} pie={!pie ? 'Ilustración' : /ilustr/i.test(pie) ? pie : `${pie} · Ilustración`} encuadre="ken-burns" {...r} />;
};
