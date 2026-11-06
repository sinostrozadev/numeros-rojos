import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, type CalculateMetadataFunction } from 'remotion';
import { FORMATO_LARGO, MARCA, PALETA, TIPO, TIPO_GRAFICO, fondoAlfa } from '../../marca/tokens';
import { cargarFuentes } from '../../marca/fuentes';
import { Cierre } from '../../marca/Cierre';
import { Logo } from '../../marca/Logo';
import { MarcaDeAgua } from '../../marca/MarcaDeAgua';
import type { GuionTesis } from '../comun/guion';
import type { DatosResueltos } from '../comun/datos';
import { avanceEn, type Tiempos } from '../comun/plan';
import { GraficoAnimado } from '../comun/graficos/GraficoAnimado';
import { FondoRejilla } from '../comun/graficos/Fondo';
import { completarConFixture } from '../comun/graficos/fixture';
import { Subtitulos } from '../comun/Subtitulos';
import { Cabecera, RotuloCaja } from '../comun/Cabecera';
import { Remate } from '../comun/Remate';
import { BarraCapitulos, IndiceLista } from '../comun/Indice';
import { estimarTiemposTesis, graficosTesis, planTesis, type BloqueTesis, type PlanTesis, type Vista } from './plan';
import { Cita } from '../comun/Cita';

export { graficosTesis };

export type PropsTesis = GuionTesis & {
  /** Series resueltas por preparar-tesis (clave = claveDeRef). Sin ellas, Studio usa un FIXTURE marcado. */
  datos?: DatosResueltos;
  tiempos?: Tiempos;
  duracionFrames?: number;
  /** Ruta relativa a public/ de la cama + SFX (preparar-tesis la escribe). */
  audio?: string;
};

const W = FORMATO_LARGO.ancho, H = FORMATO_LARGO.alto, S = FORMATO_LARGO.seguro;
const T = TIPO_GRAFICO.largo;
/** Disposición 16:9 (px): cabecera y marca arriba, barra de capítulos, gráfico al centro, subtítulos abajo. */
export const ZONA_TESIS = {
  cabecera: { x: S.lados, y: 52 },
  barra: { y: 100 },
  grafico: { x: S.lados, y: 150, ancho: W - S.lados * 2, alto: 770 },
  subtitulos: { centroY: 985 },
} as const;

/** Miniatura: mismas props, 1 frame. */
export const calcularMetadataMiniatura: CalculateMetadataFunction<PropsTesis> = async ({ props }) => ({
  durationInFrames: 1,
  props: { ...props, datos: props.datos ?? completarConFixture(graficosTesis(props).map((x) => x.datos)) },
});

export const calcularMetadataTesis: CalculateMetadataFunction<PropsTesis> = async ({ props }) => {
  let tiempos = props.tiempos;
  if (!tiempos) {
    try {
      const res = await fetch(staticFile(`voz/${props.id}/tiempos.json`));
      if (!res.ok) throw new Error(String(res.status));
      tiempos = (await res.json()) as Tiempos;
    } catch {
      tiempos = estimarTiemposTesis(props);
    }
  }
  const datos = props.datos ?? completarConFixture(graficosTesis(props).map((x) => x.datos));
  const plan = planTesis(props, tiempos, datos);
  return { durationInFrames: plan.duracionFrames, props: { ...props, tiempos, datos, duracionFrames: plan.duracionFrames } };
};

/**
 * Un gráfico en pantalla con su avance (desde las claves de la voz), su énfasis y un micro-movimiento (deriva y
 * zoom lentos: nada estático > 8 s). `atenuado` = opacidad (0,45 cuando es el gráfico anterior de fondo).
 */
