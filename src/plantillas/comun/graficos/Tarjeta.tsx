import React from 'react';
import { PALETA, TIPO, TIPO_GRAFICO } from '../../../marca/tokens';
import { formatear, opcionesDe } from '../formato';
import { valorContador, cifraContando, ajustar } from './Contador';
import { salida3, type PropsCuerpo } from './tipos';

/**
 * Tarjeta: dato textual con fuente, cuando no hay serie que dibujar ("Ley 21.XXX, 2024"; un sueldo mínimo oficial).
 * Panel con barra de acento a la izquierda; si los datos traen un valor, va grande arriba y cuenta.
 */
export const Tarjeta: React.FC<PropsCuerpo> = ({ g, serie, ps, ancho, alto, modo, progreso, enfasis }) => {
  const T = TIPO_GRAFICO[modo];
  const c = valorContador(g, ps);
  const opc = opcionesDe(g, serie);
  const e = salida3(progreso / 0.4);
  const acento = enfasis > 0 ? PALETA.rojo : PALETA.dorado;
  const cifra = c ? formatear(cifraContando(c.v, progreso), opc) : null;
  const texto = g.destacar?.texto ?? (c ? `${c.p.pais} · ${c.anio}` : '');
  const w = Math.min(ancho, modo === 'short' ? ancho : ancho * 0.72);
  return (
    <div style={{ width: ancho, height: alto, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: w, background: '#1B2027', borderRadius: 22, borderLeft: `14px solid ${acento}`, padding: modo === 'short' ? '44px 44px' : '48px 60px',
        transform: `translateY(${(1 - e) * 40}px)`, opacity: Math.min(1, e * 1.3), boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {cifra && <div style={{ fontFamily: TIPO.display, fontWeight: 800, fontSize: ajustar(cifra, w - 120, T.contador * 0.7, 0.58), color: acento, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{cifra}</div>}
        {texto && <div style={{ fontFamily: TIPO.texto, fontWeight: 800, fontSize: T.titulo * 0.8, color: PALETA.tinta, lineHeight: 1.2 }}>{texto}</div>}
        {(g.datos.etiqueta ?? serie?.etiqueta) && <div style={{ fontFamily: TIPO.texto, fontWeight: 500, fontSize: T.subtitulo, color: PALETA.tintaSuave }}>{g.datos.etiqueta ?? serie?.etiqueta}</div>}
      </div>
    </div>
  );
};
