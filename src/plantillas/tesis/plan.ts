/**
 * Plan temporal del LARGO `tesis` (módulo puro, sin Remotion): lo usan la composición Tesis, preparar-tesis.mts
 * (sonido y duración) y el agente de operación (timestamps de capítulos en la descripción y mid-rolls).
 *
 *   planTesis(guion, tiempos, datos?) → { bloques, capitulos, midrolls, eventos, duracionFrames }
 *   capitulosDescripcion(plan) → "0:00 Introducción\n1:12 Por qué Corea apostó al acero\n…"
 *
 * Estructura: tarjeta de título (≥ 2,5 s) → gancho (+ gráfico) → promesa con índice → por capítulo [tarjeta de
 * capítulo ≥ 2,5 s → escenas (la 1.ª con el rótulo del capítulo 3 s más)] → "el número que nadie mira" → remate (+2 s y
 * fundido a negro) → siguiente + pantalla final 20 s → cierre 1,2 s.
 *
 * v3 (2026-11-07, correcciones de ritmo de Santiago al ver Chile-Corea v2): tarjetas legibles (`tiempoLectura`), sin
 * destellos (la tarjeta de espera de un gráfico solo existe si la espera es ≥ 1,5 s), sellos, `versus`, mapa con `viaje`,
 * cierre con fundido, y `problemasDeRitmo(plan, guion)`: el validador que rechaza esperas largas, fotos eternas, citas
 * eternas y gráficos congelados antes de renderizar.
 * Mid-roll = fin de cada `reenganche` (justo antes de la tarjeta del capítulo siguiente o del número final).
 *
 * Visuales v2 (2026-11-07): cada escena puede traer `visual` (foto/mapa/iconos/ilustración), `disposicion` y
 * `mascota`. El plan resuelve sus frames (`dice` contra las palabras de la voz) y qué fondo queda detrás de una
 * cita o una espera (el último gráfico o el último visual). Una foto/ilustración sin resolver en `g.visuales`
 * cuenta como si no existiera: la escena cae al comportamiento v1 (nunca un frame vacío).
 */
import type { GuionTesis } from '../comun/guion';
import type { DatosResueltos, Grafico } from '../comun/datos';
import { PAUSA, buscarPalabra, type LineaTiempo, depurarEventos, primeraCifra, type Clave, type Evento, type LineaVoz, type Tiempos, estimarTiempos } from '../comun/plan';
import { clavesDeGrafico, frameDice, framesAnotaciones } from '../comun/construccion';
import { mitadesRemate } from '../comun/remate-texto';
import { FORMATO_LARGO, RITMO } from '../../marca/tokens';
import { claveDeVisual, type Mascota, type Sello, type Visual, type VisualesResueltos } from '../comun/visual';

export const FPS_TESIS = FORMATO_LARGO.fps;
/** Tarjeta de título en el frame 0 (cabecera + rótulo del gancho): mínimo; crece con `tiempoLectura` del rótulo. */
export const T_TITULO = 2.5;
/** Tarjeta de capítulo (número + título), en silencio: mínimo; crece con `tiempoLectura` del título. */
export const T_CAPITULO = 2.5;
/** El título del capítulo se queda como rótulo pequeño este tiempo al empezar su primera escena (la voz ya habla). */
export const T_ROTULO_CAPITULO = 3.0;
/** Una tarjeta de espera (gráfico anterior apagado + título del nuevo) solo existe si la espera dura al menos esto. */
export const T_ESPERA_MIN = 1.5;
/** Segundos de silencio tras el remate (antes 0,9): el final se nota; los últimos 0,7 s son fundido a negro. */
export const T_DESPUES_REMATE = 2.9;
export const T_FUNDIDO_REMATE = 0.7;
/** Fundido desde negro al entrar la pantalla final. */
export const T_FUNDIDO_FINAL = 0.4;

/**
 * REGLA GENERAL de lectura: todo texto GRANDE que entra en tarjeta (título, capítulo, título de gráfico entrante) dura al
 * menos 1 s + 0,3 s por palabra y nunca menos de 2,5 s.
 */
