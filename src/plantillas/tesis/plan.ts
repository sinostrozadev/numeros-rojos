/**
 * Plan temporal del LARGO `tesis` (módulo puro, sin Remotion): lo usan la composición Tesis, preparar-tesis.mts
 * (sonido y duración) y el agente de operación (timestamps de capítulos en la descripción y mid-rolls).
 *
 *   planTesis(guion, tiempos, datos?) → { bloques, capitulos, midrolls, eventos, duracionFrames }
 *   capitulosDescripcion(plan) → "0:00 Introducción\n1:12 Por qué Corea apostó al acero\n…"
 *
 * Estructura: tarjeta de título (0,9 s) → gancho (+ gráfico) → promesa con índice → por capítulo [tarjeta de
 * capítulo 1 s → escenas] → "el número que nadie mira" → remate → siguiente + pantalla final 20 s → cierre 1,2 s.
 * Mid-roll = fin de cada `reenganche` (justo antes de la tarjeta del capítulo siguiente o del número final).
 */
import type { GuionTesis } from '../comun/guion';
import type { DatosResueltos, Grafico } from '../comun/datos';
import { PAUSA, buscarPalabra, type LineaTiempo, depurarEventos, primeraCifra, type Clave, type Evento, type LineaVoz, type Tiempos, estimarTiempos } from '../comun/plan';
import { clavesDeGrafico, frameDice, framesAnotaciones } from '../comun/construccion';
import { mitadesRemate } from '../comun/remate-texto';
import { FORMATO_LARGO, RITMO } from '../../marca/tokens';

export const FPS_TESIS = FORMATO_LARGO.fps;
/** Tarjeta de título en el frame 0 (cabecera + rótulo del gancho). */
export const T_TITULO = 0.9;
/** Tarjeta de capítulo (número + título). */
export const T_CAPITULO = 1.0;
/** Respiro por defecto (gráfico solo, sin voz). */
export const T_RESPIRO = 3.5;
/** Fundido corto tras el reenganche: marca el punto del mid-roll. */
export const T_FUNDIDO_MIDROLL = 0.7;

/** Líneas de voz del largo con sus silencios. MISMO orden que `lineasDeVozTesis` del contrato. */
/**
 * Frame del énfasis del giro: cuando la voz dice el rótulo/la cifra, pero no antes de que el gráfico vaya en un 80 %
 * y nunca después de 1,5 s antes del fin del bloque (que se alcance a ver).
 */
const enfasisGiro = (fPalabra: number, claves: Clave[] | undefined, tope: number) => {
  if (!claves?.length) return Math.min(fPalabra, tope);
  const c0 = claves[0].f, cn = claves[claves.length - 1].f;
  return Math.max(Math.min(Math.max(fPalabra, c0 + 0.8 * (cn - c0)), tope), c0);
};

export const lineasTesis = (g: GuionTesis): LineaVoz[] => [
  { tipo: 'gancho', texto: g.gancho.texto, antes: T_TITULO, despues: 0.5 },
  { tipo: 'promesa', texto: g.promesa, despues: 1.0 },
  ...g.capitulos.flatMap((c) => c.escenas.map((e, k): LineaVoz => ({
    tipo: 'escena',
    texto: e.tipo === 'respiro' ? e.texto : e.texto,
    antes: (k === 0 ? T_CAPITULO + 0.15 : 0) + (e.tipo === 'giro' ? 0.2 : 0),
    despues: e.tipo === 'respiro' ? (e.respiroSeg ?? T_RESPIRO) : e.tipo === 'reenganche' ? 0.5 + T_FUNDIDO_MIDROLL : (e.respiroSeg ?? PAUSA) + (e.tipo === 'giro' ? 0.4 : 0),
  }))),
  { tipo: 'numero', texto: g.numeroQueNadieMira.texto, antes: 0.6, despues: 1.0 },
  { tipo: 'remate', texto: g.remate, antes: 0.3, despues: 0.9 },
  { tipo: 'siguiente', texto: g.siguiente, antes: 0.2, despues: 0 },
];

/** Todos los gráficos del guion (para el fixture de Studio). */
export const graficosTesis = (g: GuionTesis): Grafico[] => [
  ...(g.gancho.grafico ? [g.gancho.grafico] : []),
  ...g.capitulos.flatMap((c) => c.escenas.flatMap((e) => (e.grafico ? [e.grafico] : []))),
  g.numeroQueNadieMira.grafico,
  ...(g.miniatura.grafico ? [g.miniatura.grafico] : []),
];

