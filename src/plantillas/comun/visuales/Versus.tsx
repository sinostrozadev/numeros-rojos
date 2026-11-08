import React from 'react';
import { spring } from 'remotion';
import { PALETA, TIPO } from '../../../marca/tokens';
import type { VisualVersus } from '../visual';
import { banderaEmoji, nombreCorto } from './banderas';
import { CirculoIcono, avanceMarca } from './Iconos';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Bandera de un país (ISO3) a `tamano` px de alto: emoji de Noto Color Emoji (la dibuja Chrome de Remotion); si el
 * país no está en la tabla, una placa sobria con el código.
 */
export const Bandera: React.FC<{ iso: string; tamano: number; sombra?: boolean }> = ({ iso, tamano, sombra = true }) => {
  const e = banderaEmoji(iso);
  if (!e) {
    return (
      <div style={{ width: tamano * 1.4, height: tamano, borderRadius: tamano * 0.12, border: `3px solid ${PALETA.tintaSuave}`, background: PALETA.fondo2, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: TIPO.condensada, fontSize: tamano * 0.55, color: PALETA.tinta, letterSpacing: 2 }}>{iso.toUpperCase()}</div>
    );
  }
  return (
    <span style={{ fontFamily: TIPO.emoji, fontSize: tamano, lineHeight: 1, display: 'inline-block', height: tamano, filter: sombra ? 'drop-shadow(0 5px 10px rgba(0,0,0,0.6))' : undefined }}>{e}</span>
  );
};

