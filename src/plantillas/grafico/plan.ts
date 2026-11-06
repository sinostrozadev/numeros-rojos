/**
 * Plan temporal del SHORT `grafico` (módulo puro, sin Remotion): lo usan la composición Grafico y
 * preparar-grafico.mts. Líneas: 0 = gancho, 1..n = escenas, n+1 = remate (igual que `lineasDeVozGrafico`).
 *
 * El gráfico principal está en pantalla desde el frame 0 (con el rótulo y el título: el gancho se ve ENTERO) y se
 * construye con la voz desde `dice` hasta la última escena `dato` antes del giro. Una escena con gráfico propio lo
 * reemplaza mientras dure. El giro enciende el énfasis (rojo) cuando la voz dice el rótulo o la cifra.
 */
import type { GuionGrafico } from '../comun/guion';
import type { DatosResueltos, Grafico } from '../comun/datos';
import { PAUSA, buscarPalabra, depurarEventos, estimarTiempos, primeraCifra, type Clave, type Evento, type LineaVoz, type Tiempos } from '../comun/plan';
import { clavesDeGrafico } from '../comun/construccion';
import { mitadesRemate } from '../comun/remate-texto';
import { FORMATO_SHORT, RITMO } from '../../marca/tokens';

export const FPS_GRAFICO = FORMATO_SHORT.fps;

/**
 * Frame del énfasis del giro: cuando la voz dice el rótulo/la cifra, pero no antes de que el gráfico vaya en un 80 %
 * y nunca después de 1,5 s antes del fin del bloque (que se alcance a ver).
 */
const enfasisGiro = (fPalabra: number, claves: Clave[] | undefined, tope: number) => {
  if (!claves?.length) return Math.min(fPalabra, tope);
  const c0 = claves[0].f, cn = claves[claves.length - 1].f;
  return Math.max(Math.min(Math.max(fPalabra, c0 + 0.8 * (cn - c0)), tope), c0);
};

export const lineasGrafico = (g: GuionGrafico): LineaVoz[] => [
  { tipo: 'gancho', texto: g.gancho.texto, antes: 0.1, despues: PAUSA },
  ...g.escenas.map((e): LineaVoz => ({
    tipo: 'escena', texto: e.texto,
    antes: e.tipo === 'giro' ? 0.15 : 0,
    despues: e.tipo === 'respiro' ? (e.respiroSeg ?? 1.5) : (e.respiroSeg ?? PAUSA) + (e.tipo === 'giro' ? 0.25 : 0),
  })),
  { tipo: 'remate', texto: g.remate, antes: PAUSA, despues: 0.5 },
];

export const estimarTiemposGrafico = (g: GuionGrafico) => estimarTiempos(g.id, 'estimada', lineasGrafico(g));

export type BloqueGrafico = {
  tipo: 'gancho' | 'escena' | 'remate' | 'cierre';
  desde: number;
  hasta: number;
  linea?: number;
  escena?: number;
  tipoEscena?: GuionGrafico['escenas'][number]['tipo'];
  grafico: Grafico;
  graficoId: string;
  graficoDesde: number;
  claves: Clave[];
  enfasisDesde?: number;
  rotulo?: { texto: string; desde: number };
};

export type PlanGrafico = {
  fps: number;
  duracionFrames: number;
  duracionSeg: number;
  bloques: BloqueGrafico[];
  eventos: Evento[];
  remateSegundaEn: number;
};

