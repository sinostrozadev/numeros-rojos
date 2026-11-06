import React from 'react';
import { Composition } from 'remotion';
import { FORMATO_LARGO } from '../../marca/tokens';
import { Tesis, calcularMetadataMiniatura, calcularMetadataTesis, type PropsTesis } from './Tesis';
import { Miniatura } from './Miniatura';
import ejemplo from './ejemplo.json';

export { GuionTesis } from './guion';
export { planTesis, capitulosDescripcion } from './plan';

/**
 * Registra "Tesis" (largo 1920×1080 a 30 fps) y "Miniatura" (1280×720). Las props reales llegan por --props desde
 * salida/trabajo/<id>.props.json (guion + datos + tiempos + audio); las de por defecto son el ejemplo, con
 * tiempos estimados y datos FIXTURE marcados en rojo (solo para Studio).
 */
export const registrar = (): React.ReactNode => (
  <>
    <Composition
      id="Tesis"
      component={Tesis}
      calculateMetadata={calcularMetadataTesis}
      width={FORMATO_LARGO.ancho}
      height={FORMATO_LARGO.alto}
      fps={FORMATO_LARGO.fps}
      durationInFrames={600 * FORMATO_LARGO.fps}
      defaultProps={ejemplo.props as unknown as PropsTesis}
    />
    <Composition
      id="Miniatura"
      component={Miniatura}
      calculateMetadata={calcularMetadataMiniatura}
      width={1280}
      height={720}
      fps={FORMATO_LARGO.fps}
      durationInFrames={1}
      defaultProps={ejemplo.props as unknown as PropsTesis}
    />
  </>
);
