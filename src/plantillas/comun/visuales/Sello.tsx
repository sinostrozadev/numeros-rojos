import React from 'react';
import { interpolate, spring } from 'remotion';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { Sello as TipoSello } from '../visual';
import { Bandera } from './Versus';

export type ZonaSello = { x: number; y: number; ancho: number; alto: number };

/** Margen al borde de la zona y franja superior que se respeta (el título del gráfico, a la izquierda, ocupa hasta ~150 px). */
export const MARGEN_SELLO = 24;
const FRANJA_TITULO = 150;

/**
 * SELLO v3: un dato enorme estampado sobre el gráfico (o el visual) cuando la voz lo dice ("4×" con la bandera de
 * Chile). Entra como un timbre: escala 1,6 → 1 con un rebote corto, rotación −6° → −3° y una onda de impacto que se
 * desvanece. Por defecto dorado con texto grafito; `feliz` agrega flecha ↑; `triste` va en rojo con texto blanco y
 * flecha ↓. Se dibuja dentro de un div de `zona.ancho × zona.alto` (el padre lo posiciona en zona.x/zona.y), anclado
 * a la esquina superior DERECHA bajo la franja del título (que va arriba a la izquierda) y lejos de la fuente (abajo).
 * `frame` es local (0 = se estampa); con frame < 0 no dibuja nada.
 */
export const Sello: React.FC<{ s: TipoSello; frame: number; fps: number; zona: ZonaSello }> = ({ s, frame, fps, zona }) => {
  if (frame < 0) return null;
  const angosto = zona.ancho < 1200;
  const triste = s.animo === 'triste';
  const fondo = triste ? PALETA.rojo : PALETA.dorado;
  const tinta = triste ? PALETA.tinta : PALETA.fondo;
  const fs = angosto ? 120 : 140;
  const largo = s.texto.length;
  // Nunca más ancho que la zona: si el texto es largo, la letra baja (piso 120 px, el mínimo legible del sello).
  const fsTexto = Math.max(120, Math.min(fs, (zona.ancho * 0.8 - (s.pais ? fs : 0)) / Math.max(1, largo * 0.56)));
  const tamBandera = Math.round(fsTexto * 0.72);
  const flecha = s.animo ? Math.round(fsTexto * 0.5) : 0;

  // Estampado: resorte poco amortiguado → baja de 1,6 a ~0,96 y se asienta en 1.
  const e = spring({ frame, fps, config: { damping: 9, stiffness: 320, mass: 0.7 } });
  const escala = 1.6 - 0.6 * e;
  const rot = -6 + 3 * Math.min(1, e);
  const opacidad = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
  // Onda de impacto: aparece al tocar (≈ 4 frames) y se abre 0,4 s.
  const onda = interpolate(frame, [4, 4 + 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Franja del título: en una zona angosta (`dividido`) el título del gráfico suele ocupar dos líneas más el subtítulo, y el
  // sello le tapaba el final (visto en Chile-Corea v5, "1/3 CONTRA 1/5" sobre "Inversión en máquinas, edificios e…"): ahí
  // baja 70 px más, a la parte alta del área de trazado.
  const top = MARGEN_SELLO + Math.min(FRANJA_TITULO + (angosto ? 70 : 0), zona.alto * 0.3);

  return (
    <div style={{ position: 'relative', width: zona.ancho, height: zona.alto, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', right: MARGEN_SELLO, top, transform: `rotate(${rot}deg) scale(${escala})`, transformOrigin: '50% 50%', opacity: opacidad }}>
        {onda > 0 && onda < 1 && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 30, border: `4px solid ${fondo}`, opacity: 0.7 * (1 - onda), transform: `scale(${1 + 0.35 * onda})` }} />
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: Math.round(fsTexto * 0.16), background: fondo, color: tinta, borderRadius: 30,
          padding: `${Math.round(fsTexto * 0.08)}px ${Math.round(fsTexto * 0.24)}px`, boxShadow: '0 18px 40px rgba(0,0,0,0.6), inset 0 -6px 0 rgba(0,0,0,0.12)' }}>
          {/* Doble filete interior, como un timbre de goma. */}
          <div style={{ position: 'absolute', inset: 8, borderRadius: 23, border: `3px solid ${triste ? 'rgba(255,255,255,0.45)' : 'rgba(17,20,24,0.3)'}` }} />
          {s.pais && <div style={{ position: 'relative', background: 'rgba(17,20,24,0.18)', borderRadius: 18, padding: '4px 10px', display: 'flex' }}><Bandera iso={s.pais} tamano={tamBandera} sombra={false} /></div>}
          <div style={{ position: 'relative', fontFamily: TIPO.display, fontWeight: 800, fontSize: fsTexto, lineHeight: 1.0, letterSpacing: -2, whiteSpace: 'nowrap',
            paddingBottom: fsTexto * 0.06 }}>{s.texto}</div>
          {s.animo && (
            <svg width={flecha * 0.8} height={flecha} viewBox="0 0 40 50" style={{ position: 'relative', marginLeft: fsTexto * 0.06, marginRight: fsTexto * 0.04, transform: triste ? 'rotate(180deg)' : undefined }}>
              <path d="M20 2 L38 24 H27 V48 H13 V24 H2 Z" fill={tinta} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