export const estimarTiemposTesis = (g: GuionTesis) => estimarTiempos(g.id, 'estimada', lineasTesis(g));

export type TipoBloqueTesis = 'titulo' | 'gancho' | 'promesa' | 'capitulo' | 'escena' | 'numero' | 'remate' | 'final' | 'cierre';

export type BloqueTesis = {
  tipo: TipoBloqueTesis;
  /** Frames [desde, hasta). */
  desde: number;
  hasta: number;
  /** Capítulo (0-based) o null fuera de los capítulos. */
  capitulo: number | null;
  /** Índice de la escena dentro del capítulo. */
  escena?: number;
  tipoEscena?: GuionTesis['capitulos'][number]['escenas'][number]['tipo'];
  /** Índice en tiempos.lineas de la voz de este bloque. */
  linea?: number;
  /** Gráfico de este bloque (propio, o el último en un `respiro`), su identidad, frame de aparición y claves. */
  grafico?: Grafico;
  graficoId?: string;
  graficoDesde?: number;
  claves?: Clave[];
  /** Frames ABSOLUTOS de las anotaciones con `dice`. */
  anotFrames?: (number | undefined)[];
  /** Último gráfico mostrado: se ve ATENUADO en la tarjeta de capítulo, en la espera de `dice` y en el modo cita. */
  previo?: Vista;
  /** Antes de este frame el gráfico nuevo aún no se construye: se ve `previo` atenuado + el título del gráfico nuevo. */
  esperaHasta?: number;
  /** Escena sin gráfico propio: la frase grande al centro sobre `previo` atenuado (o la tarjeta del capítulo si no hay). */
  cita?: boolean;
  /** País que se enciende en el énfasis (escena.enfasis.pais). */
  enfasisPais?: string;
  /** Frame desde el que se enciende el énfasis del giro. */
  enfasisDesde?: number;
  rotulo?: { texto: string; desde: number };
  /** true si este bloque termina en un punto de mid-roll. */
  midroll?: boolean;
};

/** Un gráfico tal como se ve: lo que necesita la composición para dibujarlo en cualquier frame. */
export type Vista = { grafico: Grafico; graficoId: string; graficoDesde: number; claves: Clave[]; anotFrames?: (number | undefined)[] };

export type PlanTesis = {
  fps: number;
  duracionFrames: number;
  duracionSeg: number;
  bloques: BloqueTesis[];
  /** Capítulos para la descripción: Introducción (0:00), cada capítulo (desde su tarjeta) y el número final. */
  capitulos: { titulo: string; seg: number; frame: number }[];
  /** Segundos de los puntos de mid-roll (fin de cada reenganche). */
  midrolls: number[];
  /** Eventos de sonido (cama + SFX) en segundos. */
  eventos: Evento[];
  /** Ítems del índice: cuándo aparece cada uno durante la promesa (frame absoluto). */
  indiceDesde: number[];
  /** Frame en que la voz llega a la segunda mitad del remate (relativo al bloque remate). */
  remateSegundaEn: number;
};

