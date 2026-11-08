import React from 'react';
import { spring } from 'remotion';
import type { z } from 'zod';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { VisualIconos as EsquemaIconos } from '../visual';
import { Icono } from './Icono';

export type VisualIconos = z.infer<typeof EsquemaIconos>;
export type MarcaItem = 'si' | 'no';

/** Retardo de la insignia (✓/✗) respecto del ítem: primero se nombra la cosa, después se juzga. */
export const RETARDO_MARCA = 0.25;

/**
 * Icono dentro de su círculo dorado tenue, con la marca v3 opcional: `si` = insignia verde con check en la esquina
 * superior derecha; `no` = insignia roja con cruz, el icono se atenúa y una diagonal roja lo tacha. `em` es el avance
 * (0–1, resorte) de la marca: el padre lo calcula `RETARDO_MARCA` s después de que entra el ítem.
 */
export const CirculoIcono: React.FC<{ nombre: string; lado: number; icono: number; marca?: MarcaItem; em?: number }> = ({ nombre, lado, icono, marca, em = 0 }) => {
  const m = marca ? Math.max(0, Math.min(1.2, em)) : 0;
  const no = marca === 'no';
  const insignia = Math.round(lado * 0.42);
  const colorMarca = no ? PALETA.rojo : PALETA.verde;
  // Borde: dorado tenue; con marca se tiñe del color del veredicto.
  const borde = marca && m > 0.5 ? (no ? 'rgba(255,77,77,0.55)' : 'rgba(46,204,113,0.55)') : 'rgba(245,196,81,0.35)';
  const r = lado / 2, d = r * 0.62;
  return (
    <div style={{ position: 'relative', flex: 'none', width: lado, height: lado }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: no && m > 0 ? `rgba(255,77,77,${0.1 * Math.min(1, m)})` : 'rgba(245,196,81,0.10)',
        border: `2px solid ${borde}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: no ? 1 - 0.5 * Math.min(1, m) : 1, filter: no && m > 0 ? `grayscale(${0.6 * Math.min(1, m)})` : undefined }}>
          <Icono nombre={nombre} tamano={icono} />
        </div>
      </div>
      {no && m > 0 && (
        <svg width={lado} height={lado} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={r - d} y1={r - d} x2={r - d + 2 * d * Math.min(1, m)} y2={r - d + 2 * d * Math.min(1, m)} stroke={PALETA.rojo} strokeWidth={Math.max(5, lado * 0.055)} strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
        </svg>
      )}
      {marca && m > 0 && (
        <div style={{ position: 'absolute', right: -insignia * 0.22, top: -insignia * 0.22, width: insignia, height: insignia, borderRadius: '50%', background: colorMarca,
          border: `3px solid ${PALETA.fondo}`, boxShadow: '0 4px 10px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${m})`, opacity: Math.min(1, m * 2) }}>
          <svg width={insignia * 0.6} height={insignia * 0.6} viewBox="0 0 24 24">
            {no
              ? <path d="M6 6 L18 18 M18 6 L6 18" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
              : <path d="M5 12.5 L10 17.5 L19 7" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </svg>
        </div>
      )}
    </div>
  );
};

/** Avance (resorte con un pequeño rebote) de la insignia de un ítem que entró en `desdeItem` (frame local). */
export const avanceMarca = (frame: number, desdeItem: number, fps: number) =>
  spring({ frame: frame - desdeItem - Math.round(RETARDO_MARCA * fps), fps, config: { damping: 10, stiffness: 220 } });

/**
 * Lista de 2–6 conceptos con icono: vertical con 2–4 ítems (icono grande + texto + valor dorado), cuadrícula con
 * 5–6 (3 columnas si el panel es ancho, 2 si es angosto). Cada ítem entra con un resorte en su frame LOCAL
 * (`itemsFrame[k]`, resuelto por el plan desde `dice` o repartido en la escena). `frame` es local (0 = entra el visual).
 */
