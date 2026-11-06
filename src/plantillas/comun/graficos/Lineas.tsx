import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, marcasBonitas, marcasLog, opcionesDe, pasoAnios } from '../formato';
import { coloresDe, destacadoDe, rangoAnios, valorInterpolado } from './serie';
import { Ejes, type MarcaEje } from './Ejes';
import { Anotacion, filasAnotaciones } from './Anotacion';
import { anchoTexto, clamp01, type PropsCuerpo } from './tipos';

/**
 * Líneas (1–6 países en el tiempo) y Área (una serie con relleno). La línea se DIBUJA de izquierda a derecha con
 * `progreso` (0 = primer año, 1 = último): el contenedor lo ancla a la voz para que la cabeza llegue a cada año
 * cuando la voz lo dice. La cabeza lleva un punto y la etiqueta directa del país (y su valor, que va contando);
 * las anotaciones aparecen cuando la línea llega a su año. El destacado va en dorado y encima de todo; en el giro
 * (`enfasis`) su valor se enciende en rojo con un pulso.
 */
export const Lineas: React.FC<PropsCuerpo & { area?: boolean }> = ({ g, serie, ps, ancho, alto, modo, progreso, frame, fps, enfasis, area = false }) => {
  const T = TIPO_GRAFICO[modo];
  const series = area ? ps.slice(0, 1).map((p) => (destacadoDe(g) ? ps.find((q) => q.iso === destacadoDe(g)) ?? p : p)) : ps;
  const rango = rangoAnios(series, g);
  if (!rango || !series.length) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const [a0, a1] = rango;
  const opc = opcionesDe(g, serie);
  const log = g.formato?.escala === 'log';
  const valores = series.flatMap((p) => p.puntos.map((q) => q.valor));
  const vMin = Math.min(...valores), vMax = Math.max(...valores);
  // Dominio Y: base en 0 si los datos son positivos y no quedan aplastados; si no, piso "bonito".
  let d0: number, d1: number, marcas: number[];
  if (log) {
    const piso = Math.max(vMin > 0 ? vMin : 1, 1e-6);
    d0 = Math.pow(10, Math.floor(Math.log10(piso)));
    d1 = Math.pow(10, Math.ceil(Math.log10(vMax)));
    if (vMax < d1 / 2) d1 = Math.ceil(vMax / Math.pow(10, Math.floor(Math.log10(vMax)))) * Math.pow(10, Math.floor(Math.log10(vMax)));
    marcas = marcasLog(d0, d1);
  } else {
    const desdeCero = vMin >= 0 && vMin < vMax * 0.45;
    const prov = marcasBonitas(desdeCero ? 0 : vMin, vMax, modo === 'short' ? 4 : 5);
    const paso = prov.length > 1 ? prov[1] - prov[0] : Math.abs(vMax) || 1;
    d0 = desdeCero ? Math.min(0, vMin) : Math.floor(vMin / paso) * paso;
    d1 = Math.ceil((vMax * 1.04) / paso) * paso;
    marcas = marcasBonitas(d0, d1, modo === 'short' ? 4 : 5);
  }
  const nombres = series.map((p) => p.pais);
  const anchoEtiq = Math.min(ancho * (modo === 'short' ? 0.27 : 0.2), Math.max(...nombres.map((n) => anchoTexto(n, T.etiqueta, 0.58))) + 40);
  const anchoY = Math.max(...marcas.map((m) => anchoTexto(formatear(m, { ...opc, compacto: true }), T.eje, 0.6))) + 22;
  const anots = (g.anotaciones ?? []).filter((a) => a.anio >= a0 && a.anio <= a1).sort((a, b) => a.anio - b.anio);
  const altoAnot = anots.length ? T.anotacion * 1.55 + 8 : 0;
  const x0 = anchoY, x1 = ancho - anchoEtiq;
  const yTop = 6;
  const y0 = yTop + (anots.length ? altoAnot * 2 + 10 : 12), y1 = alto - T.eje * 2 - 10;
  const X = (anio: number) => x0 + ((anio - a0) / Math.max(1, a1 - a0)) * (x1 - x0);
  const Y = (v: number) => {
    if (log) return y1 - ((Math.log10(Math.max(v, d0)) - Math.log10(d0)) / (Math.log10(d1) - Math.log10(d0))) * (y1 - y0);
    return y1 - ((v - d0) / (d1 - d0)) * (y1 - y0);
  };
  const marcasY: MarcaEje[] = marcas.map((v) => ({ v, pos: Y(v), texto: formatear(v, { ...opc, compacto: true }) }));
  const pa = pasoAnios(a0, a1, modo === 'short' ? 4 : 8);
  const marcasX: MarcaEje[] = [];
  for (let a = Math.ceil(a0 / pa) * pa; a <= a1; a += pa) marcasX.push({ v: a, pos: X(a), texto: String(a) });
  const aparicion = clamp01(frame / (0.5 * fps));
  const anioCabeza = a0 + (a1 - a0) * clamp01(progreso);
  const xCabeza = X(anioCabeza);
  const colores = coloresDe(g, series);
  const dest = destacadoDe(g);
  const orden = [...series].sort((a, b) => (a.iso === dest ? 1 : 0) - (b.iso === dest ? 1 : 0)); // destacado arriba
  const grosor = (iso: string) => (modo === 'short' ? 7 : 5) + (iso === dest ? 2 : 0);
  const idClip = `clip-${g.datos.indicador}-${g.titulo.length}-${modo}`.replace(/[^a-zA-Z0-9-]/g, '');

  // Cabezas: punto + etiqueta directa, separadas verticalmente para que nunca se encimen.
  const mostrarValor = (iso: string) => series.length <= 3 || iso === dest;
  const cabezas = series.flatMap((p) => {
    const v = valorInterpolado(p, Math.min(anioCabeza, p.puntos[p.puntos.length - 1].anio));
    if (v === null || progreso <= 0) return [];
    const anioP = Math.min(anioCabeza, p.puntos[p.puntos.length - 1].anio);
    return [{ p, v, x: X(anioP), y: Y(v) }];
  });
  const altoEtiq = T.etiqueta * (series.length <= 3 ? 2.15 : 1.25);
  const pos = [...cabezas].sort((a, b) => a.y - b.y).map((c) => ({ ...c, ly: c.y }));
  for (let k = 1; k < pos.length; k++) if (pos[k].ly - pos[k - 1].ly < altoEtiq) pos[k].ly = pos[k - 1].ly + altoEtiq;
  const exceso = pos.length ? pos[pos.length - 1].ly - (y1 - T.etiqueta * (mostrarValor(pos[pos.length - 1].p.iso) ? 1.15 : 0.5)) : 0;
  if (exceso > 0) for (let k = pos.length - 1; k >= 0; k--) { pos[k].ly -= exceso; if (k > 0 && pos[k].ly - pos[k - 1].ly >= altoEtiq) break; }
  for (let k = pos.length - 2; k >= 0; k--) if (pos[k + 1].ly - pos[k].ly < altoEtiq) pos[k].ly = pos[k + 1].ly - altoEtiq;

  const anchosAnot = anots.map((a) => ({ x: X(a.anio), w: anchoTexto(`${a.anio} · ${a.texto}`, T.anotacion, 0.55) + 28 }));
  const filas = filasAnotaciones(anchosAnot);
  const pulso = enfasis > 0 ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.2) : 0;
  const anioDest = g.destacar?.anio;

  return (
    <svg width={ancho} height={alto} style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={idClip}><rect x={0} y={0} width={xCabeza + 2} height={alto} /></clipPath>
        <linearGradient id={`${idClip}-relleno`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colores[series[0].iso]} stopOpacity={0.42} />
          <stop offset="100%" stopColor={colores[series[0].iso]} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <Ejes x0={x0} x1={x1} y0={y0} y1={y1} marcasY={marcasY} marcasX={marcasX} fontSize={T.eje} aparicion={aparicion} base={d0 <= 0 && d1 >= 0 ? Y(0) : y1} />
      {anioDest !== undefined && anioDest >= a0 && anioDest <= a1 && anioCabeza >= anioDest && (
        <line x1={X(anioDest)} x2={X(anioDest)} y1={y0} y2={y1} stroke={PALETA.dorado} strokeOpacity={0.7} strokeWidth={2.5} />
      )}
      {anots.map((a, k) => {
        const vis = clamp01((anioCabeza - a.anio) / Math.max(0.5, (a1 - a0) * 0.025));
        return <Anotacion key={`${a.anio}-${k}`} x={X(a.anio)} yTop={yTop} yBase={y1} anio={a.anio} texto={a.texto} fontSize={T.anotacion} visible={vis} fila={filas[k]} xMax={ancho - 4} />;
      })}
      <g clipPath={`url(#${idClip})`}>
        {area && (
          <path d={`${trazo(series[0].puntos, X, Y)} L${X(series[0].puntos[series[0].puntos.length - 1].anio)},${Y(Math.max(d0, 0))} L${X(series[0].puntos[0].anio)},${Y(Math.max(d0, 0))} Z`} fill={`url(#${idClip}-relleno)`} />
        )}
        {orden.map((p) => (
          <path key={p.iso} d={trazo(p.puntos, X, Y)} fill="none" stroke={colores[p.iso]} strokeWidth={grosor(p.iso)} strokeLinejoin="round" strokeLinecap="round"
            opacity={dest && p.iso !== dest ? 0.8 : 1} style={{ filter: p.iso === dest ? `drop-shadow(0 0 10px ${colores[p.iso]}55)` : undefined }} />
        ))}
      </g>
      {pos.map(({ p, v, x, y, ly }) => {
        const esDest = p.iso === dest || series.length === 1;
        const rojo = esDest && enfasis > 0;
        const r = (modo === 'short' ? 10 : 8) + (esDest ? 2 : 0);
        const valor = formatear(v, { ...opc, compacto: Math.abs(v) >= 1e6 });
        const lx = x + r + 14;
        return (
          <g key={p.iso}>
            {rojo && <circle cx={x} cy={y} r={r + 10 + 14 * pulso} fill="none" stroke={PALETA.rojo} strokeWidth={4} opacity={enfasis * (1 - pulso * 0.6)} />}
            <circle cx={x} cy={y} r={r} fill={colores[p.iso]} stroke={PALETA.fondo} strokeWidth={3} />
            {Math.abs(ly - y) > 6 && <line x1={x + r} y1={y} x2={lx - 4} y2={ly} stroke={colores[p.iso]} strokeOpacity={0.6} strokeWidth={2} />}
            <text x={lx} y={ly + (mostrarValor(p.iso) ? -T.etiqueta * 0.15 : T.etiqueta * 0.35)} fontSize={T.etiqueta}
              style={{ fontFamily: TIPO.texto, fontWeight: esDest ? 800 : 700 }} fill={esDest ? PALETA.tinta : PALETA.tintaSuave}>{p.pais}</text>
            {mostrarValor(p.iso) && (
              <g>
                {rojo && <rect x={lx - 8} y={ly + T.etiqueta * 0.12} width={anchoTexto(valor, T.etiqueta * 0.95, 0.6) + 16} height={T.etiqueta * 1.15} rx={6} fill={PALETA.rojo} opacity={enfasis} />}
                <text x={lx} y={ly + T.etiqueta * 0.98} fontSize={T.etiqueta * 0.95} fill={rojo ? PALETA.tinta : esDest ? PALETA.dorado : PALETA.tintaSuave}
                  style={{ fontFamily: TIPO.texto, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{valor}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const trazo = (puntos: { anio: number; valor: number }[], X: (a: number) => number, Y: (v: number) => number) =>
  puntos.map((q, i) => `${i ? 'L' : 'M'}${X(q.anio).toFixed(1)},${Y(q.valor).toFixed(1)}`).join(' ');

export const SinDatos: React.FC<{ ancho: number; alto: number; fontSize: number }> = ({ ancho, alto, fontSize }) => (
  <div style={{ width: ancho, height: alto, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px dashed ${PALETA.rojo}`, borderRadius: 16,
    color: PALETA.rojo, fontFamily: TIPO.texto, fontWeight: 800, fontSize, textAlign: 'center', padding: 30 }}>
    DATOS SIN RESOLVER — correr preparar-* antes de renderizar
  </div>
);