export const planTesis = (g: GuionTesis, tiempos: Tiempos, datos?: DatosResueltos, fps = FPS_TESIS): PlanTesis => {
  const f = (s: number) => Math.round(s * fps);
  const L = tiempos.lineas;
  const desdeVisual = (i: number) => f(L[i].inicio - L[i].antes);
  const bloques: BloqueTesis[] = [];
  /**
   * Vista de un gráfico que entra en `desde`: si la voz dice `dice` más tarde, el gráfico aparece 0,4 s antes de
   * esa palabra (hasta ahí se ve el anterior atenuado + el título del nuevo); si no hay `dice`, desde el inicio.
   */
  const vistaNueva = (g: Grafico, id: string, lineas: LineaTiempo[], desde: number): { vista: Vista; esperaHasta?: number } => {
    const claves = clavesDeGrafico(g, lineas, fps, datos);
    const fd = frameDice(g, lineas, fps);
    const espera = fd !== null && fd - desde > f(0.8) ? fd - f(0.4) : undefined;
    return { vista: { grafico: g, graficoId: id, graficoDesde: espera ?? desde, claves, anotFrames: framesAnotaciones(g, lineas, fps) }, esperaHasta: espera };
  };
  let ultimo: Vista | undefined;
  const eventos: Evento[] = [{ t: 0, tipo: 'golpe', fuerza: 0.9 }];

  // Título + gancho
  const fTitulo = f(T_TITULO);
  bloques.push({ tipo: 'titulo', desde: 0, hasta: fTitulo, capitulo: null });
  const ganchoGraf = g.gancho.grafico;
  if (ganchoGraf) {
    const { vista, esperaHasta } = vistaNueva(ganchoGraf, 'gancho', [L[0]], fTitulo);
    bloques.push({ tipo: 'gancho', desde: fTitulo, hasta: desdeVisual(1), capitulo: null, linea: 0, ...vista, esperaHasta });
    ultimo = vista;
  } else bloques.push({ tipo: 'gancho', desde: fTitulo, hasta: desdeVisual(1), capitulo: null, linea: 0 });
  eventos.push({ t: T_TITULO - 0.1, tipo: 'whoosh', fuerza: 0.8 });

  // Promesa + índice
  const lp = L[1];
  const n = g.indice.length;
  const indiceDesde = g.indice.map((_, k) => f(lp.inicio + (lp.duracionHablada * 0.85 * k) / n + 0.2));
  bloques.push({ tipo: 'promesa', desde: desdeVisual(1), hasta: desdeVisual(2), capitulo: null, linea: 1 });
  indiceDesde.forEach((fr) => eventos.push({ t: fr / fps, tipo: 'pop', fuerza: 0.55 }));

  // Capítulos
  const capitulos: PlanTesis['capitulos'] = [{ titulo: 'Introducción', seg: 0, frame: 0 }];
  const midrolls: number[] = [];
  let li = 2;
  g.capitulos.forEach((cap, ci) => {
    const primera = li;
    const inicioCap = desdeVisual(primera);
    capitulos.push({ titulo: cap.titulo, seg: inicioCap / fps, frame: inicioCap });
    bloques.push({ tipo: 'capitulo', desde: inicioCap, hasta: inicioCap + f(T_CAPITULO), capitulo: ci, previo: ultimo });
    eventos.push({ t: inicioCap / fps, tipo: 'whoosh', fuerza: 1 });
    cap.escenas.forEach((e, k) => {
      const i = primera + k;
      const desde = k === 0 ? inicioCap + f(T_CAPITULO) : desdeVisual(i);
      const hasta = desdeVisual(i + 1);
      const linea = L[i];
      const b: BloqueTesis = { tipo: 'escena', desde, hasta, capitulo: ci, escena: k, tipoEscena: e.tipo, linea: i, enfasisPais: e.enfasis?.pais };
      if (e.grafico) {
        const { vista, esperaHasta } = vistaNueva(e.grafico, `c${ci}e${k}`, [linea], desde);
        Object.assign(b, vista, { esperaHasta, previo: esperaHasta !== undefined ? ultimo : undefined });
        ultimo = vista;
        const c0 = vista.claves[0], cn = vista.claves[vista.claves.length - 1];
        if (esperaHasta !== undefined) eventos.push({ t: esperaHasta / fps, tipo: 'whoosh', fuerza: 0.5 });
        eventos.push({ t: c0.f / fps, tipo: 'tic', fuerza: 0.7 });
        if (['lineas', 'area', 'barras', 'ranking'].includes(e.grafico.tipo)) eventos.push({ t: c0.f / fps, tipo: 'trazo', fuerza: 0.6, dur: (cn.f - c0.f) / fps });
      } else if (e.tipo === 'respiro' && ultimo) {
        Object.assign(b, ultimo);
      } else {
        b.cita = true;
        b.previo = ultimo;
      }
      if (e.rotulo) {
        const pi = e.rotulo.dice ? buscarPalabra(linea.palabras, e.rotulo.dice) : -1;
        b.rotulo = { texto: e.rotulo.texto, desde: pi >= 0 ? f(linea.inicio + linea.palabras[pi].inicio - 0.05) : desde + f(0.3) };
        eventos.push({ t: b.rotulo.desde / fps, tipo: 'pop', fuerza: 0.5 });
      }
      if (e.tipo === 'giro') {
        const pi = e.rotulo?.dice ? buscarPalabra(linea.palabras, e.rotulo.dice) : primeraCifra(linea.palabras);
        const t = pi >= 0 ? linea.inicio + linea.palabras[pi].inicio : linea.inicio + linea.duracionHablada * 0.4;
        b.enfasisDesde = enfasisGiro(f(t), e.grafico ? b.claves : undefined, hasta - f(1.5));
        eventos.push({ t: b.enfasisDesde / fps, tipo: 'golpe', fuerza: 0.75 });
      }
      if (e.tipo === 'reenganche') {
        b.midroll = true;
        midrolls.push(hasta / fps);
        eventos.push({ t: (hasta - f(T_FUNDIDO_MIDROLL)) / fps, tipo: 'whoosh', fuerza: 0.6 });
      }
      bloques.push(b);
    });
    li += cap.escenas.length;
  });

  // Número que nadie mira
  const iNum = li;
  const nq = g.numeroQueNadieMira;
  const num = vistaNueva(nq.grafico, 'numero', [L[iNum]], desdeVisual(iNum));
  const clavesNum = num.vista.claves;
  capitulos.push({ titulo: 'El número que nadie mira', seg: desdeVisual(iNum) / fps, frame: desdeVisual(iNum) });
  bloques.push({ tipo: 'numero', desde: desdeVisual(iNum), hasta: desdeVisual(iNum + 1), capitulo: null, linea: iNum, ...num.vista, esperaHasta: num.esperaHasta, previo: num.esperaHasta !== undefined ? ultimo : undefined });
  eventos.push({ t: Math.max(0, L[iNum].inicio - 0.9), tipo: 'riser', fuerza: 0.8 });
  eventos.push({ t: clavesNum[0].f / fps, tipo: 'golpe', fuerza: 0.7 });

  // Remate
  const iRem = iNum + 1;
  const lr = L[iRem];
  const [primeraMitad] = mitadesRemate(g.remate);
  const nPrimera = primeraMitad.split(/\s+/).filter(Boolean).length;
  const remateSegundaEn = lr.palabras[nPrimera] ? f(lr.antes + lr.palabras[nPrimera].inicio) : f(lr.antes + lr.duracionHablada * 0.5);
  bloques.push({ tipo: 'remate', desde: desdeVisual(iRem), hasta: desdeVisual(iRem + 1), capitulo: null, linea: iRem, ...num.vista });
  eventos.push({ t: Math.max(0, lr.inicio - 0.9), tipo: 'riser', fuerza: 1 });
  eventos.push({ t: lr.inicio, tipo: 'golpe', fuerza: 1 });
  eventos.push({ t: (desdeVisual(iRem) + remateSegundaEn) / fps, tipo: 'pop', fuerza: 0.7 });

  // Siguiente + pantalla final (la pregunta se dice sobre la pantalla final) + cierre
  const iSig = iRem + 1;
  const ls = L[iSig];
  const finalDesde = desdeVisual(iSig);
  const finalHasta = finalDesde + f(Math.max(RITMO.pantallaFinal, ls.antes + ls.duracionHablada + 1.5));
  bloques.push({ tipo: 'final', desde: finalDesde, hasta: finalHasta, capitulo: null, linea: iSig });
  eventos.push({ t: finalDesde / fps, tipo: 'whoosh', fuerza: 0.7 });
  const cierreHasta = finalHasta + f(RITMO.cierre);
  bloques.push({ tipo: 'cierre', desde: finalHasta, hasta: cierreHasta, capitulo: null });
  eventos.push({ t: finalHasta / fps, tipo: 'cierre', fuerza: 1 });

  return {
    fps, duracionFrames: cierreHasta, duracionSeg: cierreHasta / fps, bloques, capitulos, midrolls,
    eventos: depurarEventos(eventos), indiceDesde, remateSegundaEn,
  };
};

/** "m:ss" de un segundo. */
export const reloj = (seg: number) => `${Math.floor(seg / 60)}:${String(Math.floor(seg % 60)).padStart(2, '0')}`;

/** Timestamps de capítulos para la descripción de YouTube (el primero en 0:00, todos ≥ 10 s). */
export const capitulosDescripcion = (plan: PlanTesis) => plan.capitulos.map((c) => `${reloj(c.seg)} ${c.titulo}`).join('\n');

/** Bloque vigente en un frame. */
export const bloqueEn = (plan: PlanTesis, frame: number) => plan.bloques.find((b) => frame >= b.desde && frame < b.hasta) ?? plan.bloques[plan.bloques.length - 1];
