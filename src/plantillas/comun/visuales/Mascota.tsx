import React from 'react';
import { Img, interpolate, spring, staticFile } from 'remotion';
import { FORMATO_LARGO, PALETA, TIPO } from '../../../marca/tokens';
import type { Mascota as TipoMascota, PoseMascota } from '../visual';

const S = FORMATO_LARGO.seguro;
const LADO = 220;
/**
 * Caja (px, 1920×1080) que ocupa la mascota: esquina inferior izquierda, dentro de la zona segura, a la izquierda de
 * los subtítulos (2–4 palabras centradas en x = 960, nunca llegan a x < 400). El contenido de la escena se acorta
 * para terminar sobre `y` (Tesis lo hace) y el bocadillo va a la derecha de la cabeza, sobre la línea de subtítulos.
 */
export const MASCOTA_ZONA = { x: S.lados, y: FORMATO_LARGO.alto - S.abajo - LADO, ancho: LADO, alto: LADO } as const;
/** Caja del bocadillo (a la derecha de la cabeza; termina sobre los subtítulos, que empiezan en y ≈ 950). */
export const BOCADILLO_ZONA = { x: MASCOTA_ZONA.x + LADO + 6, y: MASCOTA_ZONA.y - 4, anchoMax: 430 } as const;

/** Dibujo de reserva (mientras no existan public/mascota/<pose>.png): ardilla geométrica; cambia cola y brazos por pose. */
export const ArdillaSvg: React.FC<{ pose: PoseMascota; tamano: number; t: number }> = ({ pose, tamano, t }) => {
  const balanceo = Math.sin(t * 3) * 4;
  const cola: Record<PoseMascota, string> = {
    saluda: 'M70 150 q-60 -10 -52 -70 q6 -44 46 -40 q-26 20 -10 52 q10 22 28 34 Z',
    senala: 'M70 150 q-62 0 -58 -62 q4 -40 42 -38 q-22 22 -6 52 q10 20 32 30 Z',
    piensa: 'M70 150 q-50 -26 -40 -80 q8 -36 40 -30 q-20 26 -6 56 q6 14 16 28 Z',
    sorpresa: 'M70 150 q-64 -30 -50 -104 q8 -22 30 -14 q-14 40 0 72 q8 18 30 30 Z',
    'tapa-ojos': 'M70 150 q-58 6 -60 -50 q0 -36 34 -36 q-18 22 -4 46 q12 18 30 30 Z',
    celebra: 'M70 150 q-66 -16 -54 -86 q8 -30 38 -26 q-22 30 -6 58 q10 18 32 28 Z',
  };
  const brazos: Record<PoseMascota, React.ReactNode> = {
    saluda: <><path d={`M138 120 L170 ${78 + balanceo}`} /><path d="M92 128 L80 150" /></>,
    senala: <><path d="M136 126 L182 112" /><path d="M92 128 L80 150" /></>,
    piensa: <><path d="M134 128 L128 96 L118 86" /><path d="M92 128 L80 150" /></>,
    sorpresa: <><path d="M138 118 L162 86" /><path d="M90 118 L66 86" /></>,
    'tapa-ojos': <><path d="M134 124 L124 78" /><path d="M96 124 L106 78" /></>,
    celebra: <><path d={`M138 116 L160 ${70 + balanceo}`} /><path d={`M90 116 L68 ${70 - balanceo}`} /></>,
  };
  const ojosTapados = pose === 'tapa-ojos';
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 220 220" style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.55))' }}>
      <path d={cola[pose]} fill={PALETA.rojo} stroke="#B83232" strokeWidth={4} transform={`rotate(${balanceo * 0.5} 70 150)`} />
      <ellipse cx="114" cy="150" rx="46" ry="52" fill={PALETA.dorado} />
      <ellipse cx="114" cy="162" rx="26" ry="30" fill="#FBE3A4" />
      <circle cx="114" cy="84" r="38" fill={PALETA.dorado} />
      <path d="M86 58 L84 30 L104 50 Z M142 58 L144 30 L124 50 Z" fill={PALETA.dorado} />
      {!ojosTapados && <><circle cx="100" cy="80" r="7" fill={PALETA.fondo} /><circle cx="128" cy="80" r="7" fill={PALETA.fondo} />
        <circle cx="102" cy="78" r="2.5" fill="#FFF" /><circle cx="130" cy="78" r="2.5" fill="#FFF" /></>}
      {pose === 'sorpresa' ? <ellipse cx="114" cy="102" rx="6" ry="8" fill={PALETA.fondo} /> : <path d="M104 98 q10 8 20 0" stroke={PALETA.fondo} strokeWidth={4} fill="none" strokeLinecap="round" />}
      <g stroke={PALETA.dorado} strokeWidth={14} strokeLinecap="round" fill="none">{brazos[pose]}</g>
      <path d="M96 196 h14 M118 196 h14" stroke="#C99A2E" strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};

