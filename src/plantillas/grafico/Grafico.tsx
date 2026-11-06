import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, type CalculateMetadataFunction } from 'remotion';
import { FORMATO_SHORT, PALETA, TIPO, TIPO_GRAFICO } from '../../marca/tokens';
import { cargarFuentes } from '../../marca/fuentes';
import { Cierre } from '../../marca/Cierre';
import { MarcaDeAgua } from '../../marca/MarcaDeAgua';
import type { GuionGrafico } from '../comun/guion';
import type { DatosResueltos } from '../comun/datos';
import { avanceEn, type Tiempos } from '../comun/plan';
import { GraficoAnimado } from '../comun/graficos/GraficoAnimado';
import { FondoRejilla } from '../comun/graficos/Fondo';
import { completarConFixture } from '../comun/graficos/fixture';
import { Subtitulos } from '../comun/Subtitulos';
import { RotuloCaja } from '../comun/Cabecera';
import { Remate } from '../comun/Remate';
import { estimarTiemposGrafico, planGrafico, type PlanGrafico } from './plan';

export type PropsGrafico = GuionGrafico & { datos?: DatosResueltos; tiempos?: Tiempos; duracionFrames?: number; audio?: string };

const W = FORMATO_SHORT.ancho, H = FORMATO_SHORT.alto, S = FORMATO_SHORT.seguro;
const T = TIPO_GRAFICO.short;
/**
 * Disposición 9:16, todo dentro de FORMATO_SHORT.seguro (arriba 220, abajo 340, lados 60; la columna de botones
 * de YouTube queda a la derecha de x≈980 entre y≈1150 y 1600, por eso el gráfico deja 40 px extra a la derecha):
 *   220–262 marca de agua · 280–400 rótulo · 420–1430 gráfico (título + leyenda + cuerpo + fuente) · ~1480 subtítulos.
 */
export const ZONA_GRAFICO = {
  rotulo: { y: 284 },
  grafico: { x: S.lados, y: 420, ancho: W - S.lados * 2 - 40, alto: 1010 },
  subtitulos: { centroY: 1505 },
} as const;

const graficosDe = (g: GuionGrafico) => [g.grafico, ...g.escenas.flatMap((e) => (e.grafico ? [e.grafico] : []))];

export const calcularMetadataGrafico: CalculateMetadataFunction<PropsGrafico> = async ({ props }) => {
  let tiempos = props.tiempos;
  if (!tiempos) {
    try {
      const res = await fetch(staticFile(`voz/${props.id}/tiempos.json`));
      if (!res.ok) throw new Error(String(res.status));
      tiempos = (await res.json()) as Tiempos;
    } catch {
      tiempos = estimarTiemposGrafico(props);
    }
  }
  const datos = props.datos ?? completarConFixture(graficosDe(props).map((x) => x.datos));
  const plan = planGrafico(props, tiempos, datos);
  return { durationInFrames: plan.duracionFrames, props: { ...props, tiempos, datos, duracionFrames: plan.duracionFrames } };
};

