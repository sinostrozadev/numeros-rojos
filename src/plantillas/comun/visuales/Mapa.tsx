import React, { useMemo } from 'react';
import { Easing, interpolate } from 'remotion';
import { geoGraticule10, geoInterpolate, geoPath } from 'd3-geo';
import type { z } from 'zod';
import { PALETA, SERIES_GRAFICO, TIPO } from '../../../marca/tokens';
import type { VisualMapa as EsquemaMapa } from '../visual';
import { camaraEnViaje, centroPais, encuadre, nombrePais, paisesGeo, planViaje, proyeccion, tipoProyeccion, ubicarEtiquetas, type Camara, type LonLat } from './mapa';

export type VisualMapa = z.infer<typeof EsquemaMapa>;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Segundos del viaje de cámara cuando `acercar`. */
const T_CAMARA = 2;
/** Segundos del VIAJE v3 entre dos países (despegue, vuelo con zoom out y aterrizaje). */
export const T_VIAJE = 3;
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
 *
 * VIAJE v3 (`v.viaje`): la cámara parte quieta sobre `viaje.desde` (zoom de país) y en `viajeEn` (frame local) vuela
 * `T_VIAJE` s por el círculo máximo hasta `viaje.hasta`: el zoom baja hasta ver ambos países a mitad de camino y vuelve
 * a subir; una línea punteada dorada se dibuja tras la cámara y el país de llegada se enciende en dorado al aterrizar
 * (el de partida queda tenue). Sin `viaje`, todo igual que antes (`acercar` o cámara fija).
 */