/**
 * La mascota comenta (no explica): entra con resorte en `desde` (cuando la voz dice `dice`), con bocadillo corto que
 * aparece 0,3 s después; se va en los últimos 0,3 s del bloque. Usa public/mascota/<pose>.png si está en
 * `posesDisponibles`; si no, el dibujo de reserva (el render nunca rompe por una imagen que falta).
 */
export const MascotaEnPantalla: React.FC<{ m: TipoMascota; frame: number; desde: number; hasta: number; fps: number; posesDisponibles: readonly string[] }> = ({ m, frame, desde, hasta, fps, posesDisponibles }) => {
  if (frame < desde || frame >= hasta) return null;
  const local = frame - desde;
  const e = spring({ frame: local, fps, config: { damping: 11, stiffness: 160 } });
  const sale = interpolate(frame, [hasta - Math.round(0.3 * fps), hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const eb = spring({ frame: local - Math.round(0.3 * fps), fps, config: { damping: 14, stiffness: 190 } });
  const conImagen = posesDisponibles.includes(m.pose);
  const respira = 1 + 0.015 * Math.sin(local / 9);
  const Z = MASCOTA_ZONA, B = BOCADILLO_ZONA;
  return (
    <>
      <div style={{ position: 'absolute', left: Z.x, top: Z.y, width: Z.ancho, height: Z.alto, opacity: 1 - sale,
        transform: `translateY(${(1 - e) * 120 + sale * 40}px) scale(${respira})`, transformOrigin: '50% 100%' }}>
        {conImagen
          ? <Img src={staticFile(`mascota/${m.pose}.png`)} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center bottom', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.55))' }} />
          : <ArdillaSvg pose={m.pose} tamano={Z.ancho} t={local / fps} />}
      </div>
      {m.bocadillo && local >= Math.round(0.3 * fps) && (
        <div style={{ position: 'absolute', left: B.x, top: B.y, maxWidth: 404, opacity: Math.min(1, eb * 1.5) * (1 - sale),
          transform: `scale(${0.7 + 0.3 * eb})`, transformOrigin: '0% 70%' }}>
          <div style={{ position: 'relative', background: 'rgba(255,255,255,0.96)', color: PALETA.fondo, borderRadius: 22, width: 'max-content', maxWidth: 404, padding: '12px 22px 14px', fontFamily: TIPO.display, fontWeight: 800,
            fontSize: m.bocadillo.length > 34 ? 24 : m.bocadillo.length > 28 ? 27 : 30, lineHeight: 1.12, boxShadow: '0 10px 26px rgba(0,0,0,0.5)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {m.bocadillo}
          </div>
          {/* Cola del bocadillo hacia la cabeza (a la izquierda, abajo). */}
          <svg width={34} height={30} style={{ position: 'absolute', left: -20, top: 44 }} viewBox="0 0 34 30"><path d="M34 2 L0 22 L30 26 Z" fill="rgba(255,255,255,0.96)" /></svg>
        </div>
      )}
    </>
  );
};