/** Ficha de apuesta (ficha de casino dorada): canto con muescas que gira mientras rueda; el texto queda derecho. */
const Ficha: React.FC<{ diametro: number; texto: string; giro: number; fs?: number }> = ({ diametro, texto, giro, fs: fsPedido }) => {
  const r = diametro / 2;
  const muescas = 8;
  const fs = fsPedido ?? Math.round(diametro * (texto.length > 12 ? 0.135 : 0.16));
  const relleno = fsPedido ? diametro * 0.1 : diametro * 0.22;
  return (
    <div style={{ position: 'relative', width: diametro, height: diametro, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.6))' }}>
      <svg width={diametro} height={diametro} viewBox={`0 0 ${diametro} ${diametro}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="ficha-oro" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE29A" />
            <stop offset="65%" stopColor={PALETA.dorado} />
            <stop offset="100%" stopColor="#C99A2E" />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={r - 2} fill="url(#ficha-oro)" stroke="#8A6516" strokeWidth={3} />
        <g transform={`rotate(${giro} ${r} ${r})`}>
          {Array.from({ length: muescas }, (_, i) => (
            <rect key={i} x={r - diametro * 0.05} y={4} width={diametro * 0.1} height={diametro * 0.11} rx={3} fill={PALETA.fondo} opacity={0.85}
              transform={`rotate(${(360 / muescas) * i} ${r} ${r})`} />
          ))}
        </g>
        <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke={PALETA.fondo} strokeOpacity={0.55} strokeWidth={2.5} strokeDasharray="6 6" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: relleno,
        fontFamily: TIPO.display, fontWeight: 800, fontSize: fs, lineHeight: 1.0, color: PALETA.fondo, textTransform: 'uppercase', letterSpacing: -0.3 }}>{texto}</div>
    </div>
  );
};

/**
 * VERSUS v3: dos columnas (una por país) con bandera grande + nombre arriba e ítems que entran cuando la voz los nombra,
 * con insignia ✓/✗ (misma lógica que `Iconos`). Separador "VS" sobrio al centro. `apuesta`: desde `apuestaFrame` una
 * ficha dorada nace al centro y rueda hasta debajo de la columna de `apuesta.pais`, que se enciende (borde dorado)
 * mientras la otra baja a 0,6. `frame` e `itemsFrame` (lado 0 y luego lado 1, en orden) son LOCALES (0 = entra el visual).
 * Pensado para 1560–1820 px de ancho (completo) y 800 (dividido).
 */
export const Versus: React.FC<{ v: VisualVersus; ancho: number; alto: number; frame: number; fps: number; itemsFrame: number[]; apuestaFrame?: number }> = ({ v, ancho, alto, frame, fps, itemsFrame, apuestaFrame }) => {
  const completo = ancho >= 1200;
  const altoTitulo = v.titulo ? (completo ? 76 : 60) : 0;
  const separacion = completo ? 150 : 64;
  const anchoCol = Math.min(completo ? 760 : 400, (ancho - separacion) / 2);
  const anchoBloque = anchoCol * 2 + separacion;
  // Completo: bandera y nombre en una fila (cabecera baja, más alto para los ítems); dividido: apilados.
  const tamBandera = completo ? 84 : 68;
  const fsNombre = completo ? 58 : 36;
  const altoCabecera = completo ? 124 : tamBandera + fsNombre * 1.1 + 24;
  const diamFicha = completo ? 178 : 136;
  const fsFicha = completo ? 30 : undefined;
  const conApuesta = !!v.apuesta && apuestaFrame !== undefined;
  // La ficha queda montada en el borde inferior de la columna (mitad dentro, mitad fuera): se reserva ~55 % de su
  // diámetro bajo la tarjeta y otro tanto de relleno al pie de los ítems para que nunca tape el último.
  const reservaFicha = v.apuesta ? diamFicha * 0.56 : 0;
  const rellenoFicha = v.apuesta ? diamFicha * 0.5 : 0;
  const altoCol = alto - altoTitulo - reservaFicha;
  const maxN = Math.max(v.lados[0].items.length, v.lados[1].items.length);
  const areaItems = altoCol - altoCabecera - (completo ? 30 : 20) - rellenoFicha;
  const altoFila = Math.min(completo ? 124 : 86, areaItems / maxN);
  const lado = Math.round(Math.min(completo ? 100 : 62, altoFila * 0.86));
  const icono = Math.round(lado * (completo ? 0.66 : 0.62));
  // Las filas se alinean entre columnas (misma altura, desde arriba), centradas como bloque del lado más largo.
  const rellenoArriba = Math.max(0, (areaItems - maxN * altoFila) / 2);
  const anchoTexto = anchoCol - lado - (completo ? 28 + 40 : 18 + 26);
  const fsBase = completo ? 44 : 30;

  const eTitulo = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const ladoGanador = conApuesta ? v.lados.findIndex((l) => l.pais === v.apuesta!.pais) : -1;
  const pApuesta = conApuesta ? clamp01((frame - apuestaFrame!) / (0.5 * fps)) : 0;
  const yTarjetas = altoTitulo;

  // Ficha: nace al centro (pop 0,3 s) y rueda con resorte hasta el centro de la columna elegida.
  let ficha: React.ReactNode = null;
  if (conApuesta && frame >= apuestaFrame! && ladoGanador >= 0) {
    const local = frame - apuestaFrame!;
    const pop = spring({ frame: local, fps, config: { damping: 12, stiffness: 200 } });
    const desliza = spring({ frame: local - Math.round(0.35 * fps), fps, config: { damping: 15, stiffness: 90 } });
    const xCentro = ancho / 2;
    const xCol = (ancho - anchoBloque) / 2 + (ladoGanador === 0 ? anchoCol / 2 : anchoCol * 1.5 + separacion);
    const x = xCentro + (xCol - xCentro) * desliza;
    const yFinal = yTarjetas + altoCol;
    const yInicio = yTarjetas + altoCol * 0.55;
    const y = yInicio + (yFinal - yInicio) * desliza;
    // Rueda: el canto gira lo que recorre (perímetro), el texto queda derecho.
    const giro = ((x - xCentro) / (Math.PI * diamFicha)) * 360;
    ficha = (
      <div style={{ position: 'absolute', left: x - diamFicha / 2, top: y - diamFicha / 2, transform: `scale(${0.2 + 0.8 * pop})`, opacity: Math.min(1, pop * 2), zIndex: 5 }}>
        <Ficha diametro={diamFicha} texto={v.apuesta!.texto ?? 'LA APUESTA'} giro={giro} fs={fsFicha} />
      </div>
    );
  }

  let base = 0;
  const columnas = v.lados.map((l, li) => {
    const offset = base;
    base += l.items.length;
    const eCab = spring({ frame: frame - li * Math.round(0.15 * fps), fps, config: { damping: 16, stiffness: 150 } });
    const gana = ladoGanador === li, pierde = ladoGanador >= 0 && !gana;
    const brillo = gana ? pApuesta : 0;
    const opacidad = pierde ? 1 - 0.4 * pApuesta : 1;
    const nombre = l.titulo ?? nombreCorto(l.pais);
    return (
      <div key={li} style={{ position: 'relative', width: anchoCol, height: altoCol, borderRadius: 22, background: `rgba(27,32,39,${0.55 + 0.2 * brillo})`,
        border: `${2 + 2 * brillo}px solid ${brillo > 0 ? `rgba(245,196,81,${0.3 + 0.7 * brillo})` : PALETA.borde}`,
        boxShadow: brillo > 0 ? `0 0 ${40 * brillo}px rgba(245,196,81,${0.25 * brillo})` : undefined,
        opacity: opacidad * Math.min(1, eCab * 1.5), transform: `translateY(${(1 - eCab) * 24}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ height: altoCabecera, display: 'flex', flexDirection: completo ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: completo ? 22 : 4, flex: 'none' }}>
          <Bandera iso={l.pais} tamano={tamBandera} />
          <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsNombre, lineHeight: 1.05, color: gana && brillo > 0.5 ? PALETA.dorado : PALETA.tinta, letterSpacing: -0.5,
            whiteSpace: 'nowrap', maxWidth: anchoCol - 24 - (completo ? tamBandera * 1.2 + 22 : 0), overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombre}</div>
        </div>
        <div style={{ width: anchoCol - (completo ? 56 : 28), height: 2, background: PALETA.borde, flex: 'none' }} />
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: completo ? '6px 28px' : '4px 14px', paddingTop: (completo ? 6 : 4) + rellenoArriba, paddingBottom: (completo ? 6 : 4) + rellenoFicha }}>
          {l.items.map((it, k) => {
            const desde = itemsFrame[offset + k] ?? 0;
            if (frame < desde) return <div key={k} style={{ height: altoFila, flex: 'none' }} />;
            const e = spring({ frame: frame - desde, fps, config: { damping: 14, stiffness: 170 } });
            const em = it.marca ? avanceMarca(frame, desde, fps) : 0;
            // Texto: una línea si cabe a tamaño base; si no, se achica (piso 0,72) y puede ir a 2 líneas.
            const cabe = anchoTexto / (it.texto.length * 0.5);
            const fs = Math.round(Math.max(fsBase * 0.72, Math.min(fsBase, cabe, altoFila * 0.46)));
            return (
              <div key={k} style={{ height: altoFila, flex: 'none', display: 'flex', alignItems: 'center', gap: completo ? 28 : 18,
                opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - e) * (li === 0 ? -36 : 36)}px) scale(${0.92 + 0.08 * e})` }}>
                <CirculoIcono nombre={it.icono} lado={lado} icono={icono} marca={it.marca} em={em} />
                <div style={{ flex: 1, minWidth: 0, fontFamily: TIPO.display, fontWeight: 800, fontSize: fs, lineHeight: 1.02, letterSpacing: -0.4,
                  color: it.marca === 'no' && em > 0.5 ? PALETA.tintaSuave : PALETA.tinta, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.texto}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  // Separador: línea vertical tenue con "VS" a la altura de las banderas.
  const eVs = spring({ frame: frame - Math.round(0.25 * fps), fps, config: { damping: 14, stiffness: 180 } });
  const diamVs = completo ? 92 : 62;
  const pierdeOpac = ladoGanador >= 0 ? 1 - 0.3 * pApuesta : 1;
  return (
    <div style={{ position: 'relative', width: ancho, height: alto }}>
      {v.titulo && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: ancho, height: altoTitulo, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TIPO.display, fontWeight: 800, fontSize: completo ? 52 : 38, color: PALETA.tinta, letterSpacing: -0.5,
          opacity: Math.min(1, eTitulo * 1.4), transform: `translateY(${(1 - eTitulo) * 16}px)` }}>{v.titulo}</div>
      )}
      <div style={{ position: 'absolute', left: (ancho - anchoBloque) / 2, top: yTarjetas, width: anchoBloque, height: altoCol, display: 'flex', justifyContent: 'space-between' }}>
        {columnas[0]}
        <div style={{ position: 'relative', width: separacion, height: altoCol, opacity: pierdeOpac }}>
          <div style={{ position: 'absolute', left: separacion / 2 - 1, top: 20, bottom: 20, width: 2,
            background: `linear-gradient(to bottom, transparent, ${PALETA.borde} 15%, ${PALETA.borde} 85%, transparent)`, transform: `scaleY(${eVs})` }} />
          <div style={{ position: 'absolute', left: separacion / 2 - diamVs / 2, top: altoCabecera / 2 - diamVs / 2, width: diamVs, height: diamVs, borderRadius: '50%',
            background: PALETA.fondo, border: `2px solid ${PALETA.tintaSuave}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: TIPO.condensada, fontSize: diamVs * 0.5, letterSpacing: 2, color: PALETA.tintaSuave, transform: `scale(${eVs})`, paddingTop: diamVs * 0.04 }}>VS</div>
        </div>
        {columnas[1]}
      </div>
      {ficha}
    </div>
  );
};
