import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, numeroEs, opcionesDe } from '../formato';
import { anioReferencia, destacadoDe, valorEn } from './serie';
import { SinDatos } from './Lineas';
import { ajustar, cifraContando } from './Contador';
import { clamp01, salida3, type PropsCuerpo } from './tipos';

/**
 * Comparación A vs B: dos cifras grandes lado a lado, cada una sobre una barra vertical proporcional (para que la
 * diferencia se VEA, no solo se lea), y al final la razón entre ellas ("3,1×") en una caja de acento.
 * Tiempos con `progreso`: A cuenta (0–0,45), B cuenta (0,35–0,8), la razón entra (0,75–1).
 */
export const Comparacion: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, frame, fps, enfasis }) => {
  const T = TIPO_GRAFICO[modo];
  const anio = anioReferencia(g, ps);
  const dest = destacadoDe(g);
  const a = ps.find((p) => p.iso === dest) ?? ps[0];
  const b = ps.find((p) => p !== a);
  const va = a && anio !== null ? valorEn(a, anio) : null;
  const vb = b && anio !== null ? valorEn(b, anio) : null;
  if (!a || !b || va === null || vb === null) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const opc = opcionesDe(g, serie);
  const pa = clamp01(progreso / 0.45), pb = clamp01((progreso - 0.35) / 0.45), pr = clamp01((progreso - 0.75) / 0.25);
  const max = Math.max(Math.abs(va), Math.abs(vb), 1e-9);
  const razon = Math.abs(vb) > 1e-9 ? va / vb : NaN;
  const textoRazon = Number.isFinite(razon) ? (razon >= 1 ? `${numeroEs(razon, razon < 10 ? 1 : 0)}×` : `${numeroEs(1 / razon, 1 / razon < 10 ? 1 : 0)}× menos`) : '';
  const col = ancho * (modo === 'short' ? 0.46 : 0.36);
  const altoBarra = alto * (modo === 'short' ? 0.4 : 0.42);
  const fsCifra = Math.min(ajustar(formatear(Math.max(va, vb), { ...opc, compacto: max >= 1e7 }), col * 0.95, T.contador * 0.55, 0.58), ajustar(formatear(Math.min(va, vb), { ...opc, compacto: max >= 1e7 }), col * 0.95, T.contador * 0.55, 0.58));
  const pulso = enfasis > 0 ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.2) : 0;
  const columna = (p: typeof a, v: number, avance: number, color: string) => (
    <div style={{ width: col, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: alto * 0.96, gap: 14 }}>
      <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: fsCifra, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums', opacity: avance > 0 ? 1 : 0.2 }}>
        {formatear(cifraContando(v, avance), { ...opc, compacto: max >= 1e7 })}
      </div>
      <div style={{ width: col * 0.5, height: altoBarra, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '100%', height: altoBarra * (Math.abs(v) / max) * salida3(avance), background: color, borderRadius: '10px 10px 3px 3px' }} />
      </div>
      <div style={{ height: 4, width: col * 0.8, background: '#4A5462', borderRadius: 2 }} />
      <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: T.titulo * 0.75, color: PALETA.tinta, textAlign: 'center' }}>{p.pais}</div>
    </div>
  );
  return (
    <div style={{ width: ancho, height: alto, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: ancho * (modo === 'short' ? 0.04 : 0.12) }}>
      {columna(a, va, pa, PALETA.dorado)}
      {columna(b, vb, pb, PALETA.azul)}
      {textoRazon && pr > 0 && (
        <div style={{
          position: 'absolute', left: '50%', top: modo === 'short' ? alto * 0.02 : alto * 0.04, transform: `translateX(-50%) scale(${0.7 + 0.3 * salida3(pr) + 0.04 * pulso})`, opacity: Math.min(1, pr * 2),
          background: enfasis > 0 ? PALETA.rojo : PALETA.dorado, color: PALETA.fondo, borderRadius: 18, padding: '8px 26px',
          fontFamily: TIPO.display, fontWeight: 800, fontSize: T.valor * 1.5, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>{textoRazon}</div>
      )}
      <div style={{ position: 'absolute', right: 0, bottom: -T.eje * 0.2, fontFamily: TIPO.texto, fontWeight: 600, fontSize: T.eje, color: PALETA.tintaSuave }}>{anio}</div>
    </div>
  );
};
