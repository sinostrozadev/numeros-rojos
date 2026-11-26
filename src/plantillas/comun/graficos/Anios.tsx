import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { SinDatos } from './Lineas';
import { clamp01, type PropsCuerpo } from './tipos';

/**
 * `anios` (v4, 2026-11-26): un cuadro por AÑO y una fila por país. El cuadro va en rojo si el valor de ese año es
 * negativo (p. ej. crecimiento del PIB por persona < 0: "ese año el país terminó más pobre") y en gris claro si no.
 * Se llena de izquierda a derecha con `progreso`; a la derecha de cada fila, el conteo "34 de 64" que va subiendo.
 * Es el gráfico de las RACHAS: lo que una línea esconde (cuántos años malos y cuán seguidos) aquí se cuenta a ojo.
 */
export const Anios: React.FC<PropsCuerpo> = ({ g, ps, ancho, alto, modo, progreso, enfasis, enfasisPais, frame, fps }) => {
  const T = TIPO_GRAFICO[modo];
  if (!ps.length) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const a0 = Math.min(...ps.map((p) => p.puntos[0].anio)), a1 = Math.max(...ps.map((p) => p.puntos[p.puntos.length - 1].anio));
  const n = a1 - a0 + 1;
  // Filas de cuadros por país: series largas (> 40 años) se parten en 2 renglones para que el cuadro sea grande.
  const renglones = n > 40 ? 2 : 1;
  const porRenglon = Math.ceil(n / renglones);
  const anchoNombre = Math.min(330, ancho * 0.19), anchoConteo = Math.min(300, ancho * 0.17);
  const paso = (ancho - anchoNombre - anchoConteo - 20) / porRenglon;
  const altoPais = (alto - T.eje * 2.4) / ps.length;
  const lado = Math.max(4, Math.min(paso - 4, (altoPais - 26) / renglones - 6, 64));
  const pasoY = lado + 6;
  const altoFila = Math.min(altoPais, renglones * pasoY + 26);
  const y0 = (alto - T.eje * 2.4 - altoFila * ps.length) / 2;
  const hasta = a0 + progreso * n; // años ya revelados
  const dest = enfasisPais ?? g.destacar?.pais;
  const pulso = enfasis > 0 ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.2) : 0;
  return (
    <div style={{ width: ancho, height: alto, position: 'relative' }}>
      {ps.map((p, fila) => {
        const porAnio = new Map(p.puntos.map((q) => [q.anio, q.valor]));
        const revelados = p.puntos.filter((q) => q.anio < hasta);
        const malos = revelados.filter((q) => q.valor < 0).length;
        const y = y0 + fila * altoFila;
        const fuerte = !dest || p.iso === dest;
        return (
          <div key={p.iso} style={{ position: 'absolute', left: 0, top: y, width: ancho, height: altoFila, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: anchoNombre, fontFamily: TIPO.texto, fontWeight: 800, fontSize: T.etiqueta * 1.15, color: PALETA.tinta, lineHeight: 1.05 }}>{p.pais}</div>
            <div style={{ position: 'relative', width: paso * porRenglon, height: renglones * pasoY }}>
              {Array.from({ length: n }, (_, k) => {
                const anio = a0 + k;
                const v = porAnio.get(anio);
                const visible = clamp01((hasta - anio) * 1.5);
                const malo = v !== undefined && v < 0;
                return (
                  <div key={anio} style={{
                    position: 'absolute', left: (k % porRenglon) * paso, top: Math.floor(k / porRenglon) * pasoY, width: lado, height: lado, borderRadius: Math.max(2, lado * 0.16),
                    background: v === undefined ? 'transparent' : malo ? PALETA.rojo : '#3B4552',
                    border: v === undefined ? '1px dashed #3B4552' : undefined,
                    opacity: v === undefined ? 0.5 : visible * (malo ? 1 : 0.9), transform: `scale(${0.6 + 0.4 * visible + (malo && fuerte ? 0.06 * pulso : 0)})`,
                    boxShadow: malo && visible > 0.9 ? '0 0 10px rgba(255,77,77,0.45)' : undefined,
                  }} />
                );
              })}
            </div>
            <div style={{ width: anchoConteo, paddingLeft: 20, display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: T.valor * 1.7, color: PALETA.rojo, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{malos}</span>
              <span style={{ fontFamily: TIPO.texto, fontWeight: 700, fontSize: T.eje * 1.05, color: PALETA.tintaSuave }}>de {revelados.length || p.puntos.length}</span>
            </div>
          </div>
        );
      })}
      {/* Rango de años bajo las filas. */}
      <div style={{ position: 'absolute', left: anchoNombre, top: y0 + altoFila * ps.length + 6, fontFamily: TIPO.texto, fontWeight: 600, fontSize: T.eje, color: PALETA.tintaSuave, fontVariantNumeric: 'tabular-nums' }}>
        {renglones > 1 ? `Cada renglón: ${porRenglon} años · de ${a0} a ${a1}` : `${a0} → ${a1}`}
      </div>
      <div style={{ position: 'absolute', right: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: TIPO.texto, fontWeight: 600, fontSize: T.eje, color: PALETA.tintaSuave }}>
        <span style={{ width: T.eje * 0.9, height: T.eje * 0.9, borderRadius: 3, background: PALETA.rojo, display: 'inline-block' }} /> año en que cayó
      </div>
    </div>
  );
};
