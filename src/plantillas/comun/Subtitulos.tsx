import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { PALETA, TIPO } from '../../marca/tokens';
import { indicePalabraActual, normalizar, type LineaTiempo, type Palabra } from './plan';

/** Palabras que no conviene dejar colgando al final de un bloque. */
const DEBILES = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'e', 'o', 'a', 'en', 'que', 'por', 'con', 'su', 'sus', 'al', 'lo', 'se', 'ni']);
const MAX_PALABRAS = 4;
const MAX_LETRAS = 21;

/** ¿La palabra i abre frase? (primera o la anterior termina en . ? ! :) */
const abreFrase = (p: Palabra[], i: number) => i === 0 || /[.?!:…]["»”)]*$/.test(p[i - 1].texto);
const esPropia = (p: Palabra[], i: number) => /^[¿¡"«]?[A-ZÁÉÍÓÚÑ]/.test(p[i].texto) && !abreFrase(p, i);

/**
 * Agrupa las palabras en unidades indivisibles (nombres propios de varias palabras: "El Paso", "Punto
 * Concordia", "Hito 1", "Corte Internacional de Justicia" se cortan como máximo en 4).
 */
const unidades = (p: Palabra[]): [number, number][] => {
  const out: [number, number][] = [];
  let i = 0;
  while (i < p.length) {
    let j = i + 1;
    const propia = /^[¿¡"«]?[A-ZÁÉÍÓÚÑ]/.test(p[i].texto);
    while (propia && j < p.length && j - i < 3 && !/[.,;:?!…]["»”)]*$/.test(p[j - 1].texto) &&
      (esPropia(p, j) || /^\d/.test(p[j].texto) || (['de', 'del'].includes(p[j].texto.toLowerCase()) && j + 1 < p.length && esPropia(p, j + 1)))) j++;
    out.push([i, j]);
    i = j;
  }
  return out;
};

/** Bloques de 2–4 palabras cortados por frase/ritmo, sin partir nombres propios ni dejar artículos colgando. */
export const bloquesDe = (p: Palabra[]): { desde: number; hasta: number }[] => {
  const us = unidades(p);
  const bloques: { desde: number; hasta: number }[] = [];
  let actual: [number, number][] = [];
  const letras = (u: [number, number][]) => u.reduce((s, [a, b]) => s + p.slice(a, b).reduce((x, w) => x + w.texto.length + 1, 0), 0);
  const cerrar = () => { if (actual.length) bloques.push({ desde: actual[0][0], hasta: actual[actual.length - 1][1] }); actual = []; };
  for (let k = 0; k < us.length; k++) {
    const u = us[k];
    const nPal = actual.reduce((s, [a, b]) => s + b - a, 0) + (u[1] - u[0]);
    if (actual.length && (nPal > MAX_PALABRAS || letras([...actual, u]) > MAX_LETRAS)) {
      // Si el bloque terminaría en palabra débil, se la pasa al siguiente.
      const ult = actual[actual.length - 1];
      if (actual.length > 1 && ult[1] - ult[0] === 1 && DEBILES.has(p[ult[0]].texto.toLowerCase())) { actual.pop(); cerrar(); actual.push(ult); }
      else cerrar();
    }
    actual.push(u);
    const fin = p[u[1] - 1].texto;
    const nAhora = actual.reduce((s, [a, b]) => s + b - a, 0);
    if (/[.;:?!…]["»”)]*$/.test(fin) || (/,$/.test(fin) && nAhora >= 2)) cerrar();
  }
  cerrar();
  return bloques;
};

type Props = {
  linea: LineaTiempo;
  /** Frames desde el inicio de la voz de la línea. */
  frameLocal: number;
  centroY: number;
  fontSize: number;
  /** Ancho disponible (centrado). */
  ancho: number;
  /** Color de la palabra que suena (dorado; rojo en el giro). */
  acento?: string;
};

/**
 * Subtítulos de En Números Rojos: 2–4 palabras por bloque, Inter 800 blanco con sombra (sin pastilla, para no
 * tapar el gráfico), centrados abajo; la palabra que suena va en dorado con un golpe leve de escala. Cambian
 * cada 0,6–1 s con la voz. Las cifras (que tienen dígitos) quedan en dorado después de dichas.
 */
export const Subtitulos: React.FC<Props> = ({ linea, frameLocal, centroY, fontSize, ancho, acento = PALETA.dorado }) => {
  const { fps } = useVideoConfig();
  const t = frameLocal / fps;
  const bloques = useMemo(() => bloquesDe(linea.palabras), [linea]);
  const actual = indicePalabraActual(linea.palabras, t);
  if (actual < 0 || !bloques.length) return null;
  const ultima = linea.palabras[linea.palabras.length - 1];
  if (t > ultima.fin + 0.6) return null;
  let idx = bloques.findIndex((b) => actual < b.hasta);
  if (idx < 0) idx = bloques.length - 1;
  const b = bloques[idx];
  const inicio = linea.palabras[b.desde].inicio;
  const pop = Math.min(1, Math.max(0, (t - inicio) / 0.1));
  const palabras = linea.palabras.slice(b.desde, b.hasta);
  const largo = palabras.reduce((s, w) => s + w.texto.length + 1, 0);
  const fs = Math.min(fontSize, ancho / Math.max(6, largo * 0.6));
  return (
    <div style={{ position: 'absolute', left: 0, width: '100%', top: centroY - fs * 0.75, height: fs * 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{
        display: 'flex', gap: `0 ${fs * 0.28}px`, alignItems: 'center', transform: `scale(${0.94 + 0.06 * pop})`, opacity: 0.4 + 0.6 * pop,
        fontFamily: TIPO.texto, fontWeight: 800, fontSize: fs, lineHeight: 1, letterSpacing: -0.3, whiteSpace: 'nowrap',
      }}>
        {palabras.map((w, k) => {
          const i = b.desde + k;
          const esActual = i === actual;
          const texto = w.texto.replace(/[,;:]$/, '');
          const cifra = /\d/.test(w.texto) && i < actual;
          const golpe = esActual ? Math.min(1, Math.max(0, (t - w.inicio) / 0.09)) : 1;
          return (
            <span key={`${i}-${normalizar(w.texto)}`} style={{
              display: 'inline-block', color: esActual || cifra ? acento : PALETA.tinta, opacity: i > actual ? 0.55 : 1,
              transform: `scale(${esActual ? 1.07 - 0.07 * golpe : 1})`,
              textShadow: '0 0 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.6)',
            }}>{texto}</span>
          );
        })}
      </div>
    </div>
  );
};