export const Grafico: React.FC<PropsGrafico> = (props) => {
  cargarFuentes();
  const frame = useCurrentFrame();
  const fps = FORMATO_SHORT.fps;
  const tiempos = props.tiempos ?? estimarTiemposGrafico(props);
  const datos = props.datos;
  const plan: PlanGrafico = React.useMemo(() => planGrafico(props, tiempos, datos), [props, tiempos, datos]);
  const b = plan.bloques.find((x) => frame >= x.desde && frame < x.hasta) ?? plan.bloques[plan.bloques.length - 1];
  const linea = b.linea !== undefined ? tiempos.lineas[b.linea] : undefined;
  const local = frame - b.desde;
  const principal = b.graficoId === 'principal';
  const progreso = avanceEn(b.claves, frame);
  const enfasis = b.enfasisDesde !== undefined ? interpolate(frame, [b.enfasisDesde, b.enfasisDesde + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const t = frame / fps;
  // Nada estático > 2 s: deriva lenta del gráfico + rejilla de fondo que se mueve.
  const deriva = `translate(${2.5 * Math.sin(t / 2.3)}px, ${2 * Math.cos(t / 3.1)}px) scale(${1 + 0.006 * Math.sin(t / 1.7)})`;
  // Rótulo: el del gancho (entero en el frame 0) hasta que una escena trae el suyo.
  const ultimoRotulo = [...plan.bloques].filter((x) => x.rotulo && frame >= x.rotulo.desde).pop();
  const rotulo = ultimoRotulo?.rotulo ? { texto: ultimoRotulo.rotulo.texto, desde: ultimoRotulo.rotulo.desde, giro: ultimoRotulo.tipoEscena === 'giro' } : { texto: props.gancho.rotulo, desde: 0, giro: false };
  const vis = rotulo.desde === 0 ? 0.88 + 0.12 * spring({ frame, fps, config: { damping: 12, stiffness: 180 } }) : spring({ frame: frame - rotulo.desde, fps, config: { damping: 12, stiffness: 190 } });
  const Z = ZONA_GRAFICO.grafico;
  const enRemate = b.tipo === 'remate' || b.tipo === 'cierre';
  return (
    <AbsoluteFill style={{ background: PALETA.fondo, overflow: 'hidden' }}>
      <FondoRejilla frame={frame} fps={fps} ancho={W} alto={H} paso={72} />
      <div style={{ position: 'absolute', left: Z.x, top: Z.y, width: Z.ancho, height: Z.alto, transform: deriva, transformOrigin: '50% 50%' }}>
        <GraficoAnimado key={b.graficoId} g={b.grafico} datos={datos} ancho={Z.ancho} alto={Z.alto} modo="short" progreso={progreso}
          frame={principal ? frame + fps : frame - b.graficoDesde} fps={fps} enfasis={enfasis} inmediato={principal} enfasisPais={b.enfasisPais}
          anotacionesFrame={b.anotFrames?.map((x) => (x === undefined ? undefined : principal ? x + fps : x - b.graficoDesde))} />
      </div>
      {!enRemate && (
        <div style={{ position: 'absolute', left: S.lados, top: ZONA_GRAFICO.rotulo.y, maxWidth: W - S.lados * 2 }}>
          <RotuloCaja key={rotulo.texto} texto={rotulo.texto} visible={vis} fontSize={Math.min(rotulo.desde === 0 ? 84 : 72, (W - S.lados * 2 - 40) / Math.max(4, rotulo.texto.length * 0.66))} rojo={rotulo.giro} />
        </div>
      )}
      <MarcaDeAgua top={S.arriba - 2} right={S.lados} escala={0.85} />
      {linea && linea.palabras.length > 0 && b.tipo !== 'remate' && (
        <Subtitulos linea={linea} frameLocal={frame - Math.round(linea.inicio * fps)} centroY={ZONA_GRAFICO.subtitulos.centroY} fontSize={T.subtitulos} ancho={W - S.lados * 2}
          acento={enfasis > 0 ? PALETA.rojo : PALETA.dorado} />
      )}
      {b.tipo === 'remate' && <Remate texto={props.remate} frame={local} segundaEn={plan.remateSegundaEn} ancho={W - S.lados * 2} izquierda={S.lados} centroY={900} fsMax={118} />}
      {tiempos.voz !== 'estimada' && tiempos.lineas.filter((l) => l.archivo).map((l) => (
        <Sequence key={l.indice} from={Math.round(l.inicio * fps)} durationInFrames={Math.ceil(l.duracionAudio * fps) + 2} layout="none">
          <Audio src={staticFile(l.archivo)} />
        </Sequence>
      ))}
      {props.audio && <Audio src={staticFile(props.audio)} />}
      <Sequence from={plan.bloques[plan.bloques.length - 1].desde} layout="none">
        <AbsoluteFill><Cierre /></AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
