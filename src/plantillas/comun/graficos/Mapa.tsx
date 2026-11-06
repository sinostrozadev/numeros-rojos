import React, { useMemo } from 'react';
import { geoEqualEarth, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import mundo50 from 'world-atlas/countries-50m.json';
import mundo110 from 'world-atlas/countries-110m.json';
import { GRIS_SIN_DATO, PALETA, RAMPA_MAPA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, opcionesDe } from '../formato';
import { anioReferencia, destacadoDe, valorEn } from './serie';
import { SinDatos } from './Lineas';
import { AMERICA, ISO_NUM, SUDAMERICA, regionDe, type RegionMapa } from './paises';
import { anchoTexto, clamp01, salida3, type PropsCuerpo } from './tipos';

type Pais = Feature<Geometry, { name: string }>;
const cache: Record<string, Pais[]> = {};
/** Polígonos de world-atlas (Natural Earth, dominio público): 50 m para América, 110 m para el mundo. */
const poligonos = (detalle: '50m' | '110m'): Pais[] => {
  if (!cache[detalle]) {
    const topo = (detalle === '50m' ? mundo50 : mundo110) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
    cache[detalle] = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>).features
      .filter((f) => f.properties.name !== 'Antarctica');
  }
  return cache[detalle];
};
const NUM_ISO = Object.fromEntries(Object.entries(ISO_NUM).map(([i, n]) => [n, i]));
const isoDe = (f: Pais) => NUM_ISO[String(f.id ?? '').padStart(3, '0')];

/** Encuadre de cada región: los países que tienen que verse enteros. */
const ENCUADRE: Record<RegionMapa, (iso: string | undefined) => boolean> = {
  sudamerica: (i) => !!i && SUDAMERICA.has(i),
  america: (i) => !!i && AMERICA.has(i) && i !== 'CAN',
  mundo: () => true,
};

/**
 * Mapa coroplético discreto (5 cubetas de una rampa azul secuencial, oscuro = bajo, claro = alto) del año de
 * referencia. Región automática: Sudamérica, América o el mundo según los países del guion. Los países se
 * colorean de menor a mayor con `progreso`; el destacado lleva borde dorado y etiqueta con su valor; el resto de
 * las etiquetas se ponen solo si no chocan. Leyenda de cubetas abajo a la izquierda.
 */