export const Iconos: React.FC<{ v: VisualIconos; ancho: number; alto: number; frame: number; fps: number; itemsFrame: number[] }> = ({ v, ancho, alto, frame, fps, itemsFrame }) => {
  const n = v.items.length;
  const completo = ancho >= 1200;
  // `completo`: 4–6 ítems en 2 columnas de filas horizontales (tipografía grande); `dividido`: columna (2–4) o cuadrícula de tarjetas (5–6).
  const dosCols = completo && n >= 4;
  const grilla = n >= 5 && !completo;
  const cols = grilla ? 2 : dosCols ? 2 : 1;
  const filas = Math.ceil(n / cols);
  const altoTitulo = v.titulo ? 84 : 0;
  const disponible = alto - altoTitulo;
  const altoFila = Math.min(grilla ? 230 : 170, disponible / filas);
  const icono = Math.round(Math.min(grilla ? 110 : 120, altoFila * (grilla ? 0.48 : 0.72)));
  const fsTexto = completo ? Math.round(Math.min(54, altoFila * (dosCols ? 0.34 : 0.4))) : Math.round(Math.min(grilla ? 40 : 52, altoFila * 0.3));
  const fsValor = completo ? Math.round(fsTexto * 0.82) : Math.round(fsTexto * 1.05);
  const anchoCol = grilla ? ancho / cols : dosCols ? Math.min(ancho / 2, 700) : completo ? Math.min(ancho, 1120) : Math.min(ancho, 1150);
  const anchoBloque = grilla ? ancho : dosCols ? anchoCol * 2 : anchoCol;
  const eTitulo = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ position: 'relative', width: ancho, height: alto, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {v.titulo && (
        <div style={{ height: altoTitulo, display: 'flex', alignItems: 'center', fontFamily: TIPO.display, fontWeight: 800, fontSize: 54, color: PALETA.tinta,
          letterSpacing: -0.5, opacity: Math.min(1, eTitulo * 1.4), transform: `translateY(${(1 - eTitulo) * 16}px)` }}>{v.titulo}</div>
      )}
      <div style={{ flex: 1, width: anchoBloque, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
        {v.items.map((it, k) => {
          const e = spring({ frame: frame - (itemsFrame[k] ?? 0), fps, config: { damping: 14, stiffness: 170 } });
          const visible = Math.min(1, e * 1.4);
          const em = it.marca ? avanceMarca(frame, itemsFrame[k] ?? 0, fps) : 0;
          const colorTexto = it.marca === 'no' && em > 0.5 ? PALETA.tintaSuave : PALETA.tinta;
          if (frame < (itemsFrame[k] ?? 0)) return <div key={k} style={{ width: grilla || dosCols ? anchoCol : '100%', height: altoFila }} />;
          const contenido = grilla ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <CirculoIcono nombre={it.icono} lado={icono * 1.45} icono={icono} marca={it.marca} em={em} />
              <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTexto, color: colorTexto, lineHeight: 1.05, maxWidth: anchoCol - 30 }}>{it.texto}</div>
              {it.valor && <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsValor, color: PALETA.dorado, lineHeight: 1 }}>{it.valor}</div>}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: completo ? 28 : 34, width: '100%', paddingLeft: completo ? 0 : 10 }}>
              <CirculoIcono nombre={it.icono} lado={icono * 1.4} icono={icono} marca={it.marca} em={em} />
              <div style={{ flex: 1, fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTexto, color: colorTexto, lineHeight: 1.05, letterSpacing: -0.5 }}>{it.texto}</div>
              {it.valor && <div style={{ flex: 'none', fontFamily: TIPO.display, fontWeight: 800, fontSize: completo ? fsValor : fsValor * 1.15, color: PALETA.dorado, fontVariantNumeric: 'tabular-nums' }}>{it.valor}</div>}
            </div>
          );
          return (
            <div key={k} style={{ width: grilla || dosCols ? anchoCol : '100%', height: altoFila, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: visible, transform: `translateX(${grilla ? 0 : (1 - e) * -40}px) translateY(${grilla ? (1 - e) * 30 : 0}px) scale(${0.9 + 0.1 * e})` }}>
              {contenido}
            </div>
          );
        })}
      </div>
    </div>
  );
};
