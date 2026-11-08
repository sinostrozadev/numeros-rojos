/**
 * Banderas de los visuales v3 (versus, sello): ISO 3166-1 alfa-3 → emoji de bandera (par de indicadores regionales
 * del alfa-2), que Chrome de Remotion dibuja con Noto Color Emoji (verificado con stills el 2026-11-07). Módulo puro.
 */
import { nombrePais } from './mapa';

/** ISO3 → ISO2. Cubre todos los países de `PAISES` (mapa.ts) y los grandes de fuera de la región. */
export const ISO2: Record<string, string> = {
  // América del Sur
  ARG: 'AR', BOL: 'BO', BRA: 'BR', CHL: 'CL', COL: 'CO', ECU: 'EC', GUY: 'GY', PRY: 'PY', PER: 'PE', SUR: 'SR', URY: 'UY', VEN: 'VE',
  // Centroamérica, Caribe y Norteamérica
  MEX: 'MX', GTM: 'GT', BLZ: 'BZ', HND: 'HN', SLV: 'SV', NIC: 'NI', CRI: 'CR', PAN: 'PA', CUB: 'CU', DOM: 'DO', HTI: 'HT', JAM: 'JM',
  PRI: 'PR', TTO: 'TT', BHS: 'BS', USA: 'US', CAN: 'CA',
  // Europa
  ESP: 'ES', PRT: 'PT', FRA: 'FR', DEU: 'DE', ITA: 'IT', GBR: 'GB', IRL: 'IE', NLD: 'NL', BEL: 'BE', CHE: 'CH', AUT: 'AT', SWE: 'SE',
  NOR: 'NO', FIN: 'FI', DNK: 'DK', ISL: 'IS', POL: 'PL', GRC: 'GR', CZE: 'CZ', HUN: 'HU', ROU: 'RO', BGR: 'BG', UKR: 'UA', RUS: 'RU',
  TUR: 'TR', EST: 'EE', LUX: 'LU',
  // Asia y Oceanía
  CHN: 'CN', JPN: 'JP', KOR: 'KR', PRK: 'KP', TWN: 'TW', IND: 'IN', IDN: 'ID', MYS: 'MY', SGP: 'SG', THA: 'TH', VNM: 'VN', PHL: 'PH',
  PAK: 'PK', BGD: 'BD', AUS: 'AU', NZL: 'NZ', KAZ: 'KZ', SAU: 'SA', ARE: 'AE', QAT: 'QA', ISR: 'IL', IRN: 'IR', IRQ: 'IQ', HKG: 'HK',
  // África
  ZAF: 'ZA', NGA: 'NG', EGY: 'EG', ETH: 'ET', KEN: 'KE', MAR: 'MA', DZA: 'DZ', GHA: 'GH', AGO: 'AO', BWA: 'BW', COD: 'CD', ZMB: 'ZM',
};

/** Emoji de bandera de un ISO3 ('' si el país no está en la tabla: el componente dibuja entonces una placa con el código). */
export const banderaEmoji = (iso3: string): string => {
  const a2 = ISO2[iso3.toUpperCase()];
  if (!a2) return '';
  return String.fromCodePoint(...[...a2].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

/** Nombre corto en español para rótulos (versus, sello): sin "del Sur" ni artículos largos. */
const CORTOS: Record<string, string> = { KOR: 'Corea', PRK: 'Corea del Norte', USA: 'EE. UU.', GBR: 'Reino Unido', ARE: 'Emiratos', DOM: 'R. Dominicana', COD: 'R. D. Congo', NLD: 'Países Bajos', SAU: 'Arabia Saudita' };
export const nombreCorto = (iso3: string): string => CORTOS[iso3] ?? nombrePais(iso3);
