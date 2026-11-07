import React, { useMemo } from 'react';
import { Easing, interpolate } from 'remotion';
import { geoGraticule10, geoInterpolate, geoPath } from 'd3-geo';
import type { z } from 'zod';
import { PALETA, SERIES_GRAFICO, TIPO } from '../../../marca/tokens';
import type { VisualMapa as EsquemaMapa } from '../visual';
import { centroPais, encuadre, nombrePais, paisesGeo, proyeccion, tipoProyeccion, ubicarEtiquetas, type Camara, type LonLat } from './mapa';

export type VisualMapa = z.infer<typeof EsquemaMapa>;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Segundos del viaje de cámara cuando `acercar`. */
const T_CAMARA = 2;
/** Cuánto tarda en dibujarse una flecha y cuánto se separan entre sí. */
const T_FLECHA = 1.4, PASO_FLECHA = 0.55;
const ALTO_PIE = 40;

/** Color de cada país destacado: el primero dorado, el resto en el orden de SERIES_GRAFICO. */
export const colorDestacado = (k: number) => (k === 0 ? PALETA.dorado : SERIES_GRAFICO[(k - 1) % SERIES_GRAFICO.length]);

/**
 * Mapa de países (Natural Earth vía world-atlas, dominio público) en un panel de `ancho` × `alto` px: los no
 * destacados en gris con borde fino, los destacados en los colores de las series (el primero en dorado) con su
 * nombre en español; etiquetas sueltas; flechas por el círculo máximo que se dibujan con el tiempo. Si `acercar`,
 * la cámara va de zoom − 2 al zoom final en los primeros 2 s (una sola interpolación suave). `frame` es local
 * (0 = el mapa entra).
 */