const VistaGrafico: React.FC<{
  v: Vista; frame: number; datos?: DatosResueltos; atenuado?: number; antetitulo?: string;
  enfasisDesde?: number; enfasisPais?: string; zoomDesde?: number; zoomHasta?: number;
}> = ({ v, frame, datos, atenuado = 1, antetitulo, enfasisDesde, enfasisPais, zoomDesde, zoomHasta }) => {
  const local = frame - v.graficoDesde;
  const progreso = avanceEn(v.claves, frame);
  const enfasis = enfasisDesde !== undefined ? interpolate(frame, [enfasisDesde, enfasisDesde + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const t = frame / FORMATO_LARGO.fps;
  const fondo = atenuado < 1;
  const zoom = zoomDesde !== undefined && zoomHasta !== undefined ? interpolate(frame, [zoomDesde, zoomHasta], [0, fondo ? 0.05 : 0.025], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const escala = 1 + 0.008 * Math.sin(t / 5) + zoom;
  const Z = ZONA_TESIS.grafico;
  const anotacionesFrame = v.anotFrames?.map((x) => (x === undefined ? undefined : x - v.graficoDesde));
  return (
    <div style={{ position: 'absolute', left: Z.x, top: Z.y, width: Z.ancho, height: Z.alto, transform: `scale(${escala}) translateX(${3 * Math.sin(t / 7) + (fondo ? -12 * Math.sin(t / 11) : 0)}px)`, transformOrigin: '50% 55%', opacity: atenuado }}>
      <GraficoAnimado g={v.grafico} datos={datos} ancho={Z.ancho} alto={Z.alto} modo="largo" progreso={progreso} frame={local} fps={FORMATO_LARGO.fps} enfasis={enfasis}
        enfasisPais={enfasisPais} anotacionesFrame={anotacionesFrame} antetitulo={antetitulo} />
    </div>
  );
};

const vistaDe = (b: BloqueTesis): Vista | undefined => (b.grafico ? { grafico: b.grafico, graficoId: b.graficoId!, graficoDesde: b.graficoDesde!, claves: b.claves!, anotFrames: b.anotFrames } : undefined);

/** Título del gráfico que viene, como tarjeta, mientras la voz llega a `dice` (sobre el gráfico anterior atenuado). */
const TituloEntrante: React.FC<{ titulo: string; subtitulo?: string; frame: number; hasta: number }> = ({ titulo, subtitulo, frame, hasta }) => {
  const fps = FORMATO_LARGO.fps;
  const e = spring({ frame, fps, config: { damping: 16, stiffness: 150 } });
  const sale = interpolate(frame, [hasta - 2, hasta + Math.round(0.4 * fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: Math.min(1, e * 1.4) * (1 - sale) }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `translateY(${(1 - e) * 30 - sale * 40}px) scale(${1 + 0.015 * (frame / fps)})`, maxWidth: 1500 }}>
        <div style={{ width: 90, height: 8, borderRadius: 4, background: PALETA.dorado }} />
        <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 76, lineHeight: 1.08, color: PALETA.tinta, textAlign: 'center', letterSpacing: -1.5, textShadow: '0 6px 26px rgba(0,0,0,0.75)' }}>{titulo}</div>
        {subtitulo && <div style={{ fontFamily: TIPO.texto, fontWeight: 600, fontSize: 30, color: PALETA.tintaSuave, textAlign: 'center' }}>{subtitulo}</div>}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Gráfico de un bloque (gancho, escena con gráfico, número): si hay espera de `dice`, primero el gráfico anterior
 * atenuado + el título del nuevo; a 0,4 s de la palabra, transición y el nuevo empieza a construirse.
 */
const GraficoConEspera: React.FC<{ b: BloqueTesis; frame: number; datos?: DatosResueltos; antetitulo?: string }> = ({ b, frame, datos, antetitulo }) => {
  const v = vistaDe(b);
  if (!v) return null;
  const fps = FORMATO_LARGO.fps;
  const espera = b.esperaHasta !== undefined && frame < b.esperaHasta + Math.round(0.4 * fps);
  const salidaPrevio = b.esperaHasta !== undefined ? interpolate(frame, [b.esperaHasta, b.esperaHasta + Math.round(0.4 * fps)], [0.45, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const sub = [b.grafico!.datos.etiqueta, b.grafico!.datos.unidad].filter(Boolean).join(' · ');
  return (
    <>
      {espera && b.previo && salidaPrevio > 0 && <VistaGrafico v={b.previo} frame={frame} datos={datos} atenuado={salidaPrevio} zoomDesde={b.desde} zoomHasta={b.esperaHasta} />}
      {espera && <TituloEntrante titulo={b.grafico!.titulo} subtitulo={sub} frame={frame - b.desde} hasta={b.esperaHasta! - b.desde} />}
      {frame >= v.graficoDesde && (
        <VistaGrafico v={v} frame={frame} datos={datos} antetitulo={antetitulo} enfasisDesde={b.enfasisDesde} enfasisPais={b.enfasisPais}
          zoomDesde={b.tipoEscena === 'respiro' ? b.desde : undefined} zoomHasta={b.tipoEscena === 'respiro' ? b.hasta : undefined} />
      )}
    </>
  );
};

/** Tarjeta de capítulo fija (sin gráfico previo): número + título con la rejilla de fondo, mientras habla la voz. */
const CapituloFijo: React.FC<{ n: number; titulo: string; frame: number }> = ({ n, titulo, frame }) => {
  const fps = FORMATO_LARGO.fps;
  const e = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ position: 'absolute', left: 170, top: 300, display: 'flex', alignItems: 'center', gap: 50, opacity: 0.35 + 0.65 * e, transform: `scale(${1 + 0.01 * (frame / fps) / 3})`, transformOrigin: 'left center' }}>
      <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 240, color: PALETA.dorado, lineHeight: 0.9, opacity: 0.9 }}>{String(n).padStart(2, '0')}</div>
      <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 80, color: PALETA.tinta, lineHeight: 1.04, maxWidth: 1150, letterSpacing: -1.5 }}>{titulo}</div>
    </div>
  );
};

