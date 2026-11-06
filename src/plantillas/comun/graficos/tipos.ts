import type { Grafico, SerieResuelta } from '../datos';
import type { ModoGrafico } from '../../../marca/tokens';
import type { SeriePais } from './serie';

/** Props comunes del cuerpo de un gráfico (el área de dibujo, sin título ni pie). */
export type PropsCuerpo = {
  g: Grafico;
  serie?: SerieResuelta;
  ps: SeriePais[];
  ancho: number;
  alto: number;
  modo: ModoGrafico;
  /** Avance de construcción 0→1 (lo calcula el contenedor desde la voz: `dice`, años y cifras dichas). */
  progreso: number;
  /** Frames desde que el gráfico apareció (micro-animaciones, entrada de ejes). */
  frame: number;
  fps: number;
  /** Énfasis del giro 0→1: el dato clave se resalta en rojo/dorado. */
  enfasis: number;
  /** Tope de marcas en el eje X (años); si falta, 4 en short y 8 en largo. La miniatura usa 4 en un ancho chico. */
  maxMarcasX?: number;
  /** País que se enciende en el énfasis (escena.enfasis.pais); si falta, el destacado. */
  enfasisPais?: string;
  /** Frame LOCAL (desde que apareció el gráfico) en que entra cada anotación con `dice`; undefined = por año. */
  anotacionesFrame?: (number | undefined)[];
};

/** Ancho aproximado de un texto (Inter 700 ≈ 0,56 em por carácter; Bricolage 800 ≈ 0,6). */
export const anchoTexto = (texto: string, fontSize: number, k = 0.56) => texto.length * fontSize * k;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Suavizado ease-out cúbico. */
export const salida3 = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
