/**
 * FIXTURE de datos (módulo puro): series INVENTADAS pero plausibles para previsualizar en Studio y probar renders
 * mientras scripts/lib/datos.mts no resuelva una referencia. La fuente dice "FIXTURE" y el pie la pinta en rojo:
 * un video con fixture NUNCA se publica (preparar-* lo avisa).
 */
import { crearAzar, semillaDesde } from '../../../lib/azar';
import { claveDeRef, type DatoRef, type DatosResueltos, type SerieResuelta } from '../datos';

const NOMBRES: Record<string, string> = {
  CHL: 'Chile', ARG: 'Argentina', BRA: 'Brasil', MEX: 'México', PER: 'Perú', COL: 'Colombia', URY: 'Uruguay', PRY: 'Paraguay', BOL: 'Bolivia',
  ECU: 'Ecuador', VEN: 'Venezuela', KOR: 'Corea del Sur', USA: 'Estados Unidos', ESP: 'España', CHN: 'China', JPN: 'Japón', WLD: 'Mundo',
  CRI: 'Costa Rica', PAN: 'Panamá', GTM: 'Guatemala', DOM: 'Rep. Dominicana', CAN: 'Canadá', DEU: 'Alemania', FRA: 'Francia', GBR: 'Reino Unido',
};
export const nombrePais = (iso: string) => NOMBRES[iso] ?? iso;

/** Serie inventada y determinista para una referencia (marcada FIXTURE). */
export const serieFixture = (ref: DatoRef): SerieResuelta => {
  const azar = crearAzar(semillaDesde(claveDeRef(ref)));
  const desde = ref.desde ?? 1990, hasta = ref.hasta ?? 2023;
  const pct = /%/.test(ref.unidad ?? '');
  const series: SerieResuelta['series'] = {};
  ref.paises.forEach((iso, k) => {
    if (ref.valores?.[iso]) { series[iso] = { pais: nombrePais(iso), puntos: ref.valores[iso].map(([anio, valor]) => ({ anio, valor })) }; return; }
    let v = pct ? 3 + azar() * 8 : 2500 + azar() * 9000 * (1 + k * 0.4);
    const crece = pct ? 0 : 0.015 + azar() * 0.045;
    const puntos = [];
    for (let a = desde; a <= hasta; a++) {
      v = pct ? Math.max(0.2, v + (azar() - 0.5) * 2.4) : v * (1 + crece + (azar() - 0.5) * 0.06);
      puntos.push({ anio: a, valor: +v.toFixed(pct ? 2 : 0) });
    }
    series[iso] = { pais: nombrePais(iso), puntos };
  });
  return {
    ref, etiqueta: ref.etiqueta ?? ref.indicador, unidad: ref.unidad ?? '',
    fuenteTexto: `FIXTURE inventado (${ref.indicador})`, fuenteUrl: 'https://example.org/fixture', licencia: 'fixture', consultadoEn: '2026-11-05', series,
  };
};

/** Completa con fixtures las referencias que falten en `datos`. */
export const completarConFixture = (refs: DatoRef[], datos: DatosResueltos = {}): DatosResueltos => {
  const out = { ...datos };
  for (const r of refs) { const k = claveDeRef(r); if (!out[k]) out[k] = serieFixture(r); }
  return out;
};