export const tiempoLectura = (texto: string) => Math.max(2.5, 1 + 0.3 * texto.split(/\s+/).filter(Boolean).length);
/** Duración de la tarjeta de título del guion. */
export const tTitulo = (g: Pick<GuionTesis, 'gancho'>) => Math.max(T_TITULO, tiempoLectura(g.gancho.rotulo));
/** Duración de la tarjeta de un capítulo (el número no cuenta como palabra). */
export const tCapitulo = (titulo: string) => Math.max(T_CAPITULO, tiempoLectura(titulo));
/** Texto del rótulo del capítulo: "01 · 1960: Chile iba adelante". */
export const textoRotuloCapitulo = (ci: number, titulo: string) => `${String(ci + 1).padStart(2, '0')} · ${titulo}`;
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
  { tipo: 'gancho', texto: g.gancho.texto, antes: tTitulo(g), despues: 0.5 },
  { tipo: 'promesa', texto: g.promesa, despues: 1.0 },
  ...g.capitulos.flatMap((c) => c.escenas.map((e, k): LineaVoz => ({
    tipo: 'escena',
    texto: e.texto,
    antes: (k === 0 ? tCapitulo(c.titulo) + 0.15 : 0) + (e.tipo === 'giro' ? 0.2 : 0),
    despues: e.tipo === 'respiro' ? (e.respiroSeg ?? T_RESPIRO) : e.tipo === 'reenganche' ? 0.5 + T_FUNDIDO_MIDROLL : (e.respiroSeg ?? PAUSA) + (e.tipo === 'giro' ? 0.4 : 0),
  }))),
  { tipo: 'numero', texto: g.numeroQueNadieMira.texto, antes: 0.6, despues: 1.0 },
  { tipo: 'remate', texto: g.remate, antes: 0.3, despues: T_DESPUES_REMATE },
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
  /** v3: primera escena del capítulo: el título del capítulo como rótulo pequeño [desde, hasta) (se desvanece). */
  rotuloCapitulo?: { texto: string; desde: number; hasta: number };
  /**
   * v3: sellos de la escena, uno a la vez: cada uno vive [desde, hasta) (hasta el siguiente o el fin del bloque).
   * `sinPalabra` = la voz no dice `s.dice`: se estampa al 40 % de la escena y `problemasDeRitmo` avisa.
   */
  sellos?: { s: Sello; desde: number; hasta: number; sinPalabra?: boolean }[];
  /** true si este bloque termina en un punto de mid-roll. */
  midroll?: boolean;
  /** Visual propio de la escena (v2) con sus frames. */
  visual?: VistaVisual;
  /** Cómo conviven visual y gráfico: `dividido` (visual izq. + gráfico der.) o `completo` (uno a la vez). */
  disposicion?: 'completo' | 'dividido';
  /** `completo` con visual Y gráfico: frame en que el gráfico reemplaza al visual. */
  cambioAGrafico?: number;
  /** Lo último mostrado fue un visual (no un gráfico): se ve atenuado en citas, esperas, respiros y tarjetas de capítulo. */
  previoVisual?: VistaVisual;
  /** Mascota de la escena y el frame en que entra. */
  mascota?: { m: Mascota; desde: number };
};

/** Un visual tal como se ve: tipo, clave en props.visuales y frames ABSOLUTOS [desde, hasta) (+ entrada de cada ítem en `iconos`). */
export type VistaVisual = {
  v: Visual; clave: string; desde: number; hasta: number;
  /** `iconos`: frame de cada ítem; `versus`: lista PLANA (lado 0 y luego lado 1) con el frame de cada ítem. */
  itemsFrame?: number[];
  /** `versus`: frame en que la ficha de apuesta se desliza (la voz dice `apuesta.dice`). */
  apuestaFrame?: number;
  /** `mapa` con `viaje`: frame en que la cámara empieza a volar (la voz dice `viaje.dice`, o al entrar el mapa). */
  viajeDesde?: number;
};

/** ¿El visual se puede dibujar? Fotos e ilustraciones solo si preparar-tesis las resolvió; mapas, iconos y versus siempre. */
export const visualDisponible = (v: Visual, clave: string, visuales?: VisualesResueltos) =>
  v.tipo === 'foto' ? !!visuales?.[clave]?.foto : v.tipo === 'ilustracion' ? !!visuales?.[clave]?.ilustracion : true;

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
  /** Frame ABSOLUTO en que empieza el fundido a negro del final del remate (T_FUNDIDO_REMATE). */
  remateFundidoDesde: number;
};

