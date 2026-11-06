import React from 'react';
import { Composition } from 'remotion';
import { FORMATO_SHORT } from '../../marca/tokens';
import { Grafico, calcularMetadataGrafico, type PropsGrafico } from './Grafico';
import ejemplo from './ejemplo.json';

export { GuionGrafico } from './guion';
export { planGrafico } from './plan';

/** Registra "Grafico" (Short 1080×1920 a 60 fps). Props reales por --props (salida/trabajo/<id>.props.json). */
export const registrar = (): React.ReactNode => (
  <Composition
    id="Grafico"
    component={Grafico}
    calculateMetadata={calcularMetadataGrafico}
    width={FORMATO_SHORT.ancho}
    height={FORMATO_SHORT.alto}
    fps={FORMATO_SHORT.fps}
    durationInFrames={45 * FORMATO_SHORT.fps}
    defaultProps={ejemplo.props as unknown as PropsGrafico}
  />
);