export const Mapa: React.FC<{ v: VisualMapa; ancho: number; alto: number; frame: number; fps: number }> = ({ v, ancho, alto, frame, fps }) => {
  const altoMapa = alto - ALTO_PIE;
  const auto = useMemo(() => encuadre(v.destacar, ancho, altoMapa), [v.destacar, ancho, altoMapa]);
  const final: Camara = { centro: (v.centro as LonLat | undefined) ?? auto.centro, zoom: v.zoom ?? auto.zoom };
  const zoomInicial = Math.max(0.8, final.zoom - 2);
  const zoom = v.acercar
    ? interpolate(frame, [0, T_CAMARA * fps], [zoomInicial, final.zoom], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
    : final.zoom;
  // La geometría se recalcula solo cuando cambia la cámara (con la cámara quieta, una vez).
  const zoomClave = +zoom.toFixed(4);
  const geo = useMemo(() => {
    const proy = proyeccion({ centro: final.centro, zoom: zoomClave }, ancho, altoMapa);
    const camino = geoPath(proy);
    const paises = paisesGeo().map((p) => ({ iso: p.iso, d: camino(p.f) ?? '' })).filter((p) => p.d);
    const reja = camino(geoGraticule10()) ?? '';
    const esfera = tipoProyeccion(final.centro) === 'ortografica' ? camino({ type: 'Sphere' }) ?? '' : '';
    const centros = v.destacar.map((iso) => {
      const c = centroPais(iso);
      const pt = c ? proy(c) : null;
      return pt ? { iso, x: pt[0], y: pt[1] } : null;
    });
    const sueltas = (v.etiquetas ?? []).map((e) => { const pt = proy(e.en as LonLat); return pt ? { texto: e.texto, x: pt[0], y: pt[1] } : null; });
    const flechas = (v.flechas ?? []).map((fl) => {
      const a = centroPais(fl.desde), b = centroPais(fl.hasta);
      if (!a || !b) return null;
      const interp = geoInterpolate(a, b);
      const pts: [number, number][] = [];
      for (let i = 0; i <= 64; i++) { const p = proy(interp(i / 64)); if (p && Number.isFinite(p[0])) pts.push([p[0], p[1]]); }
      if (pts.length < 2) return null;
      let largo = 0;
      for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      return { pts, largo, texto: fl.texto };
    });
    return { paises, reja, esfera, centros, sueltas, flechas };
  }, [final.centro[0], final.centro[1], zoomClave, ancho, altoMapa, v]);

  const destacados = new Map(v.destacar.map((iso, k) => [iso, k]));
  const entradaPais = (k: number) => clamp01((frame - (0.3 + 0.25 * k) * fps) / (0.5 * fps));
  const fsPais = 30, fsSuelta = 24, fsFlecha = 26;
  // Etiquetas: países destacados primero (más importantes), luego las sueltas; anticolisión.
  const pedidas = [
    ...geo.centros.map((c, k) => (c ? { texto: nombrePais(v.destacar[k]).toUpperCase(), x: c.x, y: c.y, fs: fsPais, k, tipo: 'pais' as const } : null)),
    ...geo.sueltas.map((s) => (s ? { texto: s.texto, x: s.x, y: s.y, fs: fsSuelta, k: -1, tipo: 'suelta' as const } : null)),
  ].filter((x): x is NonNullable<typeof x> => !!x);
  const cajas = ubicarEtiquetas(pedidas.map((p) => {
    const w = p.texto.length * p.fs * (p.tipo === 'pais' ? 0.5 : 0.56) + 28, h = p.fs * 1.5;
    return { x: p.x - w / 2, y: p.tipo === 'pais' ? p.y - h / 2 : p.y - h - 10, w, h };
  }), ancho, altoMapa);

  return (
    <div style={{ position: 'relative', width: ancho, height: alto }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: ancho, height: altoMapa, borderRadius: 22, overflow: 'hidden', border: `2px solid ${PALETA.borde}`, background: 'rgba(27,32,39,0.35)' }}>
        <svg width={ancho} height={altoMapa} style={{ position: 'absolute', inset: 0 }}>
          {geo.esfera && <path d={geo.esfera} fill="rgba(79,163,247,0.05)" stroke={PALETA.borde} strokeWidth={2} />}
          <path d={geo.reja} fill="none" stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={1} />
          {geo.paises.map((p, i) => {
            const k = p.iso !== undefined ? destacados.get(p.iso) : undefined;
            if (k === undefined) return <path key={i} d={p.d} fill={PALETA.borde} stroke="#46505C" strokeWidth={0.8} />;
            return null;
          })}
          {geo.paises.map((p, i) => {
            const k = p.iso !== undefined ? destacados.get(p.iso) : undefined;
            if (k === undefined) return null;
            const e = entradaPais(k);
            const col = colorDestacado(k);
            return <path key={`d${i}`} d={p.d} fill={col} fillOpacity={0.25 + 0.7 * e} stroke={col} strokeWidth={1.6} />;
          })}
          {geo.flechas.map((fl, i) => {
            if (!fl) return null;
            const t0 = (0.9 + i * PASO_FLECHA) * fps;
            const pr = interpolate(frame, [t0, t0 + T_FLECHA * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
            if (pr <= 0) return null;
            const d = fl.pts.map((p, j) => `${j ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
            // Punta: en el punto alcanzado del recorrido.
            const objetivo = pr * fl.largo;
            let acum = 0, j = 1;
            for (; j < fl.pts.length; j++) { const s = Math.hypot(fl.pts[j][0] - fl.pts[j - 1][0], fl.pts[j][1] - fl.pts[j - 1][1]); if (acum + s >= objetivo) break; acum += s; }
            j = Math.min(j, fl.pts.length - 1);
            const [ax, ay] = fl.pts[j - 1], [bx, by] = fl.pts[j];
            const seg = Math.hypot(bx - ax, by - ay) || 1;
            const u = Math.max(0, Math.min(1, (objetivo - acum) / seg));
            const px = ax + (bx - ax) * u, py = ay + (by - ay) * u;
            const ang = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
            return (
              <g key={`f${i}`}>
                <path d={d} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${objetivo} ${fl.largo + 10}`} />
                <path d={d} fill="none" stroke={PALETA.tinta} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${objetivo} ${fl.largo + 10}`} />
                <g transform={`translate(${px},${py}) rotate(${ang})`}><path d="M6 0 L-16 -11 L-11 0 L-16 11 Z" fill={PALETA.tinta} stroke="rgba(0,0,0,0.5)" strokeWidth={1.5} /></g>
              </g>
            );
          })}
        </svg>
        {/* Texto de cada flecha, a mitad del arco, cuando la flecha ya pasó por ahí. */}
        {geo.flechas.map((fl, i) => {
          if (!fl?.texto) return null;
          const t0 = (0.9 + i * PASO_FLECHA + T_FLECHA * 0.55) * fps;
          const e = clamp01((frame - t0) / (0.35 * fps));
          if (e <= 0) return null;
          const m = fl.pts[Math.floor(fl.pts.length / 2)];
          return (
            <div key={`ft${i}`} style={{ position: 'absolute', left: m[0], top: m[1] - 52, transform: `translateX(-50%) scale(${0.85 + 0.15 * e})`, opacity: e,
              background: PALETA.tinta, color: PALETA.fondo, borderRadius: 10, padding: '4px 14px', fontFamily: TIPO.texto, fontWeight: 800, fontSize: fsFlecha,
              whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{fl.texto}</div>
          );
        })}
        {pedidas.map((p, i) => {
          const c = cajas[i];
          if (!c) return null;
          const e = p.tipo === 'pais' ? entradaPais(p.k) : clamp01((frame - 0.8 * fps) / (0.4 * fps));
          if (e <= 0) return null;
          const col = p.tipo === 'pais' ? colorDestacado(p.k) : PALETA.tintaSuave;
          return (
            <div key={`e${i}`} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: e, fontFamily: p.tipo === 'pais' ? TIPO.condensada : TIPO.texto, fontWeight: p.tipo === 'pais' ? 400 : 700, fontSize: p.tipo === 'pais' ? p.fs * 1.15 : p.fs,
              letterSpacing: p.tipo === 'pais' ? 1.5 : 0.3, color: p.tipo === 'pais' ? PALETA.fondo : PALETA.tinta,
              background: p.tipo === 'pais' ? col : 'rgba(17,20,24,0.78)', borderRadius: 8, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,0,0,0.45)' }}>
              {p.texto}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 4, bottom: 0, height: ALTO_PIE - 8, display: 'flex', alignItems: 'flex-end', fontFamily: TIPO.texto, fontWeight: 500, fontSize: 21, color: PALETA.tintaSuave, opacity: 0.85 }}>
        Mapa: Natural Earth (dominio público)
      </div>
    </div>
  );
};
