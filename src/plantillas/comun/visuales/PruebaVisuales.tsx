import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { cargarFuentes } from '../../../marca/fuentes';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { Sello as TipoSello, VisualVersus } from '../visual';
import { Iconos, type VisualIconos } from './Iconos';
import { Mapa, type VisualMapa } from './Mapa';
import { Sello } from './Sello';
import { Versus } from './Versus';

/**
 * Banco de prueba de los visuales v3 (no es un video): composición "PruebaVisuales" 1920×1080, 30 fps, 240 frames.
 * `cual` elige el caso. Zonas iguales a las de Tesis (completo 1760 × 770 en y = 150; dividido 800 de ancho).
 *   npx remotion still src/index.ts PruebaVisuales salida/pruebas/v3-versus-90.png --props='{"cual":"versus"}' --frame=90
 */
export type PropsPruebaVisuales = { cual: 'versus' | 'versus-dividido' | 'sello' | 'iconos' | 'mapa-viaje' };

const ZONA = { x: 80, y: 150, ancho: 1760, alto: 770 };
const DIVIDIDO = { x: 80, y: 150, ancho: 800, alto: 622 };

const VERSUS: VisualVersus = {
  tipo: 'versus',
  titulo: 'Dos países en 1960',
  lados: [
    { pais: 'KOR', items: [
      { icono: '🛢️', texto: 'Petróleo', marca: 'no' },
      { icono: 'lingote', texto: 'Cobre', marca: 'no' },
      { icono: 'montana', texto: 'Montañas', marca: 'si' },
    ] },
    { pais: 'CHL', items: [
      { icono: 'mina', texto: 'Minas', marca: 'si' },
      { icono: 'barco', texto: 'Puertos', marca: 'si' },
      { icono: 'tribunal', texto: 'Estado', marca: 'si' },
      { icono: 'universidad', texto: 'Universidades', marca: 'si' },
    ] },
  ],
  apuesta: { pais: 'CHL', dice: 'apostar', texto: 'La apuesta obvia' },
};
const ITEMS_FRAME = [20, 38, 56, 80, 96, 112, 128];

const ICONOS: VisualIconos = {
  tipo: 'iconos',
  titulo: 'Lo que Corea no tenía',
  items: [
    { icono: '🛢️', texto: 'Petróleo', marca: 'no' },
    { icono: 'lingote', texto: 'Cobre', marca: 'no' },
    { icono: 'montana', texto: 'Montañas', marca: 'si' },
    { icono: '🌾', texto: 'Arroz', valor: '60 %', marca: 'si' },
  ],
};

const MAPA: VisualMapa = { tipo: 'mapa', destacar: ['KOR', 'CHL'], viaje: { desde: 'KOR', hasta: 'CHL' } };

const SELLOS: { s: TipoSello; desde: number; hasta: number }[] = [
  { s: { texto: '4×', pais: 'CHL', animo: 'feliz', dice: 'cuatro' }, desde: 10, hasta: 120 },
  { s: { texto: '3 a 1', pais: 'KOR', animo: 'triste', dice: 'tres' }, desde: 130, hasta: 240 },
];

/** Gráfico falso (título arriba a la izquierda, línea, fuente abajo) para ver que el sello no tapa lo importante. */
const GraficoFalso: React.FC<{ ancho: number; alto: number }> = ({ ancho, alto }) => {
  const pts = Array.from({ length: 30 }, (_, i) => [80 + (i / 29) * (ancho - 160), alto - 120 - (i / 29) ** 1.6 * (alto - 330) - 18 * Math.sin(i)]);
  return (
    <div style={{ position: 'relative', width: ancho, height: alto }}>
      <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: 50, color: PALETA.tinta }}>PIB por persona, Chile y Corea del Sur</div>
      <div style={{ fontFamily: TIPO.texto, fontWeight: 500, fontSize: 28, color: PALETA.tintaSuave, marginTop: 6 }}>US$ de 2015 · 1960–2023</div>
      <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0 }}>
        <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('')} fill="none" stroke={PALETA.dorado} strokeWidth={6} />
        <path d={`M80 ${alto - 90} H${ancho - 80}`} stroke={PALETA.borde} strokeWidth={2} />
      </svg>
      <div style={{ position: 'absolute', left: 0, bottom: 0, fontFamily: TIPO.texto, fontSize: 21, color: PALETA.tintaSuave }}>Fuente: Banco Mundial (WDI)</div>
    </div>
  );
};

export const PruebaVisuales: React.FC<PropsPruebaVisuales> = ({ cual }) => {
  cargarFuentes();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Z = cual === 'versus-dividido' ? DIVIDIDO : ZONA;
  let cuerpo: React.ReactNode = null;
  if (cual === 'versus' || cual === 'versus-dividido') {
    cuerpo = <Versus v={VERSUS} ancho={Z.ancho} alto={Z.alto} frame={frame} fps={fps} itemsFrame={ITEMS_FRAME} apuestaFrame={150} />;
  } else if (cual === 'iconos') {
    cuerpo = <Iconos v={ICONOS} ancho={Z.ancho} alto={Z.alto} frame={frame} fps={fps} itemsFrame={[10, 30, 50, 70]} />;
  } else if (cual === 'mapa-viaje') {
    cuerpo = <Mapa v={MAPA} ancho={Z.ancho} alto={Z.alto} frame={frame} fps={fps} viajeEn={30} />;
  } else if (cual === 'sello') {
    const activo = SELLOS.find((x) => frame >= x.desde && frame < x.hasta);
    cuerpo = (
      <div style={{ position: 'relative', width: Z.ancho, height: Z.alto }}>
        <GraficoFalso ancho={Z.ancho} alto={Z.alto} />
        {activo && <div style={{ position: 'absolute', inset: 0 }}><Sello s={activo.s} frame={frame - activo.desde} fps={fps} zona={Z} /></div>}
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ background: PALETA.fondo }}>
      <div style={{ position: 'absolute', left: 80, top: 52, fontFamily: TIPO.texto, fontWeight: 700, fontSize: 26, color: PALETA.tintaSuave, letterSpacing: 3 }}>PRUEBA V3 · {cual.toUpperCase()}</div>
      <div style={{ position: 'absolute', left: Z.x, top: Z.y, width: Z.ancho, height: Z.alto }}>{cuerpo}</div>
      {cual === 'versus-dividido' && <div style={{ position: 'absolute', left: 930, top: 150, width: 910, height: 622, borderRadius: 22, border: `2px dashed ${PALETA.borde}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TIPO.texto, fontSize: 28, color: PALETA.tintaSuave }}>(gráfico)</div>}
    </AbsoluteFill>
  );
};
