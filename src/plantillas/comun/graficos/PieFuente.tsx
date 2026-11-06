import React from 'react';
import { PALETA, TIPO } from '../../../marca/tokens';

/**
 * "Fuente: …" abajo en pequeño, SIEMPRE (regla dura del canal). Si la serie es un FIXTURE de prueba se marca en
 * rojo para que nadie lo publique por error.
 */
export const PieFuente: React.FC<{ texto: string; fontSize: number; fixture?: boolean; licencia?: string; alinear?: 'left' | 'center' }> = ({ texto, fontSize, fixture, licencia, alinear = 'left' }) => (
  <div style={{
    fontFamily: TIPO.texto, fontWeight: 500, fontSize, color: fixture ? PALETA.rojo : PALETA.tintaSuave, opacity: fixture ? 1 : 0.85,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: alinear, letterSpacing: 0.2, lineHeight: 1.25,
  }}>
    {fixture ? '⚠ DATOS DE PRUEBA (FIXTURE) — NO PUBLICAR · ' : ''}Fuente: {texto.replace(/^Fuente:\s*/i, '')}{licencia && !fixture && !texto.includes(licencia.split(' (')[0]) ? ` · ${licencia}` : ''}
  </div>
);