/** Tarjeta de título del frame 0: se ve ENTERA desde el primer cuadro (cabecera grande + rótulo del gancho). */
const TarjetaTitulo: React.FC<{ g: GuionTesis; frame: number; frames: number }> = ({ g, frame, frames }) => {
  const s = spring({ frame, fps: FORMATO_LARGO.fps, config: { damping: 14, stiffness: 160 } });
  const salida = interpolate(frame, [frames - 6, frames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: salida }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, transform: `scale(${0.94 + 0.06 * s})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: TIPO.texto, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: PALETA.tintaSuave, textTransform: 'uppercase' }}>
          <Logo tamano={54} />{g.cabecera}
        </div>
        <div style={{ background: PALETA.dorado, color: PALETA.fondo, borderRadius: 26, padding: '18px 54px 10px', fontFamily: TIPO.display, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', boxShadow: '0 24px 70px rgba(0,0,0,0.55)' }}>
          {g.gancho.rotulo}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Tarjeta de capítulo (1 s): número enorme + título; un panel entra de izquierda y se va. */
const TarjetaCapitulo: React.FC<{ n: number; titulo: string; frame: number; frames: number }> = ({ n, titulo, frame, frames }) => {
  const fps = FORMATO_LARGO.fps;
  const e = spring({ frame, fps, config: { damping: 16, stiffness: 200 } });
  const sale = interpolate(frame, [frames - 7, frames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: fondoAlfa(0.92 * (1 - sale)), justifyContent: 'center', paddingLeft: 170 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50, transform: `translateX(${(1 - e) * -120 - sale * 80}px)`, opacity: Math.min(1, e * 1.5) * (1 - sale) }}>
        <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 260, color: PALETA.dorado, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{String(n).padStart(2, '0')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1150 }}>
          <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: PALETA.rojo }}>CAPÍTULO {n}</div>
          <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 86, color: PALETA.tinta, lineHeight: 1.02, letterSpacing: -1.5 }}>{titulo}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Pantalla final (20 s): la próxima pregunta + suscripción a la izquierda, hueco del siguiente video a la derecha, aviso al pie. */
const PantallaFinal: React.FC<{ g: GuionTesis; frame: number }> = ({ g, frame }) => {
  const e = spring({ frame, fps: FORMATO_LARGO.fps, config: { damping: 16, stiffness: 150 } });
  const latido = 1 + 0.02 * Math.sin(frame / 12);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, e * 1.4) }}>
      <div style={{ position: 'absolute', left: S.lados, top: 210, width: 820, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: PALETA.rojo }}>LA PRÓXIMA PREGUNTA</div>
        <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 58, lineHeight: 1.08, color: PALETA.tinta, letterSpacing: -1 }}>{g.siguiente}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 40, transform: `scale(${latido})`, transformOrigin: 'left center' }}>
          <div style={{ width: 170, height: 170, borderRadius: '50%', border: `4px dashed ${PALETA.borde}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo tamano={110} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: PALETA.rojo, color: PALETA.tinta, borderRadius: 14, padding: '10px 26px', fontFamily: TIPO.texto, fontWeight: 800, fontSize: 40 }}>SUSCRÍBETE</div>
            <div style={{ fontFamily: TIPO.texto, fontWeight: 700, fontSize: 30, color: PALETA.tintaSuave }}>{MARCA.handle}</div>
          </div>
        </div>
      </div>
      {/* Hueco del elemento "video siguiente" de la pantalla final de YouTube (lo tapa el elemento). */}
      <div style={{ position: 'absolute', left: 1000, top: 250, width: 840, height: 472, borderRadius: 18, border: `3px dashed ${PALETA.borde}`, background: 'rgba(27,32,39,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TIPO.texto, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: '#5B6573' }}>SIGUIENTE VIDEO</div>
      <div style={{ position: 'absolute', left: S.lados, right: S.lados, bottom: S.abajo - 20, textAlign: 'center', fontFamily: TIPO.texto, fontWeight: 600, fontSize: 24, color: PALETA.tintaSuave }}>{MARCA.aviso}</div>
    </AbsoluteFill>
  );
};

