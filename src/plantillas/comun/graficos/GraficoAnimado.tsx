import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO, type ModoGrafico } from '../../../marca/tokens';
import type { DatosResueltos, Grafico } from '../datos';
import { coloresDe, esFixture, paisesDe, serieDe } from './serie';
import { Lineas } from './Lineas';
import { Barras, Ranking } from './Barras';
import { Contador } from './Contador';
import { Comparacion } from './Comparacion';
import { Mapa } from './Mapa';
import { Tarjeta } from './Tarjeta';
import { Leyenda } from './Leyenda';
import { PieFuente } from './PieFuente';
import { clamp01, salida3, type PropsCuerpo } from './tipos';

export type PropsGraficoAnimado = {
  g: Grafico;
  datos?: DatosResueltos;
  ancho: number;
  alto: number;
  modo: ModoGrafico;
  /** Tope de marcas del eje X (ver PropsCuerpo). */
  maxMarcasX?: number;
  progreso: number;
  frame: number;
  fps: number;
  enfasis?: number;
  /** Oculta el título (cuando la plantilla lo pone en otro lugar, p. ej. el gancho del Short). */
  sinTitulo?: boolean;
  /** Etiqueta pequeña sobre el título ("EL NÚMERO QUE NADIE MIRA"). */
  antetitulo?: string;
  /** Sin animación de entrada (el gancho del Short: el título se ve ENTERO en el frame 0). */
  inmediato?: boolean;
  enfasisPais?: string;
  /** Frames LOCALES de las anotaciones con `dice`. */
  anotacionesFrame?: (number | undefined)[];
};

const CUERPOS: Record<Grafico['tipo'], React.FC<PropsCuerpo>> = {
  lineas: Lineas,
  area: (p) => <Lineas {...p} area />,
  barras: Barras,
  ranking: Ranking,
  contador: Contador,
  comparacion: Comparacion,
  mapa: Mapa,
  tarjeta: Tarjeta,
};

/**
 * Contenedor de cualquier gráfico del canal: título (la pregunta o el hallazgo) + subtítulo con el indicador y la
 * unidad + leyenda (≥ 2 series en líneas) + cuerpo + "Fuente: …" abajo, SIEMPRE. Funciona en 16:9 y 9:16
 * (recibe ancho/alto y el modo, que fija la escala tipográfica). Entra con un deslizamiento corto la primera vez.
 */
export const GraficoAnimado: React.FC<PropsGraficoAnimado> = ({ g, datos, ancho, alto, modo, progreso, frame, fps, enfasis = 0, sinTitulo, antetitulo, inmediato, enfasisPais, anotacionesFrame, maxMarcasX }) => {
  const T = TIPO_GRAFICO[modo];
  const serie = serieDe(g, datos);
  const ps = paisesDe(g, serie);
  const entrada = inmediato ? 1 : salida3(frame / (0.45 * fps));
  const subtitulo = [g.datos.etiqueta ?? serie?.etiqueta, g.datos.unidad ?? serie?.unidad].filter(Boolean).join(' · ');
  // Solo líneas: en el ranking cada fila lleva su nombre y la leyenda (hasta 8 países) se encimaba con las barras en la miniatura.
  const conLeyenda = g.tipo === 'lineas' && ps.length >= 2;
  const colores = coloresDe(g, ps);
  // Largo en panel angosto (`dividido`, ≈ 910 px): el título puede ocupar 2 líneas a 0,85× en vez de cortarse con "…".
  const dosLineas = modo === 'largo' && ancho < 1000;
  const fsTitulo = dosLineas ? T.titulo * 0.85 : T.titulo;
  const altoTitulo = sinTitulo ? 0 : T.titulo * (modo === 'short' ? 2.5 : dosLineas ? 0.85 * 1.08 * 2 + 0.25 : 1.25) + (subtitulo ? T.subtitulo * 1.5 : 0) + (antetitulo ? T.subtitulo * 1.6 : 0);
  const altoLeyenda = conLeyenda ? T.subtitulo * 1.9 : 0;
  const altoPie = T.fuente * 3.1;
  const altoCuerpo = Math.max(100, alto - altoTitulo - altoLeyenda - altoPie);
  const fuente = serie?.fuenteTexto ?? g.datos.fuenteTexto ?? 'datos sin resolver';
  const Cuerpo = CUERPOS[g.tipo];
  return (
    <div style={{ width: ancho, height: alto, display: 'flex', flexDirection: 'column', opacity: clamp01(entrada * 1.4), transform: `translateY(${(1 - entrada) * 24}px)` }}>
      {!sinTitulo && (
        <div style={{ height: altoTitulo, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 6 }}>
          {antetitulo && (
            <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: T.subtitulo, letterSpacing: 4, color: PALETA.rojo, textTransform: 'uppercase', marginBottom: 6 }}>{antetitulo}</div>
          )}
          <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTitulo, lineHeight: 1.08, color: PALETA.tinta, letterSpacing: -0.5,
            display: '-webkit-box', WebkitLineClamp: modo === 'short' || dosLineas ? 2 : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.titulo}</div>
          {subtitulo && <div style={{ fontFamily: TIPO.texto, fontWeight: 500, fontSize: T.subtitulo, color: PALETA.tintaSuave, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitulo}</div>}
        </div>
      )}
      {conLeyenda && (
        <div style={{ height: altoLeyenda, display: 'flex', alignItems: 'center' }}>
          <Leyenda fontSize={T.subtitulo * 0.92} aparicion={clamp01(frame / (0.6 * fps))}
            items={ps.map((p) => ({ nombre: p.pais, color: colores[p.iso], destacado: p.iso === g.destacar?.pais }))} />
        </div>
      )}
      <div style={{ height: altoCuerpo, position: 'relative' }}>
        <Cuerpo g={g} serie={serie} ps={ps} ancho={ancho} alto={altoCuerpo} modo={modo} progreso={clamp01(progreso)} frame={frame} fps={fps} enfasis={enfasis} enfasisPais={enfasisPais} anotacionesFrame={anotacionesFrame} maxMarcasX={maxMarcasX} />
      </div>
      <div style={{ height: altoPie, display: 'flex', alignItems: 'flex-end' }}>
        <PieFuente texto={fuente} fontSize={T.fuente} fixture={esFixture(serie)} licencia={serie?.licencia} />
      </div>
    </div>
  );
};
