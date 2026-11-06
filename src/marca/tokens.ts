/**
 * Sistema de marca de EN NÚMEROS ROJOS.
 * Única fuente de verdad para colores, tipografía, formatos y ritmo. Toda plantilla importa de aquí.
 * Dos formatos: el LARGO 16:9 (plantilla `tesis`, el producto) y el SHORT 9:16 (plantilla `grafico`, el embudo).
 */
export const FORMATO_LARGO = {
  ancho: 1920,
  alto: 1080,
  fps: 30,
  /** Margen interior del largo (nada pegado al borde; el reproductor no tapa nada). */
  seguro: { arriba: 60, abajo: 70, lados: 80 },
} as const;

export const FORMATO_SHORT = {
  ancho: 1080,
  alto: 1920,
  fps: 60,
  /** Zona segura vertical para Shorts: la UI de YouTube tapa ~200 px arriba y ~330 px abajo (y la columna de botones a la derecha). */
  seguro: { arriba: 220, abajo: 340, lados: 60 },
} as const;

/** Compatibilidad con los componentes comunes heredados (subtítulos, disposición): el Short es el formato por defecto. */
export const FORMATO = FORMATO_SHORT;

export const PALETA = {
  /** Grafito: fondo de todo. */
  fondo: '#111418',
  /** Paneles y cajas. */
  fondo2: '#1B2027',
  /** Rejilla y ejes. */
  borde: '#2A313B',
  tinta: '#FFFFFF',
  tintaSuave: '#AEB7C2',
  /** Verde billete: la serie principal, lo que sube. */
  verde: '#2ECC71',
  /** Rojo "números rojos": caídas, el país que pierde, el giro. */
  rojo: '#FF4D4D',
  /** Dorado: la cifra clave, el rótulo. */
  dorado: '#F5C451',
  /** Azul: segunda serie, agua en el mapa. */
  azul: '#4FA3F7',
  /** Violeta: tercera serie. */
  violeta: '#9B7CF0',
} as const;

/** Orden de colores para series de hasta 6 países (el país destacado siempre va en dorado). */
export const SERIES = [PALETA.verde, PALETA.azul, PALETA.violeta, '#F08A4B', '#5ED6D1', '#E86FB1'] as const;

/** Acento por video (caja del subtítulo, palabra clave, tarjetas). Dorado por defecto. */
export const ACENTOS = { dorado: '#F5C451', verde: '#2ECC71', rojo: '#FF4D4D' } as const;
export type Acento = keyof typeof ACENTOS;

/** Fondo con transparencia (velos sobre gráficos). */
export const fondoAlfa = (a: number) => `rgba(17,20,24,${a})`;

export const TIPO = {
  /** Títulos y cifras enormes. */
  display: 'Bricolage Grotesque',
  /** Subtítulos, ejes, créditos, fuentes. */
  texto: 'Inter',
  pesoRotulo: 800,
  pesoDisplay: 800,
  /** Condensada en mayúsculas para subtítulos, etiquetas de gráfico y cabeceras. */
  condensada: 'Bebas Neue',
  condensadaPeso: 'Oswald',
  /** Cifras tabulares (ejes, contadores): monoespaciada con dígitos alineados. */
  mono: 'JetBrains Mono',
  /** Emoji a color (instalada en el sistema: ~/.local/share/fonts/NotoColorEmoji.ttf). */
  emoji: 'Noto Color Emoji',
} as const;

/** Duraciones en segundos. */
export const RITMO = {
  shortMin: 35,
  shortMax: 55,
  largoMin: 8 * 60 + 30,
  largoMax: 12 * 60 + 30,
  /** Cierre de marca al final. */
  cierre: 1.2,
  /** Pantalla final del largo (siguiente video + suscripción) en segundos. */
  pantallaFinal: 20,
} as const;

export const MARCA = {
  nombre: 'En Números Rojos',
  handle: '@enumerosrojos',
  lema: 'La economía, con la cuenta en pantalla.',
  /** Marca de agua discreta esquina superior derecha, dentro de la zona segura. */
  marcaDeAgua: { tamano: 28, opacidad: 0.65 },
  /** Aviso fijo al pie de la pantalla final y en la descripción. */
  aviso: 'No es asesoría financiera. Datos abiertos con fuente en pantalla. Voz sintetizada.',
} as const;

/**
 * Orden de color para las series NO destacadas de un gráfico (el destacado va en dorado y el rojo queda reservado
 * para el giro). Validado con la skill dataviz (validate_palette.js, modo oscuro sobre #111418, 2026-11-05):
 * dorado → azul → rosa → verde → violeta → cian pasa separación CVD (ΔE ≥ 9,5 entre vecinos) y visión normal
 * (ΔE ≥ 23); `SERIES` en su orden original pone azul junto a violeta (ΔE 3,3 deutan: indistinguibles). Las líneas
 * llevan además etiqueta directa al final (codificación secundaria).
 */
export const SERIES_GRAFICO = [PALETA.azul, '#E86FB1', PALETA.verde, PALETA.violeta, '#5ED6D1', '#F08A4B'] as const;

/** Gris neutro para países sin dato en el mapa y series de contexto. */
export const GRIS_SIN_DATO = '#3A424D';

/**
 * Escala tipográfica de los gráficos por formato (px a resolución nativa). El Short se ve en un celular a ~6 cm de
 * ancho: nada por debajo de 30 px en 1080 de ancho.
 */
export const TIPO_GRAFICO = {
  largo: { titulo: 50, subtitulo: 28, eje: 24, etiqueta: 28, valor: 34, fuente: 21, anotacion: 24, contador: 210, subtitulos: 50 },
  short: { titulo: 60, subtitulo: 34, eje: 32, etiqueta: 36, valor: 42, fuente: 27, anotacion: 32, contador: 230, subtitulos: 66 },
} as const;
export type ModoGrafico = keyof typeof TIPO_GRAFICO;

/** Barras de contexto (países no destacados en barras/ranking cuando hay un destacado). */
export const GRIS_BARRA = '#56657A';

/** Rampa secuencial (un solo tono, oscuro → claro sobre fondo grafito) del mapa coroplético: 5 cubetas. */
export const RAMPA_MAPA = ['#1D3147', '#24507A', '#2F72AD', '#4FA3F7', '#9CCBFF'] as const;
