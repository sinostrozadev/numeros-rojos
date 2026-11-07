import React from 'react';
import { Img, interpolate, staticFile, useVideoConfig } from 'remotion';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { FotoResuelta, VisualesResueltos } from '../visual';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Autor corto para el crédito en pantalla (el completo va en la descripción). */
const corto = (a: string, n = 40) => (a.length > n ? `${a.slice(0, n - 2).trim()}…` : a);

export type PropsPanelImagen = {
  /** Ruta relativa a public/. */
  src: string;
  /** Tamaño de la imagen (px), para decidir si cabe recortada o va entera sobre un fondo desenfocado. */
  anchoImg?: number;
  altoImg?: number;
  ancho: number;
  alto: number;
  /** Frames desde que el panel entra y cuántos dura (para el ken-burns). */
  frame: number;
  frames: number;
  encuadre?: 'ken-burns' | 'fijo';
  pie?: string;
  credito?: string;
  /** Sentido del paneo (alterna entre fotos para que no se vean iguales). */
  variante?: number;
};

/**
 * Imagen en panel (foto de Commons o ilustración): entra con fundido 0,4 s; ken-burns determinista (zoom 1,0 → 1,08
 * y paneo sutil a lo largo de `frames`) o fija; si la imagen es mucho más alta que el panel se muestra ENTERA sobre
 * una copia desenfocada (no se recortan cabezas ni carteles). Velo oscuro abajo para que pie y crédito se lean; pie
 * en caja de acento abajo a la izquierda; crédito (autor · licencia) abajo a la derecha, siempre visible.
 */
export const PanelImagen: React.FC<PropsPanelImagen> = ({ src, anchoImg, altoImg, ancho, alto, frame, frames, encuadre = 'ken-burns', pie, credito, variante = 0 }) => {
  const { fps } = useVideoConfig();
  const entra = clamp01(frame / (0.4 * fps));
  const p = clamp01(frame / Math.max(1, frames));
  const kb = encuadre === 'ken-burns';
  const zoom = kb ? 1 + 0.08 * p : 1;
  const sentido = variante % 2 === 0 ? 1 : -1;
  const dx = kb ? sentido * 1.6 * p : 0, dy = kb ? -0.8 * p : 0;
  const proporcion = anchoImg && altoImg ? anchoImg / altoImg : ancho / alto;
  const entera = proporcion < (ancho / alto) * 0.72;
  const url = staticFile(src);
  const estiloImg: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `scale(${zoom}) translate(${dx}%, ${dy}%)`, transformOrigin: '50% 45%' };
  return (
    <div style={{ position: 'relative', width: ancho, height: alto, borderRadius: 22, overflow: 'hidden', opacity: 0.3 + 0.7 * entra, transform: `scale(${0.985 + 0.015 * entra})`, background: PALETA.fondo2,
      boxShadow: '0 22px 60px rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.12)' }}>
      {entera && <Img src={url} style={{ ...estiloImg, objectFit: 'cover', filter: 'blur(28px) brightness(0.45) saturate(0.8)', transform: 'scale(1.15)' }} />}
      <Img src={url} style={{ ...estiloImg, objectFit: entera ? 'contain' : 'cover', objectPosition: 'center 40%', filter: 'saturate(0.92) contrast(1.04)' }} />
      {/* Velo: oscurece apenas el conjunto y más abajo, donde van pie y crédito. */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,20,24,0.10) 0%, rgba(17,20,24,0) 45%, rgba(17,20,24,0.72) 100%)' }} />
      {pie && (
        <div style={{ position: 'absolute', left: 26, bottom: 26, maxWidth: ancho * (credito ? 0.6 : 0.9), background: PALETA.dorado, color: PALETA.fondo, borderRadius: 8,
          padding: '4px 16px 0', fontFamily: TIPO.condensada, fontSize: 40, lineHeight: 1.15, letterSpacing: 1, textTransform: 'uppercase',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
          transform: `translateY(${(1 - clamp01((frame - 0.3 * fps) / (0.35 * fps))) * 12}px)` }}>{pie}</div>
      )}
      {credito && (
        <div style={{ position: 'absolute', right: 22, bottom: 24, maxWidth: ancho * (pie ? 0.36 : 0.8), textAlign: 'right', fontFamily: TIPO.texto, fontWeight: 500, fontSize: 18,
          lineHeight: 1.25, color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 3px rgba(0,0,0,0.9)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {credito}
        </div>
      )}
    </div>
  );
};

/** Crédito corto en pantalla de una foto de Commons. */
export const creditoFoto = (f: FotoResuelta) => `Foto: ${corto(f.autor)} · ${f.licencia} · Wikimedia Commons`;

/**
 * Foto de Wikimedia Commons ya resuelta por preparar-tesis (props.visuales[clave].foto). Si no está resuelta no dibuja
 * nada (el contenedor cae al gráfico previo).
 */
export const Foto: React.FC<{ visuales?: VisualesResueltos; clave: string; ancho: number; alto: number; frame: number; frames: number; pie?: string; encuadre?: 'ken-burns' | 'fijo'; variante?: number }> = ({ visuales, clave, ...r }) => {
  const f = visuales?.[clave]?.foto;
  if (!f) return null;
  return <PanelImagen src={f.archivo} anchoImg={f.ancho} altoImg={f.alto} credito={creditoFoto(f)} {...r} />;
};

export const fotoResuelta = (visuales: VisualesResueltos | undefined, clave: string) => !!visuales?.[clave]?.foto;

/** Para que un fundido de salida suave sea fácil desde fuera. */
export const fundidoSalida = (frame: number, frames: number, fps = 30) => interpolate(frame, [frames - 0.3 * fps, frames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