export const Tesis: React.FC<PropsTesis> = (props) => {
  cargarFuentes();
  const frame = useCurrentFrame();
  const fps = FORMATO_LARGO.fps;
  const tiempos = props.tiempos ?? estimarTiemposTesis(props);
  const datos = props.datos;
  const plan: PlanTesis = React.useMemo(() => planTesis(props, tiempos, datos), [props, tiempos, datos]);
  const b = plan.bloques.find((x) => frame >= x.desde && frame < x.hasta) ?? plan.bloques[plan.bloques.length - 1];
  const linea = b.linea !== undefined ? tiempos.lineas[b.linea] : undefined;
  const local = frame - b.desde;
  const conCabecera = b.tipo !== 'titulo' && b.tipo !== 'final' && b.tipo !== 'cierre';
  const enCapitulos = b.capitulo !== null && b.capitulo !== undefined;
  const capActual = enCapitulos ? b.capitulo! : -1;
  const bloquesCap = enCapitulos ? plan.bloques.filter((x) => x.capitulo === capActual) : [];
  const avanceCap = bloquesCap.length ? interpolate(frame, [bloquesCap[0].desde, bloquesCap[bloquesCap.length - 1].hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const cita = !!b.cita;
  const subtitulos = linea && linea.palabras.length && !['remate', 'final', 'titulo'].includes(b.tipo) && !(cita && b.previo);
  const reenganche = b.tipoEscena === 'reenganche';
  const fundido = reenganche ? interpolate(frame, [b.hasta - Math.round(0.7 * fps), b.hasta - 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const giroActivo = b.tipoEscena === 'giro' && b.enfasisDesde !== undefined && frame >= b.enfasisDesde;
  return (
    <AbsoluteFill style={{ background: PALETA.fondo, overflow: 'hidden' }}>
      <FondoRejilla frame={frame} fps={fps} ancho={W} alto={H} />
      {b.tipo === 'titulo' && <TarjetaTitulo g={props} frame={local} frames={b.hasta - b.desde} />}
      {b.tipo === 'gancho' && (b.grafico ? <GraficoConEspera b={b} frame={frame} datos={datos} /> : (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 170, color: PALETA.dorado, textTransform: 'uppercase', letterSpacing: -3, transform: `scale(${1 + local / fps * 0.01})` }}>{props.gancho.rotulo}</div>
        </AbsoluteFill>
      ))}
      {b.tipo === 'promesa' && (
        <div style={{ position: 'absolute', left: 260, top: 210 }}>
          <IndiceLista items={props.indice} frame={frame} desde={plan.indiceDesde} fontSize={62} ancho={1400} />
        </div>
      )}
      {b.tipo === 'capitulo' && b.previo && <VistaGrafico v={b.previo} frame={frame} datos={datos} atenuado={0.3} />}
      {b.tipo === 'capitulo' && <TarjetaCapitulo n={(b.capitulo ?? 0) + 1} titulo={props.capitulos[b.capitulo ?? 0].titulo} frame={local} frames={b.hasta - b.desde} />}
      {b.tipo === 'escena' && !cita && <GraficoConEspera b={b} frame={frame} datos={datos} />}
      {cita && b.previo && (
        <VistaGrafico v={b.previo} frame={frame} datos={datos} atenuado={0.45} zoomDesde={b.desde} zoomHasta={b.hasta} enfasisDesde={b.enfasisDesde} enfasisPais={b.enfasisPais} />
      )}
      {cita && !b.previo && <CapituloFijo n={(b.capitulo ?? 0) + 1} titulo={props.capitulos[b.capitulo ?? 0].titulo} frame={local} />}
      {cita && b.previo && linea && linea.palabras.length > 0 && (
        <Cita linea={linea} frameLocal={frame - Math.round(linea.inicio * fps)} fps={fps} ancho={1560} fontSize={reenganche ? 72 : 66} centroY={560}
          acento={giroActivo ? PALETA.rojo : PALETA.dorado} />
      )}
      {(b.tipo === 'numero' || b.tipo === 'remate') && <GraficoConEspera b={b} frame={frame} datos={datos} antetitulo="El número que nadie mira" />}
      {b.tipo === 'remate' && <Remate texto={props.remate} frame={local} segundaEn={plan.remateSegundaEn} ancho={W - S.lados * 2} izquierda={S.lados} centroY={H / 2} fsMax={112} />}
      {b.tipo === 'final' && <PantallaFinal g={props} frame={local} />}

      {conCabecera && <Cabecera texto={props.cabecera} x={ZONA_TESIS.cabecera.x} y={ZONA_TESIS.cabecera.y} fontSize={24} maxAncho={1100} />}
      {conCabecera && <MarcaDeAgua top={46} right={S.lados} escala={0.85} />}
      {enCapitulos && (
        <div style={{ position: 'absolute', left: S.lados, top: ZONA_TESIS.barra.y }}>
          <BarraCapitulos items={props.indice} actual={capActual} avance={avanceCap} ancho={W - S.lados * 2} fontSize={19} opacidad={b.tipo === 'capitulo' ? 0.4 : 0.95} />
        </div>
      )}
      {b.rotulo && frame >= b.rotulo.desde && (
        <div style={{ position: 'absolute', right: S.lados, top: ZONA_TESIS.grafico.y + 6 }}>
          <RotuloCaja texto={b.rotulo.texto} visible={spring({ frame: frame - b.rotulo.desde, fps, config: { damping: 12, stiffness: 190 } })} fontSize={34} rojo={b.tipoEscena === 'giro'} />
        </div>
      )}
      {subtitulos && linea && (
        <Subtitulos linea={linea} frameLocal={frame - Math.round(linea.inicio * fps)} centroY={ZONA_TESIS.subtitulos.centroY} fontSize={T.subtitulos} ancho={W - 320}
          acento={giroActivo ? PALETA.rojo : PALETA.dorado} />
      )}
      {fundido > 0 && <AbsoluteFill style={{ background: `rgba(5,6,8,${fundido})` }} />}

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