export const Mapa: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, frame, fps, enfasis, enfasisPais }) => {
  const T = TIPO_GRAFICO[modo];
  const anio = anioReferencia(g, ps);
  const region = regionDe(g.datos.paises);
  const detalle = region === 'mundo' ? '110m' : '50m';
  const geo = useMemo(() => {
    const todos = poligonos(detalle);
    const encuadre = { type: 'FeatureCollection', features: todos.filter((f) => ENCUADRE[region](isoDe(f))) } as FeatureCollection;
    const altoLeyenda = T.eje * 3.2;
    const proy = geoEqualEarth().rotate([region === 'sudamerica' ? 60 : region === 'america' ? 85 : -10, 0]);
    proy.fitExtent([[10, 10], [ancho - 10, alto - altoLeyenda]], encuadre as GeoPermissibleObjects);
    const camino = geoPath(proy);
    return todos.map((f) => ({ iso: isoDe(f), d: camino(f) ?? '', c: camino.centroid(f), area: camino.area(f) }));
  }, [detalle, region, ancho, alto, T.eje]);
  const valores = anio === null ? [] : ps.flatMap((p) => { const v = valorEn(p, anio); return v === null ? [] : [{ iso: p.iso, pais: p.pais, v }]; });
  if (!valores.length) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const opc = opcionesDe(g, serie);
  const vMin = Math.min(...valores.map((x) => x.v)), vMax = Math.max(...valores.map((x) => x.v));
  const cubeta = (v: number) => (vMax === vMin ? 3 : Math.min(4, Math.floor(((v - vMin) / (vMax - vMin)) * 5)));
  const orden = [...valores].sort((a, b) => a.v - b.v);
  const aparece = (iso: string) => {
    const k = orden.findIndex((x) => x.iso === iso);
    return salida3((progreso - (k / Math.max(1, orden.length)) * 0.75) / 0.25);
  };
  const porIso = Object.fromEntries(valores.map((x) => [x.iso, x]));
  const dest = enfasis > 0 && enfasisPais ? enfasisPais : destacadoDe(g);
  const aparicion = clamp01(frame / (0.5 * fps));
  // Etiquetas: destacado primero, luego de mayor a menor; se omite la que choca con una ya puesta.
  const puestas: { x0: number; y0: number; x1: number; y1: number }[] = [];
  const etiquetas = [...valores].sort((a, b) => (a.iso === dest ? -1 : b.iso === dest ? 1 : b.v - a.v)).flatMap((x) => {
    const gp = geo.find((q) => q.iso === x.iso);
    if (!gp || !Number.isFinite(gp.c[0])) return [];
    const valor = formatear(x.v, { ...opc, compacto: Math.abs(x.v) >= 1e6 });
    const fs = T.etiqueta * (x.iso === dest ? 1 : 0.8);
    const w = Math.max(anchoTexto(x.pais, fs * 0.8, 0.58), anchoTexto(valor, fs, 0.62)) + 20;
    const h = fs * 2.1;
    const caja = { x0: gp.c[0] - w / 2, y0: gp.c[1] - h / 2, x1: gp.c[0] + w / 2, y1: gp.c[1] + h / 2 };
    if (caja.x0 < 0) { caja.x1 -= caja.x0; caja.x0 = 0; }
    if (caja.x1 > ancho) { caja.x0 -= caja.x1 - ancho; caja.x1 = ancho; }
    if (puestas.some((p) => !(caja.x1 < p.x0 || caja.x0 > p.x1 || caja.y1 < p.y0 || caja.y0 > p.y1))) return [];
    puestas.push(caja);
    return [{ ...x, caja, fs, valor }];
  });
  const pulso = enfasis > 0 ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.2) : 0;
  const lado = T.eje * 1.6;
  return (
    <svg width={ancho} height={alto}>
      <g opacity={0.35 + 0.65 * aparicion}>
        {geo.map((p, k) => {
          const x = p.iso ? porIso[p.iso] : undefined;
          const a = x ? aparece(x.iso) : 0;
          return (
              <g key={k}>
                <path d={p.d} fill={GRIS_SIN_DATO} fillOpacity={0.55} stroke={PALETA.fondo} strokeWidth={0.8} />
                {x && a > 0 && <path d={p.d} fill={RAMPA_MAPA[cubeta(x.v)]} fillOpacity={a} stroke={PALETA.fondo} strokeWidth={1} />}
              </g>
            );
        })}
        {dest && porIso[dest] && (() => {
          const p = geo.find((q) => q.iso === dest);
          const a = aparece(dest);
          return p ? <path d={p.d} fill="none" stroke={enfasis > 0 ? PALETA.rojo : PALETA.dorado} strokeWidth={(modo === 'short' ? 5 : 4) + 3 * pulso * enfasis} opacity={a} strokeLinejoin="round" /> : null;
        })()}
      </g>
      {etiquetas.map((x) => {
        const a = aparece(x.iso);
        if (a <= 0) return null;
        const cx = (x.caja.x0 + x.caja.x1) / 2;
        const esDest = x.iso === dest;
        return (
          <g key={x.iso} opacity={a}>
            <rect x={x.caja.x0} y={x.caja.y0} width={x.caja.x1 - x.caja.x0} height={x.caja.y1 - x.caja.y0} rx={8} fill="rgba(17,20,24,0.78)"
              stroke={esDest ? (enfasis > 0 ? PALETA.rojo : PALETA.dorado) : 'none'} strokeWidth={2} />
            <text x={cx} y={x.caja.y0 + x.fs * 0.85} textAnchor="middle" fontSize={x.fs * 0.8} fill={PALETA.tintaSuave} style={{ fontFamily: TIPO.texto, fontWeight: 700 }}>{x.pais}</text>
            <text x={cx} y={x.caja.y0 + x.fs * 1.85} textAnchor="middle" fontSize={x.fs} fill={esDest ? PALETA.dorado : PALETA.tinta}
              style={{ fontFamily: TIPO.texto, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{x.valor}</text>
          </g>
        );
      })}
      <g transform={`translate(10, ${alto - lado - T.eje * 1.4})`} opacity={aparicion}>
        {RAMPA_MAPA.map((c, k) => <rect key={c} x={k * lado * 1.6} y={0} width={lado * 1.5} height={lado * 0.6} rx={4} fill={c} />)}
        <text x={0} y={lado * 0.6 + T.eje * 1.2} fontSize={T.eje} fill={PALETA.tintaSuave} style={{ fontFamily: TIPO.texto, fontWeight: 600 }}>{formatear(vMin, { ...opc, compacto: true })}</text>
        <text x={5 * lado * 1.6 - lado * 0.1} y={lado * 0.6 + T.eje * 1.2} textAnchor="end" fontSize={T.eje} fill={PALETA.tintaSuave} style={{ fontFamily: TIPO.texto, fontWeight: 600 }}>{formatear(vMax, { ...opc, compacto: true })}</text>
        <text x={5 * lado * 1.6 + 16} y={lado * 0.55} fontSize={T.eje} fill={PALETA.tintaSuave} style={{ fontFamily: TIPO.texto, fontWeight: 600 }}>{anio} · sin dato en gris</text>
      </g>
    </svg>
  );
};