export const planTesis = (g: GuionTesis & { visuales?: VisualesResueltos }, tiempos: Tiempos, datos?: DatosResueltos, fps = FPS_TESIS): PlanTesis => {
  const f = (s: number) => Math.round(s * fps);
  /** Frame absoluto en que la voz dice `dice` en la línea (0,1 s antes), o null. */
  const frameDePalabra = (linea: LineaTiempo, dice?: string) => {
    if (!dice) return null;
    const pi = buscarPalabra(linea.palabras, dice);
    return pi >= 0 ? f(linea.inicio + linea.palabras[pi].inicio - 0.1) : null;
  };
  const L = tiempos.lineas;
  const desdeVisual = (i: number) => f(L[i].inicio - L[i].antes);
  const bloques: BloqueTesis[] = [];
  /**
   * Vista de un gráfico que entra en `desde`: si la voz dice `dice` lo bastante tarde (≥ T_ESPERA_MIN, y si la tarjeta se
   * ve, ≥ `tiempoLectura(titulo)`), el gráfico aparece 0,4 s antes de esa palabra (hasta ahí se ve el anterior atenuado +
   * el título del nuevo); si la espera es menor (o no hay `dice`) el gráfico entra en `desde` SIN tarjeta: nunca un
   * destello. Su construcción la mandan las claves.
   */
  const vistaNueva = (g: Grafico, id: string, lineas: LineaTiempo[], desde: number, tarjetaVisible = true): { vista: Vista; esperaHasta?: number } => {
    const claves = clavesDeGrafico(g, lineas, fps, datos);
    const fd = frameDice(g, lineas, fps);
    // Si la tarjeta se va a ver (no la tapa un visual), además tiene que alcanzar a leerse: una tarjeta de 1,5 s con un
    // título de 3 s es el mismo destello que se quiere evitar → entonces el gráfico entra en `desde` sin tarjeta.
    const minEspera = tarjetaVisible ? Math.max(T_ESPERA_MIN, tiempoLectura(g.titulo)) : T_ESPERA_MIN;
    const espera = fd !== null && fd - desde >= f(minEspera) ? fd - f(0.4) : undefined;
    return { vista: { grafico: g, graficoId: id, graficoDesde: espera ?? desde, claves, anotFrames: framesAnotaciones(g, lineas, fps) }, esperaHasta: espera };
  };
  let ultimo: Vista | undefined;
  /** Último visual mostrado y si lo último en pantalla fue un visual (true) o un gráfico (false). */
  let ultimoVisual: VistaVisual | undefined;
  let ultimoFueVisual = false;
  const eventos: Evento[] = [{ t: 0, tipo: 'golpe', fuerza: 0.9 }];

  // Título + gancho
  const fTitulo = f(tTitulo(g));
  bloques.push({ tipo: 'titulo', desde: 0, hasta: fTitulo, capitulo: null });
  const ganchoGraf = g.gancho.grafico;
  if (ganchoGraf) {
    const { vista, esperaHasta } = vistaNueva(ganchoGraf, 'gancho', [L[0]], fTitulo);
    bloques.push({ tipo: 'gancho', desde: fTitulo, hasta: desdeVisual(1), capitulo: null, linea: 0, ...vista, esperaHasta });
    ultimo = vista;
  } else bloques.push({ tipo: 'gancho', desde: fTitulo, hasta: desdeVisual(1), capitulo: null, linea: 0 });
  eventos.push({ t: fTitulo / fps - 0.1, tipo: 'whoosh', fuerza: 0.8 });

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
    const fCap = f(tCapitulo(cap.titulo));
    bloques.push({ tipo: 'capitulo', desde: inicioCap, hasta: inicioCap + fCap, capitulo: ci, previo: ultimo, previoVisual: ultimoFueVisual ? ultimoVisual : undefined });
    eventos.push({ t: inicioCap / fps, tipo: 'whoosh', fuerza: 1 });
    cap.escenas.forEach((e, k) => {
      const i = primera + k;
      const desde = k === 0 ? inicioCap + fCap : desdeVisual(i);
      const hasta = desdeVisual(i + 1);
      const linea = L[i];
      const b: BloqueTesis = { tipo: 'escena', desde, hasta, capitulo: ci, escena: k, tipoEscena: e.tipo, linea: i, enfasisPais: e.enfasis?.pais };
      if (k === 0) b.rotuloCapitulo = { texto: textoRotuloCapitulo(ci, cap.titulo), desde, hasta: Math.min(hasta, desde + f(T_ROTULO_CAPITULO)) };
      // Visual v2 de la escena (si se puede dibujar).
      const clave = claveDeVisual(ci, k);
      let vv: VistaVisual | undefined;
      if (e.visual && visualDisponible(e.visual, clave, g.visuales)) {
        const disposicion = e.grafico ? e.disposicion ?? 'dividido' : 'completo';
        // En `dividido` el visual entra con la escena (su `dice` se ignora: el panel izquierdo no queda vacío).
        const fd = disposicion === 'dividido' ? null : frameDePalabra(linea, e.visual.dice);
        const vDesde = fd !== null ? Math.min(Math.max(desde, fd), hasta - f(1)) : desde;
        vv = { v: e.visual, clave, desde: vDesde, hasta };
        if (e.visual.tipo === 'iconos' || e.visual.tipo === 'versus') {
          // Ítems en orden (en `versus`: lado 0 y luego lado 1): cada uno entra cuando la voz lo dice, o repartidos.
          const items: { dice?: string }[] = e.visual.tipo === 'iconos' ? e.visual.items : [...e.visual.lados[0].items, ...e.visual.lados[1].items];
          const n = items.length;
          const finVoz = Math.max(vDesde + f(1), f(linea.inicio + linea.duracionHablada));
          const tramo = (finVoz - vDesde) * 0.8;
          let piDesde = 0;
          vv.itemsFrame = items.map((it, j) => {
            const pi = it.dice ? buscarPalabra(linea.palabras, it.dice, piDesde) : -1;
            if (pi >= 0) { piDesde = pi + 1; return Math.max(vDesde, f(linea.inicio + linea.palabras[pi].inicio - 0.1)); }
            return Math.round(vDesde + f(0.35) + (tramo * j) / n);
          });
          vv.itemsFrame.forEach((fr) => eventos.push({ t: fr / fps, tipo: 'pop', fuerza: 0.45 }));
          if (e.visual.tipo === 'versus' && e.visual.apuesta) {
            const fa = frameDePalabra(linea, e.visual.apuesta.dice);
            vv.apuestaFrame = Math.min(Math.max(vDesde, fa ?? Math.round(vDesde + 0.7 * (hasta - vDesde))), hasta - f(1));
            eventos.push({ t: vv.apuestaFrame / fps, tipo: 'golpe', fuerza: 0.6 });
          }
        }
        if (e.visual.tipo === 'mapa' && e.visual.viaje) {
          const fv = frameDePalabra(linea, e.visual.viaje.dice);
          vv.viajeDesde = fv !== null ? Math.min(Math.max(vDesde, fv), hasta - f(1)) : vDesde;
          eventos.push({ t: vv.viajeDesde / fps, tipo: 'whoosh', fuerza: 0.6 });
        }
        eventos.push({ t: vDesde / fps, tipo: 'whoosh', fuerza: 0.45 });
        b.visual = vv;
        b.disposicion = disposicion;
        // Antes de que entre (dice tardío) se ve lo anterior atenuado.
        if (vDesde > desde) { if (ultimoFueVisual) b.previoVisual = ultimoVisual; else b.previo = ultimo; }
      }
      if (e.mascota) {
        const fm = frameDePalabra(linea, e.mascota.dice);
        b.mascota = { m: e.mascota, desde: fm !== null ? Math.min(Math.max(desde, fm), hasta - f(1.2)) : desde + f(0.2) };
        eventos.push({ t: b.mascota.desde / fps, tipo: 'pop', fuerza: 0.5 });
      }
      if (e.grafico) {
        let { vista, esperaHasta } = vistaNueva(e.grafico, `c${ci}e${k}`, [linea], desde, !vv);
        // `completo` con visual y sin `dice` tardío en el gráfico: el gráfico entra pasado el 45 % de la escena.
        if (vv && b.disposicion === 'completo' && vista.graficoDesde <= vv.desde + f(1)) {
          ({ vista, esperaHasta } = vistaNueva(e.grafico, `c${ci}e${k}`, [linea], Math.round(vv.desde + 0.45 * (hasta - vv.desde)), false));
        }
        Object.assign(b, vista, { esperaHasta, previo: esperaHasta !== undefined ? ultimo : undefined });
        if (esperaHasta !== undefined && ultimoFueVisual) b.previoVisual = ultimoVisual;
        if (vv && b.disposicion === 'completo') {
          // Uno a la vez: el visual primero; el gráfico entra en su `dice` (o pasado el 45 % de la escena).
          b.cambioAGrafico = vista.graficoDesde;
          vv.hasta = b.cambioAGrafico;
        }
        ultimo = vista;
        ultimoFueVisual = false;
        if (vv) ultimoVisual = vv;
        const c0 = vista.claves[0], cn = vista.claves[vista.claves.length - 1];
        if (esperaHasta !== undefined) eventos.push({ t: esperaHasta / fps, tipo: 'whoosh', fuerza: 0.5 });
        eventos.push({ t: c0.f / fps, tipo: 'tic', fuerza: 0.7 });
        if (['lineas', 'area', 'barras', 'ranking'].includes(e.grafico.tipo)) eventos.push({ t: c0.f / fps, tipo: 'trazo', fuerza: 0.6, dur: (cn.f - c0.f) / fps });
      } else if (vv) {
        ultimoVisual = vv;
        ultimoFueVisual = true;
      } else if (e.tipo === 'respiro' && ultimoFueVisual && ultimoVisual) {
        b.previoVisual = ultimoVisual;
      } else if (e.tipo === 'respiro' && ultimo) {
        Object.assign(b, ultimo);
      } else {
        b.cita = true;
        b.previo = ultimo;
        if (ultimoFueVisual) b.previoVisual = ultimoVisual;
      }
      if (e.rotulo) {
        const pi = e.rotulo.dice ? buscarPalabra(linea.palabras, e.rotulo.dice) : -1;
        b.rotulo = { texto: e.rotulo.texto, desde: pi >= 0 ? f(linea.inicio + linea.palabras[pi].inicio - 0.05) : desde + f(0.3) };
        eventos.push({ t: b.rotulo.desde / fps, tipo: 'pop', fuerza: 0.5 });
      }
      if (e.sellos?.length) {
        // Uno a la vez: cada sello vive hasta que entra el siguiente o hasta el fin del bloque.
        const crudos = e.sellos.map((s) => {
          const fs = frameDePalabra(linea, s.dice);
          const fr = fs ?? Math.round(desde + 0.4 * (hasta - desde));
          return { s, desde: Math.min(Math.max(desde, fr), hasta - f(0.5)), sinPalabra: fs === null ? true : undefined };
        }).sort((a, z) => a.desde - z.desde);
        b.sellos = crudos.map((x, j) => ({ ...x, hasta: j + 1 < crudos.length ? Math.max(x.desde + 1, crudos[j + 1].desde) : hasta }));
        b.sellos.forEach((x) => eventos.push({ t: x.desde / fps, tipo: 'golpe', fuerza: 0.7 }));
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
  bloques.push({ tipo: 'numero', desde: desdeVisual(iNum), hasta: desdeVisual(iNum + 1), capitulo: null, linea: iNum, ...num.vista, esperaHasta: num.esperaHasta, previo: num.esperaHasta !== undefined ? ultimo : undefined,
    previoVisual: num.esperaHasta !== undefined && ultimoFueVisual ? ultimoVisual : undefined });
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
  // Cierre del video: los últimos 0,7 s del remate funden a negro con un `cierre` suave (el final se nota).
  const remateFundidoDesde = desdeVisual(iRem + 1) - f(T_FUNDIDO_REMATE);
  eventos.push({ t: remateFundidoDesde / fps, tipo: 'cierre', fuerza: 0.45 });

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
    eventos: depurarEventos(eventos), indiceDesde, remateSegundaEn, remateFundidoDesde,
  };
};

/** "m:ss" de un segundo. */
export const reloj = (seg: number) => `${Math.floor(seg / 60)}:${String(Math.floor(seg % 60)).padStart(2, '0')}`;

/** Timestamps de capítulos para la descripción de YouTube (el primero en 0:00, todos ≥ 10 s). */
export const capitulosDescripcion = (plan: PlanTesis) => plan.capitulos.map((c) => `${reloj(c.seg)} ${c.titulo}`).join('\n');

/** Bloque vigente en un frame. */
export const bloqueEn = (plan: PlanTesis, frame: number) => plan.bloques.find((b) => frame >= b.desde && frame < b.hasta) ?? plan.bloques[plan.bloques.length - 1];

// ---------------------------------------------------------------------------------------------------------------
// Validador de RITMO (v3, 2026-11-07). Puro: lo llaman preparar-tesis (tiempos reales) y generar-guiones (tiempos
// estimados con `estimarTiempos`), así que no lee archivos ni depende de la voz real.
// ---------------------------------------------------------------------------------------------------------------

/** Espera máxima (s) con tarjeta "gráfico anterior apagado + título del nuevo" sin un visual que cubra el tramo (y antes de un visual `completo` con `dice` tardío). */
export const RITMO_ESPERA_MAX = 3;
/** Foto/ilustración a pantalla completa: máximo (s) sin que entre gráfico, sello, mascota ni rótulo. */
export const RITMO_FOTO_MAX = 12;
/** Bloque `cita` (frase grande sobre lo anterior apagado): máximo (s). */
export const RITMO_CITA_MAX = 12;
/** Un mismo gráfico sin ningún cambio (anotación, rótulo, sello, mascota, construcción): máximo (s). */
export const RITMO_GRAFICO_QUIETO_MAX = 20;
/** Mapas con `viaje` por video: más es mareo (aviso). */
export const RITMO_VIAJES_MAX = 2;

/** "17,3" (segundos con un decimal y coma). */
const seg1 = (s: number) => s.toFixed(1).replace('.', ',');

/** Segmentos cortos (≤ 4 palabras) de una enumeración en `texto`, o [] si ninguna oración enumera ≥ 3 cosas. */
export const enumeracionEn = (texto: string): string[] => {
  for (const oracion of texto.split(/[.?!;:…]+/)) {
    const segs = oracion.split(/,|\s+ni\s+/i).map((x) => x.trim()).filter(Boolean);
    const cortos = segs.filter((x) => x.split(/\s+/).length <= 4);
    if (segs.length >= 3 && cortos.length >= 3) return cortos;
  }
  return [];
};

export const problemasDeRitmo = (plan: PlanTesis, g: GuionTesis): { errores: string[]; avisos: string[] } => {
  const errores: string[] = [];
  const avisos: string[] = [];
  const fps = plan.fps;
  const s = (frames: number) => frames / fps;
  const escenaDe = (b: BloqueTesis) => (b.capitulo !== null && b.escena !== undefined ? g.capitulos[b.capitulo]?.escenas[b.escena] : undefined);
  const nombre = (b: BloqueTesis) => (b.tipo === 'escena' ? `escena ${claveDeVisual(b.capitulo!, b.escena!)}` : b.tipo === 'numero' ? 'el número que nadie mira' : b.tipo);
  /** Sin `visuales` resueltos (generar-guiones, Studio) se supone que fotos e ilustraciones del guion se resolverán. */
  const suponerVisuales = !(g as GuionTesis & { visuales?: VisualesResueltos }).visuales;
  const visualDeclarado = (b: BloqueTesis) => {
    const e = escenaDe(b);
    return e?.visual && (e.visual.tipo === 'foto' || e.visual.tipo === 'ilustracion') ? e.visual : undefined;
  };

  for (const b of plan.bloques) {
    const e = escenaDe(b);
    // (1) Espera con tarjeta antes de un gráfico.
    if (b.esperaHasta !== undefined && b.grafico) {
      // La tarjeta se ve desde el inicio hasta la palabra `dice` (esperaHasta + 0,4 s de transición).
      const espera = s(b.esperaHasta - b.desde) + 0.4;
      const cubierta = !!b.visual || (suponerVisuales && !!visualDeclarado(b));
      if (espera > RITMO_ESPERA_MAX && !cubierta) {
        const sinResolver = !suponerVisuales && visualDeclarado(b) ? ` (su ${visualDeclarado(b)!.tipo} no está resuelta: la escena cayó a la tarjeta)` : '';
        errores.push(`${nombre(b)}: ${seg1(espera)} s de tarjeta de espera antes del gráfico «${b.grafico.titulo}»${sinResolver}: dale un visual a ese tramo o adelanta \`dice\``);
      } else if (!cubierta && espera < tiempoLectura(b.grafico.titulo)) {
        avisos.push(`${nombre(b)}: la tarjeta «${b.grafico.titulo}» dura ${seg1(espera)} s y se lee en ${seg1(tiempoLectura(b.grafico.titulo))} s: adelanta \`dice\` o acorta el título`);
      }
    }
    // (1b) Lo mismo antes de un visual `completo` con `dice` tardío: hasta que entra se ve lo anterior apagado.
    if (b.visual && b.disposicion === 'completo' && s(b.visual.desde - b.desde) > RITMO_ESPERA_MAX) {
      errores.push(`${nombre(b)}: ${seg1(s(b.visual.desde - b.desde))} s con lo anterior apagado antes de que entre ${b.visual.v.tipo === 'ilustracion' ? 'la ilustración' : `el visual \`${b.visual.v.tipo}\``} (\`dice\` «${b.visual.v.dice ?? ''}» llega tarde): adelanta o quita \`visual.dice\``);
    }
    // (2) Foto/ilustración a pantalla completa sin cambios.
    if (b.tipo === 'escena') {
      let tramo: [number, number] | undefined;
      let tipo: string | undefined;
      if (b.visual && b.disposicion === 'completo' && (b.visual.v.tipo === 'foto' || b.visual.v.tipo === 'ilustracion')) {
        tramo = [b.visual.desde, b.visual.hasta]; tipo = b.visual.v.tipo;
      } else if (!b.visual && suponerVisuales && visualDeclarado(b) && (!e?.grafico || e.disposicion === 'completo')) {
        // Estimación sin visuales resueltos: la foto ocupa desde el inicio hasta que entra el gráfico (o el fin).
        tramo = [b.desde, e?.grafico ? Math.round(b.desde + 0.45 * (b.hasta - b.desde)) : b.hasta]; tipo = visualDeclarado(b)!.tipo;
      }
      if (tramo && tipo) {
        const cortes = [tramo[0], tramo[1],
          ...(b.sellos ?? []).map((x) => x.desde), ...(b.mascota ? [b.mascota.desde] : []), ...(b.rotulo ? [b.rotulo.desde] : []),
          ...(b.rotuloCapitulo ? [b.rotuloCapitulo.hasta] : [])].filter((x) => x >= tramo![0] && x <= tramo![1]).sort((a, z) => a - z);
        let peor = 0;
        for (let k = 1; k < cortes.length; k++) peor = Math.max(peor, cortes[k] - cortes[k - 1]);
        if (s(peor) > RITMO_FOTO_MAX) errores.push(`${nombre(b)}: ${tipo === 'foto' ? 'foto' : 'ilustración'} a pantalla completa ${seg1(s(peor))} s sin que entre gráfico, sello, mascota ni rótulo (máx. ${RITMO_FOTO_MAX} s): parte el tramo con un sello/rótulo, un gráfico o un visual \`iconos\`/\`versus\``);
      }
    }
    // (3) Cita eterna.
    if (b.cita && s(b.hasta - b.desde) > RITMO_CITA_MAX && !(suponerVisuales && visualDeclarado(b))) {
      errores.push(`${nombre(b)}: ${seg1(s(b.hasta - b.desde))} s de frase grande sin gráfico ni visual propio (máx. ${RITMO_CITA_MAX} s): dale un visual o acórtala`);
    }
    // Avisos: enumeración sin iconos/versus; sellos cuya palabra la voz no dice.
    if (e && b.tipo === 'escena') {
      const en = enumeracionEn(e.texto);
      if (en.length >= 3 && e.visual?.tipo !== 'iconos' && e.visual?.tipo !== 'versus') {
        avisos.push(`${nombre(b)}: el texto enumera («${en.slice(0, 3).join(', ')}…») y no lleva visual \`iconos\` ni \`versus\``);
      }
      for (const x of b.sellos ?? []) if (x.sinPalabra) avisos.push(`${nombre(b)}: el sello «${x.s.texto}» espera la palabra «${x.s.dice}», que la voz no dice: se estampa al 40 % de la escena (${seg1(s(x.desde - b.desde))} s)`);
    }
  }

  // (4) Un mismo gráfico quieto: tramos consecutivos donde el gráfico es lo principal (no cita, no remate).
  type Tramo = { id: string; titulo: string; ini: number; fin: number; cortes: number[]; donde: string };
  const tramos: Tramo[] = [];
  let actual: Tramo | undefined;
  for (const b of plan.bloques) {
    const visible = b.grafico && b.graficoId && !b.cita && b.tipo !== 'remate' && b.tipo !== 'capitulo';
    if (!visible) { actual = undefined; continue; }
    const ini = Math.max(b.desde, b.graficoDesde ?? b.desde);
    if (!actual || actual.id !== b.graficoId) {
      actual = { id: b.graficoId!, titulo: b.grafico!.titulo, ini, fin: b.hasta, cortes: [], donde: nombre(b) };
      tramos.push(actual);
    }
    actual.fin = b.hasta;
    const c = actual.cortes;
    c.push(ini);
    // La construcción es cambio continuo entre su primera y su última clave: cortes cada 1 s en ese tramo.
    if (b.claves?.length) {
      const c0 = b.claves[0].f, cn = b.claves[b.claves.length - 1].f;
      if (b.tipoEscena !== 'respiro' && cn >= ini) for (let x = Math.max(c0, ini); x <= cn; x += fps) c.push(x);
      if (b.tipoEscena !== 'respiro') b.claves.forEach((k) => c.push(k.f));
    }
    (b.anotFrames ?? []).forEach((x) => x !== undefined && c.push(x));
    if (b.rotulo) c.push(b.rotulo.desde);
    if (b.rotuloCapitulo) c.push(b.rotuloCapitulo.hasta);
    (b.sellos ?? []).forEach((x) => c.push(x.desde, x.hasta));
    if (b.mascota) c.push(b.mascota.desde);
    if (b.enfasisDesde !== undefined) c.push(b.enfasisDesde);
    if (b.visual) { c.push(b.visual.desde); (b.visual.itemsFrame ?? []).forEach((x) => c.push(x)); if (b.visual.apuestaFrame !== undefined) c.push(b.visual.apuestaFrame); if (b.visual.viajeDesde !== undefined) c.push(b.visual.viajeDesde); }
  }
  for (const t of tramos) {
    const cortes = [t.ini, t.fin, ...t.cortes].filter((x) => x >= t.ini && x <= t.fin).sort((a, z) => a - z);
    let peor = 0, desdePeor = t.ini;
    for (let k = 1; k < cortes.length; k++) if (cortes[k] - cortes[k - 1] > peor) { peor = cortes[k] - cortes[k - 1]; desdePeor = cortes[k - 1]; }
    if (s(peor) > RITMO_GRAFICO_QUIETO_MAX) {
      const b = plan.bloques.find((x) => desdePeor >= x.desde && desdePeor < x.hasta);
      errores.push(`${b ? nombre(b) : t.donde}: el gráfico «${t.titulo}» queda ${seg1(s(peor))} s sin ningún cambio (anotación, rótulo, sello, mascota ni construcción; máx. ${RITMO_GRAFICO_QUIETO_MAX} s): agrega un sello o una anotación con \`dice\``);
    }
  }

  // Aviso: demasiados viajes de mapa.
  const viajes = g.capitulos.flatMap((c, ci) => c.escenas.flatMap((e, k) => (e.visual?.tipo === 'mapa' && e.visual.viaje ? [claveDeVisual(ci, k)] : [])));
  if (viajes.length > RITMO_VIAJES_MAX) avisos.push(`${viajes.length} mapas con \`viaje\` (${viajes.join(', ')}); máximo ${RITMO_VIAJES_MAX} por video, solo en cambios grandes de protagonista`);

  return { errores, avisos };
};
