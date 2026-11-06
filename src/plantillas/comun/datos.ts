/**
 * Datos y gráficos de EN NÚMEROS ROJOS (módulo puro, sin Remotion): lo comparten el guion (zod), el
 * pipeline de datos de Node (`scripts/lib/datos.mts`), el revisor numérico (`scripts/verificar-cifras.mts`)
 * y las composiciones. Cambiarlo obliga a revisar esos cuatro.
 *
 * Principio del canal: cada cifra que dice la voz existe en un dataset abierto con licencia comercial
 * (CC BY 4.0) y se puede recalcular. Nada de "me dijeron", nada de Numbeo, nada del FMI (exige permiso).
 */
import { z } from 'zod';

/**
 * De dónde salen los datos. Solo fuentes con licencia verificada (docs/CONVENCIONES.md):
 *  - wdi: Banco Mundial, World Development Indicators (CC BY 4.0). `indicador` = código WDI, ej. "NY.GDP.PCAP.PP.KD".
 *  - owid: Our World in Data, grapher (CC BY 4.0; los datos de terceros se citan también). `indicador` = slug del
 *    grapher, ej. "gdp-per-capita-maddison-project-database" (así entra Maddison 2023, también CC BY 4.0).
 *  - manual: valores incrustados en el guion con `fuente` y `fuenteUrl` OBLIGATORIAS (INE, bancos centrales, CEPAL,
 *    SEC EDGAR). El revisor los acepta solo si la URL es de un organismo oficial.
 */
export const FUENTES_DATOS = ['wdi', 'owid', 'manual'] as const;
export type FuenteDatos = (typeof FUENTES_DATOS)[number];

/** Código ISO 3166-1 alfa-3 en mayúsculas (CHL, KOR, ARG…). El Banco Mundial y OWID lo usan; "WLD" = mundo. */
export const Iso3 = z.string().regex(/^[A-Z]{3}$/);

export const PuntoManual = z.tuple([z.number().int().min(1500).max(2100), z.number()]);

export const DatoRef = z.object({
  fuente: z.enum(FUENTES_DATOS),
  /** Código WDI, slug de OWID o un nombre corto propio si es manual ("sueldo-minimo-2026"). */
  indicador: z.string().min(2).max(90),
  /** Países/entidades a traer, ISO3 (1–8). El orden es el orden de aparición en el gráfico. */
  paises: z.array(Iso3).min(1).max(8),
  /** Rango de años (ambos incluidos). Si falta, todo lo disponible. */
  desde: z.number().int().optional(),
  hasta: z.number().int().optional(),
  /** Nombre legible del indicador para la pantalla ("PIB per cápita (PPA, US$ de 2021)"). Si falta, se usa el del dataset. */
  etiqueta: z.string().max(80).optional(),
  /** Unidad corta para los ejes ("US$", "%", "años", "millones"). */
  unidad: z.string().max(20).optional(),
  /** Solo para fuente 'manual': valores por país [[anio, valor], …] y la fuente oficial. */
  valores: z.record(Iso3, z.array(PuntoManual).min(1)).optional(),
  fuenteTexto: z.string().max(120).optional(),
  fuenteUrl: z.string().url().optional(),
}).superRefine((d, ctx) => {
  if (d.fuente === 'manual') {
    if (!d.valores) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'fuente manual: faltan `valores`' });
    if (!d.fuenteTexto || !d.fuenteUrl) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'fuente manual: faltan `fuenteTexto` y `fuenteUrl` (organismo oficial)' });
  }
  if (d.desde && d.hasta && d.desde > d.hasta) ctx.addIssue({ code: z.ZodIssueCode.custom, message: '`desde` > `hasta`' });
});
export type DatoRef = z.infer<typeof DatoRef>;

/** Serie ya descargada y normalizada (la escribe scripts/lib/datos.mts en los props; NO va en los guiones). */
export const SerieResuelta = z.object({
  ref: DatoRef,
  etiqueta: z.string(),
  unidad: z.string(),
  /** Texto de la fuente para pantalla y descripción: "Banco Mundial, WDI (NY.GDP.PCAP.PP.KD), consultado 2026-11-06". */
  fuenteTexto: z.string(),
  fuenteUrl: z.string().url(),
  licencia: z.string(),
  consultadoEn: z.string(),
  series: z.record(Iso3, z.object({
    pais: z.string(),
    puntos: z.array(z.object({ anio: z.number().int(), valor: z.number() })),
  })),
});
export type SerieResuelta = z.infer<typeof SerieResuelta>;