export const Mapa: React.FC<{ v: VisualMapa; ancho: number; alto: number; frame: number; fps: number; viajeEn?: number }> = ({ v, ancho, alto, frame, fps, viajeEn = 0 }) => {
  const altoMapa = alto - ALTO_PIE;
  const auto = useMemo(() => encuadre(v.destacar, ancho, altoMapa), [v.destacar, ancho, altoMapa]);
  const final: Camara = { centro: (v.centro as LonLat | undefined) ?? auto.centro, zoom: v.zoom ?? auto.zoom };
  const desde = v.viaje?.desde, hasta = v.viaje?.hasta;
  const pv = useMemo(() => (desde && hasta ? planViaje(desde, hasta, ancho, altoMapa) : null), [desde, hasta, ancho, altoMapa]);
  // Avance del viaje (0 antes de despegar, 1 al aterrizar); suavizado de entrada y salida.
  const pViaje = pv ? interpolate(frame, [viajeEn, viajeEn + T_VIAJE * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }) : 0;
  let cam: Camara;
  if (pv) cam = camaraEnViaje(pv, pViaje);
  else {
    const zoomInicial = Math.max(0.8, final.zoom - 2);
    const zoom = v.acercar
      ? interpolate(frame, [0, T_CAMARA * fps], [zoomInicial, final.zoom], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
      : final.zoom;
    cam = { centro: final.centro, zoom };
  }
  // La geometría se recalcula solo cuando cambia la cámara (quieta = una vez; en el viaje, cada frame del vuelo).
  const zoomClave = +cam.zoom.toFixed(4), lonClave = +cam.centro[0].toFixed(4), latClave = +cam.centro[1].toFixed(4);
  const pClave = +pViaje.toFixed(4);
  const isosEtiqueta = useMemo(() => (desde && hasta ? [desde, hasta, ...v.destacar.filter((i) => i !== desde && i !== hasta)] : v.destacar), [desde, hasta, v.destacar]);
  const geo = useMemo(() => {
    const centroCam: LonLat = [lonClave, latClave];
    const proy = proyeccion({ centro: centroCam, zoom: zoomClave }, ancho, altoMapa);
    const camino = geoPath(proy);
    const paises = paisesGeo().map((p) => ({ iso: p.iso, d: camino(p.f) ?? '' })).filter((p) => p.d);
    const reja = camino(geoGraticule10()) ?? '';
    const esfera = tipoProyeccion(centroCam) === 'ortografica' ? camino({ type: 'Sphere' }) ?? '' : '';
    // Trayecto del viaje hasta donde va la cámara (línea punteada dorada).
    let ruta = '';
    // Punto final de la línea (al aterrizar = centro de cámara de `hasta` = centro del mapa) y su dirección de llegada.
    let fin: { x: number; y: number; dx: number; dy: number } | null = null;
    if (pv && pClave > 0) {
      const pts: [number, number][] = [];
      const n = Math.max(2, Math.round(80 * pClave));
      for (let i = 0; i <= n; i++) { const q = proy(pv.ruta((i / n) * pClave)); if (q && Number.isFinite(q[0])) pts.push([q[0], q[1]]); }
      ruta = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('');
      if (pts.length >= 2) {
        const [ax, ay] = pts[Math.max(0, pts.length - 6)], [bx, by] = pts[pts.length - 1];
        const L = Math.hypot(bx - ax, by - ay) || 1;
        fin = { x: bx, y: by, dx: (bx - ax) / L, dy: (by - ay) / L };
      }
    }
    const origen = pv ? proy(pv.origen) : null;
    const centros = isosEtiqueta.map((iso) => {
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
    return { paises, reja, esfera, centros, sueltas, flechas, ruta, origen, fin };
  }, [lonClave, latClave, zoomClave, pClave, pv, isosEtiqueta, ancho, altoMapa, v]);

  const destacados = new Map(v.destacar.map((iso, k) => [iso, k]));
  if (desde && !destacados.has(desde)) destacados.set(desde, destacados.size);
  if (hasta && !destacados.has(hasta)) destacados.set(hasta, destacados.size);
  const entradaPais = (k: number) => clamp01((frame - (0.3 + 0.25 * k) * fps) / (0.5 * fps));
  // Viaje: la partida se apaga al despegar; la llegada se enciende al aterrizar (último 15 % del vuelo + 0,5 s).
  const llegada = pv ? clamp01((frame - (viajeEn + T_VIAJE * fps * 0.85)) / (0.5 * fps)) : 0;
  const partida = pv ? entradaPais(0) * (1 - clamp01(pViaje * 3)) : 0;
  /** Color y encendido (0–1) de un país destacado; en el viaje, partida y llegada van en dorado. */
  const estiloPais = (iso: string, k: number): { col: string; e: number } => {
    if (pv && iso === hasta) return { col: PALETA.dorado, e: llegada };
    if (pv && iso === desde) return { col: PALETA.dorado, e: Math.max(entradaPais(0) * (1 - 0.7 * pViaje), 0) };
    return { col: colorDestacado(k), e: entradaPais(k) };
  };
  const fsPais = 30, fsSuelta = 24, fsFlecha = 26;
  // Etiquetas: países destacados primero (más importantes), luego las sueltas; anticolisión.
  const opEtiqueta = (iso: string, k: number) => (pv && iso === desde ? partida : pv && iso === hasta ? llegada : entradaPais(k));
  const pedidas = [
    ...geo.centros.map((c) => {
      if (!c) return null;
      const texto = nombrePais(c.iso).toUpperCase();
      // Viaje: la etiqueta de llegada va al lado CONTRARIO de por donde llega la línea (sigue la dirección de vuelo),
      // así la línea punteada termina a la vista en el centro de cámara del país.
      if (pv && c.iso === hasta && geo.fin) {
        const w = texto.length * fsPais * 0.5 + 28, h = fsPais * 1.5;
        const sx = geo.fin.dx >= 0 ? 1 : -1, sy = geo.fin.dy >= 0 ? 1 : -1;
        return { texto, x: geo.fin.x + sx * (w / 2 + 26), y: geo.fin.y + sy * (h / 2 + 18), fs: fsPais, k: destacados.get(c.iso) ?? 0, iso: c.iso, tipo: 'pais' as const };
      }
      return { texto, x: c.x, y: c.y, fs: fsPais, k: destacados.get(c.iso) ?? 0, iso: c.iso, tipo: 'pais' as const };
    }),
    ...geo.sueltas.map((s) => (s ? { texto: s.texto, x: s.x, y: s.y, fs: fsSuelta, k: -1, iso: '', tipo: 'suelta' as const } : null)),
  ].filter((x): x is NonNullable<typeof x> => !!x);
  // En el viaje, solo compiten por lugar las etiquetas visibles (la de partida desaparece al despegar).
  const visibles = pedidas.filter((p) => p.tipo !== 'pais' || opEtiqueta(p.iso, p.k) > 0);
  const cajas = ubicarEtiquetas(visibles.map((p) => {
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
            const { col, e } = estiloPais(p.iso!, k);
            return <path key={`d${i}`} d={p.d} fill={col} fillOpacity={0.25 + 0.7 * e} stroke={col} strokeWidth={1.6} />;
          })}
          {geo.ruta && (
            <g>
              <path d={geo.ruta} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={9} strokeLinecap="round" strokeDasharray="2 20" />
              <path d={geo.ruta} fill="none" stroke={PALETA.dorado} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 20" />
              {geo.origen && <circle cx={geo.origen[0]} cy={geo.origen[1]} r={9} fill={PALETA.dorado} stroke={PALETA.fondo} strokeWidth={3} />}
              {geo.fin && llegada > 0 && <circle cx={geo.fin.x} cy={geo.fin.y} r={10 * llegada} fill={PALETA.dorado} stroke={PALETA.fondo} strokeWidth={3} />}
            </g>
          )}
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
        {visibles.map((p, i) => {
          const c = cajas[i];
          if (!c) return null;
          const e = p.tipo === 'pais' ? opEtiqueta(p.iso, p.k) : clamp01((frame - 0.8 * fps) / (0.4 * fps));
          if (e <= 0) return null;
          const col = p.tipo === 'pais' ? estiloPais(p.iso, p.k).col : PALETA.tintaSuave;
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
