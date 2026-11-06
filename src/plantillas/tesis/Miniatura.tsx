import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PALETA, TIPO } from '../../marca/tokens';
import { cargarFuentes } from '../../marca/fuentes';
import { Logo } from '../../marca/Logo';
import { GraficoAnimado } from '../comun/graficos/GraficoAnimado';
import type { PropsTesis } from './Tesis';

/**
 * Miniatura 1280×720 del largo (`remotion still … Miniatura`): 3–5 palabras ENORMES a la izquierda (≠ título;
 * la última en dorado), el gráfico de `miniatura.grafico` (o el del gancho, o el número final) completo a la
 * derecha, una franja roja y el isotipo. Un foco visual, contraste alto, legible a 160 px de ancho.
 */
export const Miniatura: React.FC<PropsTesis> = (props) => {
  cargarFuentes();
  const g = props.miniatura.grafico ?? props.gancho.grafico ?? props.numeroQueNadieMira.grafico;
  const palabras = props.miniatura.texto.toUpperCase().split(/\s+/);
  const ultima = palabras.pop() ?? '';
  const larga = Math.max(...[...palabras, ultima].map((p) => p.length));
  const fs = Math.max(96, Math.min(150, 560 / Math.max(1, larga * 0.56)));
  return (
    <AbsoluteFill style={{ background: PALETA.fondo }}>
      <div style={{ position: 'absolute', right: 30, top: 70, width: 640, height: 600, opacity: 0.98 }}>
        <GraficoAnimado g={{ ...g, anotaciones: [] }} datos={props.datos} ancho={640} alto={600} modo="largo" progreso={1} frame={60} fps={30} sinTitulo />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 14, height: '100%', background: PALETA.rojo }} />
      <div style={{ position: 'absolute', left: 56, top: 60, width: 640, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fs, lineHeight: 0.95, letterSpacing: -3, color: PALETA.tinta, textShadow: '0 6px 24px rgba(0,0,0,0.7)' }}>
          {palabras.join(' ')}{palabras.length ? ' ' : ''}<span style={{ color: PALETA.dorado }}>{ultima}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 56, bottom: 36, display: 'flex', alignItems: 'center', gap: 12, fontFamily: TIPO.display, fontWeight: 800, fontSize: 30, color: PALETA.tinta, opacity: 0.9 }}>
        <Logo tamano={50} />En Números <span style={{ color: PALETA.rojo }}>Rojos</span>
      </div>
    </AbsoluteFill>
  );
};
