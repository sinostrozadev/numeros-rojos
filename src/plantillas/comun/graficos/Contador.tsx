import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, opcionesDe } from '../formato';
import { anioReferencia, destacadoDe, valorEn, type SeriePais } from './serie';
import { SinDatos } from './Lineas';
import { anchoTexto, clamp01, salida3, type PropsCuerpo } from './tipos';

/** Valor que muestra un contador: el del destacado (o el primer país) en el año de referencia. */
export const valorContador = (g: PropsCuerpo['g'], ps: SeriePais[]) => {
  const anio = anioReferencia(g, ps);
  const p = ps.find((q) => q.iso === destacadoDe(g)) ?? ps[0];
  if (!p || anio === null) return null;
  const v = valorEn(p, anio);
  return v === null ? null : { p, anio, v };
};

/** Cifra visible mientras cuenta: solo cuentan las ≥ 100 (las chicas y los años aparecen enteros). */
export const cifraContando = (v: number, avance: number) => (Math.abs(v) >= 100 ? v * salida3(avance) : v);

/** Tamaño de letra que hace caber `texto` en `ancho` sin pasar de `max`. */
export const ajustar = (texto: string, ancho: number, max: number, k = 0.6) => Math.min(max, ancho / Math.max(1, texto.length * k));

/**
 * Contador: UNA cifra enorme que cuenta hasta su valor cuando la voz la dice (`progreso` 0→1 lo ancla el
 * contenedor a la palabra con la cifra). Debajo, qué es (país · año, o `destacar.texto`). En el giro se pone roja.
 */
export const Contador: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, enfasis }) => {
  const T = TIPO_GRAFICO[modo];
  const c = valorContador(g, ps);
  if (!c) return <SinDatos ancho={ancho} alto={alto} fontSize={T.etiqueta} />;
  const opc = opcionesDe(g, serie);
  const chica = Math.abs(c.v) < 100;
  const v = cifraContando(c.v, progreso);
  const final = formatear(c.v, { ...opc, compacto: Math.abs(c.v) >= 1e7 });
  const texto = formatear(v, { ...opc, compacto: Math.abs(c.v) >= 1e7, decimales: opc.decimales ?? (Math.abs(c.v) < 10 && c.v % 1 !== 0 ? 1 : 0) });
  const fs = ajustar(final, ancho * 0.92, Math.min(T.contador, alto * 0.5), 0.58);
  // Las cifras chicas no cuentan: entran con un leve rebote (back-out) cuando la voz las dice.
  const x = clamp01(progreso / 0.3);
  const entra = chica ? 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2) : 1;
  const rojo = enfasis;
  const color = rojo > 0 ? PALETA.rojo : PALETA.dorado;
  const etiqueta = g.destacar?.texto ?? `${c.p.pais} · ${c.anio}`;
  const contexto = g.datos.etiqueta ?? serie?.etiqueta ?? '';
  return (
    <div style={{ width: ancho, height: alto, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: T.etiqueta * 0.5 }}>
      <div style={{
        fontFamily: TIPO.display, fontWeight: 800, fontSize: fs, lineHeight: 1, color, letterSpacing: -fs * 0.03,
        fontVariantNumeric: 'tabular-nums', opacity: progreso > 0 ? (chica ? Math.min(1, entra * 1.4) : 1) : 0.18,
        transform: `scale(${chica ? 0.8 + 0.2 * entra : 1 + 0.03 * Math.sin(clamp01(progreso) * Math.PI)})`,
        textShadow: rojo > 0 ? `0 0 ${40 * rojo}px ${PALETA.rojo}66` : `0 0 40px ${PALETA.dorado}33`,
      }}>{progreso > 0 ? texto : final.replace(/\d/g, '0')}</div>
      <div style={{ width: Math.min(ancho * 0.6, anchoTexto(final, fs, 0.5)) * salida3(progreso), height: 6, borderRadius: 3, background: color, opacity: 0.85 }} />
      <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: T.titulo * 0.82, color: PALETA.tinta, textAlign: 'center', maxWidth: ancho * 0.92, lineHeight: 1.15 }}>{etiqueta}</div>
      {contexto && <div style={{ fontFamily: TIPO.texto, fontWeight: 500, fontSize: T.subtitulo, color: PALETA.tintaSuave, textAlign: 'center', maxWidth: ancho * 0.9 }}>{contexto}</div>}
    </div>
  );
};