/**
 * Tipos de gráfico que sabe dibujar la plantilla. Todos se construyen con la voz (la línea se dibuja, las barras
 * crecen, el contador cuenta) y llevan la fuente abajo en pequeño, siempre.
 *  - lineas: evolución de 1–6 países en el tiempo (el caso típico: "Chile vs Corea 1960–2024").
 *  - barras: comparación entre países en UN año (horizontal, ordenadas).
 *  - area: una sola serie con relleno (deuda, inflación acumulada).
 *  - ranking: barras que se reordenan entre dos o más años (bar chart "race" corto, 2–4 cortes, con narración).
 *  - contador: UNA cifra enorme que cuenta hasta su valor cuando la voz la dice (+ etiqueta y fuente).
 *  - comparacion: dos cifras grandes lado a lado (A vs B) con la razón entre ellas ("3,1×").
 *  - mapa: coroplético discreto del mundo o de América (world-atlas, dominio público) coloreado por el valor del año.
 *  - tarjeta: dato textual con fuente (cuando no hay serie: "Ley 21.XXX, 2024").
 */
export const TIPOS_GRAFICO = ['lineas', 'barras', 'area', 'ranking', 'contador', 'comparacion', 'mapa', 'tarjeta'] as const;

export const Grafico = z.object({
  tipo: z.enum(TIPOS_GRAFICO),
  /** Título corto del gráfico en pantalla (≤ 60): la pregunta o el hallazgo, no el nombre del indicador. */
  titulo: z.string().min(2).max(60),
  datos: DatoRef,
  /** Qué resaltar: un país (color de acento), un año (línea vertical) o un punto concreto. */
  destacar: z.object({ pais: Iso3.optional(), anio: z.number().int().optional(), texto: z.string().max(40).optional() }).optional(),
  /** Anotaciones con fecha ("1973: golpe", "1997: crisis asiática") que aparecen cuando la voz llega ahí. */
  anotaciones: z.array(z.object({ anio: z.number().int(), texto: z.string().min(1).max(40) })).max(6).optional(),
  formato: z.object({
    decimales: z.number().int().min(0).max(2).optional(),
    prefijo: z.string().max(6).optional(),
    sufijo: z.string().max(12).optional(),
    escala: z.enum(['lineal', 'log']).optional(),
  }).optional(),
  /** Palabra EXACTA del texto de la voz con la que empieza a dibujarse (si falta, al empezar la escena). */
  dice: z.string().optional(),
});
export type Grafico = z.infer<typeof Grafico>;

/**
 * Cifra que dice la voz y que el revisor numérico (`scripts/verificar-cifras.mts`) recalcula contra el dataset.
 * Cada escena con `grafico` o con números en la voz declara sus cifras. `texto` es el fragmento EXACTO como lo
 * dice la voz ("unos 3.200 dólares", "el triple", "un 45 %"); `valor` el número que afirma; `calculo` cómo
 * se obtiene del dataset. Tolerancia por defecto 5 % (redondeos de la voz).
 */
export const Cifra = z.object({
  texto: z.string().min(1).max(60),
  valor: z.number(),
  calculo: z.object({
    datos: DatoRef,
    /** valor: el dato del país en el año · razon: paisA / paisB en el año · variacion: (hasta − desde) / desde · diferencia: paisA − paisB · maximo/minimo: en el rango · promedio: del rango · ranking: posición del país entre `paises` en el año. */
    operacion: z.enum(['valor', 'razon', 'variacion', 'diferencia', 'maximo', 'minimo', 'promedio', 'ranking']),
    pais: Iso3.optional(),
    paisB: Iso3.optional(),
    anio: z.number().int().optional(),
    anioB: z.number().int().optional(),
  }),
  tolerancia: z.number().min(0).max(0.25).optional(),
});
export type Cifra = z.infer<typeof Cifra>;

/**
 * Clave estable de una referencia de datos: con ella `preparar-*` guarda las series resueltas en
 * `props.datos[clave]` y las composiciones las encuentran desde cada `Grafico`/`Cifra` sin volver a la red.
 */
export const claveDeRef = (r: DatoRef) =>
  `${r.fuente}:${r.indicador}:${[...r.paises].join(',')}:${r.desde ?? ''}-${r.hasta ?? ''}`;

/** Forma de `props.datos` que escriben preparar-tesis / preparar-grafico. */
export const DatosResueltos = z.record(z.string(), SerieResuelta);
export type DatosResueltos = z.infer<typeof DatosResueltos>;
