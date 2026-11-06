import React, { useMemo } from 'react';
import { interpolate } from 'remotion';
import { PALETA, TIPO } from '../../marca/tokens';
import { indicePalabraActual, type LineaTiempo, type Palabra } from './plan';

/** Páginas de ≤ `max` caracteres, cortadas de preferencia en fin de frase o coma (2 líneas de display). */
export const paginasCita = (p: Palabra[], max = 64): { desde: number; hasta: number }[] => {
  const out: { desde: number; hasta: number }[] = [];
  let desde = 0, letras = 0;
  for (let i = 0; i < p.length; i++) {
    const l = p[i].texto.length + 1;
    const fin = /[.?!:;…]["»”)]*$/.test(p[i].texto);
    const coma = /,$/.test(p[i].texto);
    if (letras + l > max && i > desde) { out.push({ desde, hasta: i }); desde = i; letras = 0; }
    letras += l;
    if (fin && letras > max * 0.35) { out.push({ desde, hasta: i + 1 }); desde = i + 1; letras = 0; }
    else if (coma && letras > max * 0.7) { out.push({ desde, hasta: i + 1 }); desde = i + 1; letras = 0; }
  }
  if (desde < p.length) out.push({ desde, hasta: p.length });
  return out;
};

/**
 * "Tarjeta de cita": la frase que dice la voz, GRANDE al centro (display, máx. 2 líneas), la palabra que suena en
 * dorado, las dichas en blanco y las que vienen tenues. Para escenas sin gráfico propio (planteamiento, giro,
 * reenganche, significado): reemplaza a los subtítulos y va sobre el último gráfico atenuado.
 */
export const Cita: React.FC<{ linea: LineaTiempo; frameLocal: number; fps: number; ancho: number; fontSize: number; centroY: number; acento?: string }> = ({ linea, frameLocal, fps, ancho, fontSize, centroY, acento = PALETA.dorado }) => {
  const paginas = useMemo(() => paginasCita(linea.palabras, Math.round((ancho / (fontSize * 0.52)) * 1.9)), [linea, ancho, fontSize]);
  if (!paginas.length) return null;
  const t = frameLocal / fps;
  const actual = indicePalabraActual(linea.palabras, t);
  let idx = paginas.findIndex((pg) => actual < pg.hasta);
  if (idx < 0) idx = paginas.length - 1;
  const pg = paginas[idx];
  const t0 = Math.round(linea.palabras[pg.desde].inicio * fps);
  const entra = idx === 0 ? interpolate(frameLocal, [-12, 0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frameLocal, [t0, t0 + 6], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, width: '100%', top: centroY - fontSize * 1.4, height: fontSize * 2.8, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: ancho, textAlign: 'center', fontFamily: TIPO.display, fontWeight: 800, fontSize, lineHeight: 1.12, letterSpacing: -1,
        opacity: entra, transform: `translateY(${(1 - entra) * 14}px)`,
        textShadow: '0 0 4px rgba(0,0,0,0.9), 0 6px 26px rgba(0,0,0,0.75)',
      }}>
        {linea.palabras.slice(pg.desde, pg.hasta).map((w, k) => {
          const i = pg.desde + k;
          return (
            <span key={i} style={{ color: i === actual ? acento : PALETA.tinta, opacity: i > actual ? 0.42 : 1 }}>{w.texto}{' '}</span>
          );
        })}
      </div>
    </div>
  );
};
