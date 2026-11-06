import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, marcasBonitas, opcionesDe, pasoAnios } from '../formato';
import { Ejes } from './Ejes';
import { anioReferencia, colorBarra, coloresDe, destacadoDe, rangoAnios, valorEn, type SeriePais } from './serie';
import { SinDatos } from './Lineas';
import { anchoTexto, clamp01, salida3, type PropsCuerpo } from './tipos';

type Fila = { iso: string; pais: string; valor: number };

/** Una barra horizontal con nombre a la izquierda y valor al final (el valor cuenta mientras la barra crece). */
const BarraH: React.FC<{
  y: number; alto: number; xNombre: number; x0: number; largo: number; fila: Fila; color: string; destacado: boolean;
  T: (typeof TIPO_GRAFICO)[keyof typeof TIPO_GRAFICO]; valorVisible: number; opc: ReturnType<typeof opcionesDe>; rojo: number; rango?: number; encendido?: boolean;
}> = ({ y, alto, xNombre, x0, largo, fila, color, destacado, T, valorVisible, opc, rojo: rojo0, rango, encendido }) => {
  const rojo = encendido ? rojo0 : 0;
  const valor = formatear(valorVisible, { ...opc, compacto: Math.abs(valorVisible) >= 1e6 });
  const fs = Math.min(T.etiqueta, alto * 0.62);
  const w = Math.max(0, largo);
  return (
    <g>
      {rango !== undefined && (
        <text x={xNombre - (anchoTexto(fila.pais, fs, 0.58) + 26)} y={y + alto * 0.5 + fs * 0.35} fontSize={fs * 0.85} textAnchor="end" fill={PALETA.tintaSuave}
          style={{ fontFamily: TIPO.texto, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{rango}</text>
      )}
      <text x={xNombre} y={y + alto * 0.5 + fs * 0.35} fontSize={fs} textAnchor="end" fill={destacado ? PALETA.tinta : PALETA.tintaSuave}
        style={{ fontFamily: TIPO.texto, fontWeight: destacado ? 800 : 600 }}>{fila.pais}</text>
      <rect x={x0} y={y + alto * 0.14} width={w} height={alto * 0.72} rx={Math.min(8, alto * 0.12)} fill={color}
        stroke={rojo > 0 ? PALETA.rojo : 'none'} strokeWidth={rojo > 0 ? 5 * rojo : 0} />
      {w > 2 && (
        <text x={x0 + w + 14} y={y + alto * 0.5 + fs * 0.36} fontSize={fs} fill={rojo > 0 ? PALETA.rojo : destacado ? PALETA.dorado : PALETA.tinta}
          style={{ fontFamily: TIPO.texto, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{valor}</text>
      )}
    </g>
  );
};

/** Escala horizontal de barras con base en cero (también con negativos). */
const escala = (valores: number[], x0: number, x1: number) => {
  const max = Math.max(0, ...valores), min = Math.min(0, ...valores);
  const k = (x1 - x0) / Math.max(1e-9, max - min);
  return { cero: x0 - min * k, k };
};

/**
 * Barras: comparación entre países en UN año (`destacar.anio` o el último común), horizontales y ordenadas de
 * mayor a menor. Crecen una tras otra con `progreso`; el destacado en dorado, el resto en gris de contexto.
 */
export const Barras: React.FC<PropsCuerpo> = (props) => {
  if (props.ps.length === 1 && props.ps[0].puntos.length > 2) return <Columnas {...props} />;
  return <BarrasPaises {...props} />;
};

/**
 * Barras de UN país en el tiempo (columnas por año): crecen de izquierda a derecha siguiendo `progreso` como la
 * línea; el año destacado (o el máximo) en dorado con su valor; en el giro, rojo.
 */
const Columnas: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, frame, fps, enfasis }) => {
  const T = TIPO_GRAFICO[modo];
  const p = ps[0];
  const opc = opcionesDe(g, serie);
  const pts = p.puntos;
  const vMax = Math.max(0, ...pts.map((q) => q.valor)), vMin = Math.min(0, ...pts.map((q) => q.valor));
  const marcas = marcasBonitas(vMin, vMax * 1.05, modo === 'short' ? 4 : 5);
  const d0 = Math.min(vMin, marcas[0]), d1 = Math.max(vMax * 1.05, marcas[marcas.length - 1]);
  const anchoY = Math.max(...marcas.map((m) => anchoTexto(formatear(m, { ...opc, compacto: true }), T.eje, 0.6))) + 22;
  const x0 = anchoY, x1 = ancho - 10, y0 = T.etiqueta * 2.4, y1 = alto - T.eje * 2 - 10;
  const a0 = pts[0].anio, a1 = pts[pts.length - 1].anio;
  const banda = (x1 - x0) / Math.max(1, a1 - a0 + 1);
  const X = (a: number) => x0 + (a - a0) * banda;
  const Y = (v: number) => y1 - ((v - d0) / (d1 - d0)) * (y1 - y0);
  const cabeza = a0 + (a1 - a0 + 1) * progreso;
  const clave = g.destacar?.anio ?? pts.reduce((m, q) => (Math.abs(q.valor) > Math.abs(m.valor) ? q : m), pts[0]).anio;
  const pa = pasoAnios(a0, a1, modo === 'short' ? 4 : 8);
  const marcasX = [] as { v: number; pos: number; texto: string }[];
  for (let a = Math.ceil(a0 / pa) * pa; a <= a1; a += pa) marcasX.push({ v: a, pos: X(a) + banda / 2, texto: String(a) });
  const qClave = pts.find((q) => q.anio === clave);
  return (
    <svg width={ancho} height={alto} style={{ overflow: 'visible' }}>
      <Ejes x0={x0} x1={x1} y0={y0} y1={y1} marcasY={marcas.map((v) => ({ v, pos: Y(v), texto: formatear(v, { ...opc, compacto: true }) }))} marcasX={marcasX}
        fontSize={T.eje} aparicion={clamp01(frame / (0.5 * fps))} base={Y(0)} />
      {pts.map((q) => {
        const crece = salida3((cabeza - q.anio) / 2.5);
        if (crece <= 0) return null;
        const y = Y(q.valor * crece), yb = Y(0);
        const esClave = q.anio === clave;
        return <rect key={q.anio} x={X(q.anio) + banda * 0.12} width={Math.max(1, banda * 0.76)} y={Math.min(y, yb)} height={Math.abs(yb - y)} rx={Math.min(4, banda * 0.2)}
          fill={esClave ? (enfasis > 0 ? PALETA.rojo : PALETA.dorado) : q.valor < 0 ? PALETA.rojo : PALETA.azul} opacity={esClave ? 1 : 0.85} />;
      })}
      {qClave && cabeza >= clave + 1 && (() => {
        const valor = formatear(qClave.valor, { ...opc, compacto: Math.abs(qClave.valor) >= 1e6 });
        const w = anchoTexto(`${clave} · ${valor}`, T.etiqueta, 0.6) + 24;
        const cx = Math.min(Math.max(X(clave) + banda / 2, x0 + w / 2), x1 - w / 2);
        const y = Math.max(4, Y(Math.max(0, qClave.valor)) - T.etiqueta * 1.9);
        return (
          <g>
            <rect x={cx - w / 2} y={y} width={w} height={T.etiqueta * 1.45} rx={8} fill={enfasis > 0 ? PALETA.rojo : '#1B2027'} stroke={PALETA.dorado} strokeWidth={enfasis > 0 ? 0 : 2} />
            <text x={cx} y={y + T.etiqueta * 1.05} textAnchor="middle" fontSize={T.etiqueta} fill={PALETA.tinta} style={{ fontFamily: TIPO.texto, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
              <tspan fill={enfasis > 0 ? PALETA.tinta : PALETA.dorado}>{clave}</tspan>{` · ${valor}`}
            </text>
          </g>
        );
      })()}
    </svg>
  );
};

const BarrasPaises: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, enfasis, enfasisPais }) => {
  const T = TIPO_GRAFICO[modo];
  const anio = anioReferencia(g, ps);
  const filas: Fila[] = anio === null ? [] : ps.flatMap((p) => { const v = valorEn(p, anio); return v === null ? [] : [{ iso: p.iso, pais: p.pais, valor: v }]; })
    .sort((a, b) => b.valor - a.valor);
  if (!filas.length) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const opc = opcionesDe(g, serie);
  const dest = destacadoDe(g);
  const altoFila = Math.min(alto / (filas.length + 0.6), T.etiqueta * (modo === 'short' ? 2.6 : 2.2));
  const xNombre = Math.max(...filas.map((f) => anchoTexto(f.pais, Math.min(T.etiqueta, altoFila * 0.62), 0.58))) + 6;
  const x0 = xNombre + 18;
  const anchoValor = Math.max(...filas.map((f) => anchoTexto(formatear(f.valor, { ...opc, compacto: Math.abs(f.valor) >= 1e6 }), T.etiqueta, 0.62))) + 30;
  const { cero, k } = escala(filas.map((f) => f.valor), x0, ancho - anchoValor);
  const y0 = (alto - altoFila * filas.length) / 2;
  const desfase = Math.min(0.1, 0.5 / filas.length);
  return (
    <svg width={ancho} height={alto} style={{ overflow: 'visible' }}>
      <line x1={cero} x2={cero} y1={y0 - 8} y2={y0 + altoFila * filas.length + 8} stroke="#4A5462" strokeWidth={2.5} />
      {filas.map((f, i) => {
        const avance = salida3((progreso - i * desfase) / Math.max(0.2, 1 - (filas.length - 1) * desfase));
        const v = f.valor * avance;
        const largo = Math.abs(v) * k;
        return (
          <g key={f.iso} transform={v < 0 ? `translate(${-largo},0)` : undefined}>
            <BarraH y={y0 + i * altoFila} alto={altoFila} xNombre={xNombre} x0={cero} largo={largo} fila={f} color={colorBarra(g, f.iso)} destacado={f.iso === dest}
              T={T} valorVisible={v} opc={opc} rojo={enfasis} encendido={f.iso === (enfasisPais ?? dest)} />
          </g>
        );
      })}
      <text x={ancho} y={alto - 4} textAnchor="end" fontSize={T.eje} fill={PALETA.tintaSuave} style={{ fontFamily: TIPO.texto, fontWeight: 600 }}>{anio}</text>
    </svg>
  );
};

/** Cortes del ranking: años de las anotaciones (si hay ≥ 2) o inicio, medio y fin. */
export const cortesRanking = (g: PropsCuerpo['g'], ps: SeriePais[]): number[] => {
  const r = rangoAnios(ps, g);
  if (!r) return [];
  const an = (g.anotaciones ?? []).map((a) => a.anio).filter((a) => a >= r[0] && a <= r[1]);
  if (an.length >= 2) return [...new Set(an)].sort((a, b) => a - b).slice(0, 4);
  const medio = Math.round((r[0] + r[1]) / 2);
  return r[1] - r[0] >= 10 ? [r[0], medio, r[1]] : [r[0], r[1]];
};

/**
 * Ranking: barras que se REORDENAN entre 2–4 cortes de año (bar chart race corto). Los primeros 15 % del avance
 * las barras crecen; luego valores y posiciones se interpolan corte a corte. Año grande abajo a la derecha.
 */
export const Ranking: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, enfasis, enfasisPais }) => {
  const T = TIPO_GRAFICO[modo];
  const cortes = cortesRanking(g, ps);
  if (cortes.length < 1 || !ps.length) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const opc = opcionesDe(g, serie);
  const dest = destacadoDe(g);
  const colores = coloresDe(g, ps);
  const crecer = salida3(progreso / 0.15);
  const mov = clamp01((progreso - 0.15) / 0.85) * (cortes.length - 1);
  const k = Math.min(cortes.length - 2, Math.floor(mov));
  const f = cortes.length > 1 ? mov - Math.max(0, k) : 0;
  const s = f * f * (3 - 2 * f);
  const ca = cortes[Math.max(0, k)], cb = cortes[Math.min(cortes.length - 1, Math.max(0, k) + 1)];
  const rankEn = (anio: number) => {
    const v = ps.map((p) => ({ iso: p.iso, v: valorEn(p, anio) ?? 0 })).sort((a, b) => b.v - a.v);
    return Object.fromEntries(v.map((x, i) => [x.iso, i])) as Record<string, number>;
  };
  const ra = rankEn(ca), rb = rankEn(cb);
  const altoFila = Math.min((alto - T.contador * 0.1) / (ps.length + 0.8), T.etiqueta * (modo === 'short' ? 2.5 : 2.1));
  const fsNombre = Math.min(T.etiqueta, altoFila * 0.62);
  const xNombre = Math.max(...ps.map((p) => anchoTexto(p.pais, fsNombre, 0.58))) + fsNombre * 1.9;
  const x0 = xNombre + 18;
  const maxTotal = Math.max(...cortes.flatMap((c) => ps.map((p) => valorEn(p, c) ?? 0)));
  const anchoValor = anchoTexto(formatear(maxTotal, { ...opc, compacto: maxTotal >= 1e6 }), T.etiqueta, 0.62) + 30;
  const filas = ps.map((p) => {
    const va = valorEn(p, ca) ?? 0, vb = valorEn(p, cb) ?? 0;
    const v = (va + (vb - va) * s) * crecer;
    const pos = ra[p.iso] + (rb[p.iso] - ra[p.iso]) * s;
    return { iso: p.iso, pais: p.pais, valor: v, pos };
  });
  const maxAhora = Math.max(1e-9, ...filas.map((x) => x.valor));
  const kx = (ancho - anchoValor - x0) / Math.max(maxAhora, maxTotal * 0.55);
  const anioVisible = Math.round(ca + (cb - ca) * s);
  const y0 = 4;
  return (
    <svg width={ancho} height={alto} style={{ overflow: 'visible' }}>
      <text x={ancho - 6} y={alto - 10} textAnchor="end" fontSize={modo === 'short' ? 150 : 130} fill={PALETA.tinta} opacity={0.14}
        style={{ fontFamily: TIPO.display, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{anioVisible}</text>
      <line x1={x0} x2={x0} y1={y0} y2={y0 + altoFila * ps.length} stroke="#4A5462" strokeWidth={2.5} />
      {[...filas].sort((a, b) => (a.iso === dest ? 1 : 0) - (b.iso === dest ? 1 : 0)).map((fi) => (
        <BarraH key={fi.iso} y={y0 + fi.pos * altoFila} alto={altoFila} xNombre={xNombre} x0={x0} largo={Math.max(0, fi.valor) * kx}
          fila={fi} color={dest ? (fi.iso === dest ? PALETA.dorado : colores[fi.iso]) : colores[fi.iso]} destacado={fi.iso === dest}
          T={T} valorVisible={fi.valor} opc={opc} rojo={enfasis} encendido={fi.iso === (enfasisPais ?? dest)} rango={Math.round(fi.pos) + 1} />
      ))}
    </svg>
  );
};
