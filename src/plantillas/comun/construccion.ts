/**
 * Cómo se construye un gráfico con la voz (módulo puro): calcula las CLAVES de avance (frame → progreso 0–1) de
 * un `Grafico` a partir de las palabras de una o varias líneas de voz. Lo usan tesis/plan.ts y grafico/plan.ts.
 *  - lineas/area: la cabeza de la línea llega a cada AÑO cuando la voz lo dice (años dichos en orden creciente
 *    dentro del rango), y al último año cuando termina la frase.
 *  - contador/tarjeta: cuenta cuando la voz dice la cifra (primer número que no es año), en ~1,4 s.
 *  - comparacion: desde la cifra hasta el final de la frase (mín. 2,5 s).
 *  - barras/ranking/mapa: desde `dice` hasta el final de la frase (mín. 1,5 s).
 */
import type { DatosResueltos, Grafico } from './datos';
import { aniosDichos, buscarPalabra, primeraCifra, type Clave, type LineaTiempo } from './plan';
import { paisesDe, rangoAnios, serieDe } from './graficos/serie';

export const clavesDeGrafico = (g: Grafico, lineas: LineaTiempo[], fps: number, datos?: DatosResueltos): Clave[] => {
  const f = (s: number) => Math.round(s * fps);
  const conVoz = lineas.filter((l) => l.palabras.length);
  if (!conVoz.length) { const t0 = lineas[0]?.inicio ?? 0; return [{ f: f(t0), v: 0 }, { f: f(t0 + 1.5), v: 1 }]; }
  // Inicio: la palabra `dice` (en cualquiera de las líneas) o el comienzo de la primera.
  let inicio = conVoz[0].inicio + Math.min(0.25, conVoz[0].palabras[0].inicio);
  let linea0 = 0, palabra0 = 0;
  if (g.dice) {
    for (let k = 0; k < conVoz.length; k++) {
      const i = buscarPalabra(conVoz[k].palabras, g.dice);
      if (i >= 0) { inicio = conVoz[k].inicio + conVoz[k].palabras[i].inicio; linea0 = k; palabra0 = i; break; }
    }
  }
  const ultima = conVoz[conVoz.length - 1];
  const fin = ultima.inicio + ultima.duracionHablada;
  const tipo = g.tipo;
  if (tipo === 'contador' || tipo === 'tarjeta' || tipo === 'comparacion') {
    let t = inicio;
    for (let k = linea0; k < conVoz.length; k++) {
      const i = primeraCifra(conVoz[k].palabras, k === linea0 ? palabra0 : 0);
      if (i >= 0) { t = conVoz[k].inicio + conVoz[k].palabras[i].inicio - 0.1; break; }
    }
    const dur = tipo === 'comparacion' ? Math.max(2.5, fin - t) : tipo === 'tarjeta' ? 0.8 : 1.4;
    return [{ f: f(t), v: 0 }, { f: f(t + dur), v: 1 }];
  }
  const finDibujo = Math.max(fin - 0.2, inicio + 1.5);
  const claves: Clave[] = [{ f: f(inicio), v: 0 }];
  if (tipo === 'lineas' || tipo === 'area') {
    const rango = rangoAnios(paisesDe(g, serieDe(g, datos)), g);
    if (rango && rango[1] > rango[0]) {
      const [a0, a1] = rango;
      let ultimoV = 0;
      for (let k = linea0; k < conVoz.length; k++) {
        for (const { i, anio } of aniosDichos(conVoz[k].palabras)) {
          if (k === linea0 && i < palabra0) continue;
          const t = conVoz[k].inicio + conVoz[k].palabras[i].inicio;
          const v = (anio - a0) / (a1 - a0);
          // Solo años dentro del rango, crecientes y con al menos 0,4 s desde la clave anterior.
          if (v <= ultimoV || v > 1 || t <= claves[claves.length - 1].f / fps + 0.4) continue;
          claves.push({ f: f(t), v });
          ultimoV = v;
        }
      }
    }
  }
  const ultimaClave = claves[claves.length - 1];
  if (ultimaClave.v < 1) claves.push({ f: Math.max(ultimaClave.f + f(0.6), f(finDibujo)), v: 1 });
  return claves;
};

/** Frame absoluto en que la voz dice `g.dice` (en alguna de las líneas), o null si no hay `dice` o no se encuentra. */
export const frameDice = (g: Grafico, lineas: LineaTiempo[], fps: number): number | null => {
  if (!g.dice) return null;
  for (const l of lineas) {
    const i = buscarPalabra(l.palabras, g.dice);
    if (i >= 0) return Math.round((l.inicio + l.palabras[i].inicio) * fps);
  }
  return null;
};

/** Frame absoluto de cada anotación con `dice` (la voz dice esa palabra); undefined si se guía por el año. */
export const framesAnotaciones = (g: Grafico, lineas: LineaTiempo[], fps: number): (number | undefined)[] =>
  (g.anotaciones ?? []).map((a) => {
    if (!a.dice) return undefined;
    for (const l of lineas) {
      const i = buscarPalabra(l.palabras, a.dice);
      if (i >= 0) return Math.round((l.inicio + l.palabras[i].inicio) * fps);
    }
    return undefined;
  });
