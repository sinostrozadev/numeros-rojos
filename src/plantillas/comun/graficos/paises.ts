/**
 * ISO 3166-1 alfa-3 → código numérico (el `id` de world-atlas, dominio público) y región, para el mapa coroplético.
 * Cubre América completa y las economías que más aparecen en el canal; agregar aquí si falta un país.
 */
export const ISO_NUM: Record<string, string> = {
  // América del Sur
  ARG: '032', BOL: '068', BRA: '076', CHL: '152', COL: '170', ECU: '218', GUY: '328', PRY: '600', PER: '604', SUR: '740', URY: '858', VEN: '862',
  // Centroamérica, Caribe y Norteamérica
  MEX: '484', GTM: '320', BLZ: '084', HND: '340', SLV: '222', NIC: '558', CRI: '188', PAN: '591', CUB: '192', DOM: '214', HTI: '332', JAM: '388',
  PRI: '630', TTO: '780', BHS: '044', USA: '840', CAN: '124',
  // Europa
  ESP: '724', PRT: '620', FRA: '250', DEU: '276', ITA: '380', GBR: '826', IRL: '372', NLD: '528', BEL: '056', CHE: '756', AUT: '040', SWE: '752',
  NOR: '578', FIN: '246', DNK: '208', POL: '616', GRC: '300', CZE: '203', HUN: '348', ROU: '642', BGR: '100', UKR: '804', RUS: '643', TUR: '792',
  // Asia y Oceanía
  CHN: '156', JPN: '392', KOR: '410', PRK: '408', TWN: '158', IND: '356', IDN: '360', MYS: '458', SGP: '702', THA: '764', VNM: '704', PHL: '608',
  PAK: '586', BGD: '050', AUS: '036', NZL: '554', KAZ: '398', SAU: '682', ARE: '784', ISR: '376', IRN: '364', IRQ: '368',
  // África
  ZAF: '710', NGA: '566', EGY: '818', ETH: '231', KEN: '404', MAR: '504', DZA: '012', GHA: '288', AGO: '024',
};

export const SUDAMERICA = new Set(['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'ECU', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN']);
export const AMERICA = new Set([...SUDAMERICA, 'MEX', 'GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'DOM', 'HTI', 'JAM', 'PRI', 'TTO', 'BHS', 'USA', 'CAN']);

export type RegionMapa = 'sudamerica' | 'america' | 'mundo';
export const regionDe = (isos: string[]): RegionMapa =>
  isos.every((i) => SUDAMERICA.has(i)) ? 'sudamerica' : isos.every((i) => AMERICA.has(i)) ? 'america' : 'mundo';
