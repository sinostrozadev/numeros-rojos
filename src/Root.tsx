import React from 'react';
import { Composition, Folder } from 'remotion';
import { FORMATO_LARGO, FORMATO_SHORT } from './marca/tokens';
import { Cierre } from './marca/Cierre';
// Cada plantilla vive en src/plantillas/<nombre>/ y exporta `registrar()` con sus <Composition>.
import { registrar as tesis } from './plantillas/tesis';
import { registrar as grafico } from './plantillas/grafico';

export const Root: React.FC = () => (
  <>
    <Folder name="Tesis">{tesis()}</Folder>
    <Folder name="Grafico">{grafico()}</Folder>
    <Folder name="Marca">
      <Composition id="CierreLargo" component={Cierre} width={FORMATO_LARGO.ancho} height={FORMATO_LARGO.alto} fps={FORMATO_LARGO.fps} durationInFrames={36} />
      <Composition id="CierreShort" component={Cierre} width={FORMATO_SHORT.ancho} height={FORMATO_SHORT.alto} fps={FORMATO_SHORT.fps} durationInFrames={72} />
    </Folder>
  </>
);