export const planGrafico = (g: GuionGrafico, tiempos: Tiempos, datos?: DatosResueltos, fps = FPS_GRAFICO): PlanGrafico => {
  const f = (s: number) => Math.round(s * fps);
  const L = tiempos.lineas;
  const desdeVisual = (i: number) => (i === 0 ? 0 : f(L[i].inicio - L[i].antes));
  const n = g.escenas.length;
  // Construcción del gráfico principal: del gancho hasta la última escena `dato`/`planteamiento` antes del giro.
  const iGiro = g.escenas.findIndex((e) => e.tipo === 'giro');
  const mismo = (x?: Grafico) => !x || JSON.stringify(x) === JSON.stringify(g.grafico);
  let ultimaConstruccion = 0;
  g.escenas.forEach((e, k) => { if ((iGiro < 0 || k < iGiro) && (e.tipo === 'dato' || e.tipo === 'planteamiento') && mismo(e.grafico)) ultimaConstruccion = k + 1; });
  if (ultimaConstruccion === 0) ultimaConstruccion = Math.min(1, n);
  const clavesPrincipal = clavesDeGrafico(g.grafico, L.slice(0, ultimaConstruccion + 1), fps, datos);
  const eventos: Evento[] = [{ t: 0, tipo: 'golpe', fuerza: 0.9 }];
  const c0 = clavesPrincipal[0], cn = clavesPrincipal[clavesPrincipal.length - 1];
  eventos.push({ t: c0.f / fps, tipo: 'tic', fuerza: 0.7 });
  if (['lineas', 'area', 'barras', 'ranking'].includes(g.grafico.tipo)) eventos.push({ t: c0.f / fps, tipo: 'trazo', fuerza: 0.6, dur: (cn.f - c0.f) / fps });

  const bloques: BloqueGrafico[] = [];
  const principal = { grafico: g.grafico, graficoId: 'principal', graficoDesde: 0, claves: clavesPrincipal };
  bloques.push({ tipo: 'gancho', desde: 0, hasta: desdeVisual(1), linea: 0, ...principal });
  g.escenas.forEach((e, k) => {
    const i = k + 1;
    const linea = L[i];
    const desde = desdeVisual(i), hasta = desdeVisual(i + 1);
    const propio = !mismo(e.grafico);
    const b: BloqueGrafico = propio
      ? { tipo: 'escena', desde, hasta, linea: i, escena: k, tipoEscena: e.tipo, grafico: e.grafico!, graficoId: `e${k}`, graficoDesde: desde, claves: clavesDeGrafico(e.grafico!, [linea], fps, datos) }
      : { tipo: 'escena', desde, hasta, linea: i, escena: k, tipoEscena: e.tipo, ...principal };
    if (propio) { eventos.push({ t: desde / fps, tipo: 'whoosh', fuerza: 0.7 }); eventos.push({ t: b.claves[0].f / fps, tipo: 'tic', fuerza: 0.6 }); }
    if (e.rotulo) {
      const pi = e.rotulo.dice ? buscarPalabra(linea.palabras, e.rotulo.dice) : -1;
      b.rotulo = { texto: e.rotulo.texto, desde: pi >= 0 ? f(linea.inicio + linea.palabras[pi].inicio - 0.05) : desde + f(0.15) };
      eventos.push({ t: b.rotulo.desde / fps, tipo: 'pop', fuerza: 0.55 });
    }
    if (e.tipo === 'giro') {
      const pi = e.rotulo?.dice ? buscarPalabra(linea.palabras, e.rotulo.dice) : primeraCifra(linea.palabras);
      const t = pi >= 0 ? linea.inicio + linea.palabras[pi].inicio : linea.inicio + linea.duracionHablada * 0.35;
      b.enfasisDesde = enfasisGiro(f(t), b.claves, hasta - f(1.5));
      eventos.push({ t: b.enfasisDesde / fps, tipo: 'golpe', fuerza: 0.8 });
    }
    bloques.push(b);
  });
  const iRem = n + 1;
  const lr = L[iRem];
  const ultimo = bloques[bloques.length - 1];
  const cierreDesde = f(tiempos.total + 0.2);
  const [primeraMitad] = mitadesRemate(g.remate);
  const nPrimera = primeraMitad.split(/\s+/).filter(Boolean).length;
  const remateSegundaEn = lr.palabras[nPrimera] ? f(lr.antes + lr.palabras[nPrimera].inicio) : f(lr.antes + lr.duracionHablada * 0.5);
  bloques.push({ tipo: 'remate', desde: desdeVisual(iRem), hasta: cierreDesde, linea: iRem, grafico: ultimo.grafico, graficoId: ultimo.graficoId, graficoDesde: ultimo.graficoDesde, claves: ultimo.claves });
  eventos.push({ t: Math.max(0, lr.inicio - 0.8), tipo: 'riser', fuerza: 0.9 });
  eventos.push({ t: lr.inicio, tipo: 'golpe', fuerza: 1 });
  eventos.push({ t: (desdeVisual(iRem) + remateSegundaEn) / fps, tipo: 'pop', fuerza: 0.6 });
  const duracionFrames = cierreDesde + f(RITMO.cierre);
  bloques.push({ tipo: 'cierre', desde: cierreDesde, hasta: duracionFrames, grafico: ultimo.grafico, graficoId: ultimo.graficoId, graficoDesde: ultimo.graficoDesde, claves: ultimo.claves });
  eventos.push({ t: cierreDesde / fps, tipo: 'cierre', fuerza: 1 });
  return { fps, duracionFrames, duracionSeg: duracionFrames / fps, bloques, eventos: depurarEventos(eventos), remateSegundaEn };
};
