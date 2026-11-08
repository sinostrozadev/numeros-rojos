/**
 * Recursos visuales de EN NÚMEROS ROJOS, v2 (2026-11-07, orden de Santiago: "aprovechar todas las herramientas").
 * Módulo puro (sin Remotion): lo comparten el contrato del guion (zod), los `preparar-*` (que resuelven fotos y
 * mapas) y las composiciones. El gráfico sigue siendo el rey de los DATOS; esto cubre todo lo demás que dice la voz:
 * lugares (mapa), historia y objetos (foto de Wikimedia Commons con licencia), enumeraciones (iconos), conceptos
 * sin foto posible (ilustración plana pedida a GPT) y la mascota del canal (comenta, no explica).
 *
 * Reglas duras (docs/CONVENCIONES.md):
 *  - Una foto solo entra con licencia PD/CC0/CC BY/CC BY-SA y crédito en pantalla y en la descripción.
 *  - Nada realista generado por IA: las ilustraciones son planas/vectoriales y se declaran como ilustración.
 *  - El mapa es Natural Earth (world-atlas, dominio público): países, etiquetas y flechas; sin calles.
 */
import { z } from 'zod';
import { Iso3 } from './datos';

export const LonLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
export type LonLat = z.infer<typeof LonLat>;

/** Foto de archivo: `preparar-*` busca en Commons con `busqueda`, elige la primera con licencia clara y la descarga. */
export const VisualFoto = z.object({
  tipo: z.literal('foto'),
  /** Términos de búsqueda en Commons, en inglés y concretos ("Port of Busan container terminal 1970s", "Buenos Aires Avenida de Mayo 1900"). */
  busqueda: z.string().min(3).max(120),
  /** Alternativas si la primera búsqueda no da una foto con licencia (se prueban en orden). */
  alternativas: z.array(z.string().min(3).max(120)).max(3).optional(),
  /** Pie de foto en pantalla (≤ 70): qué se ve y cuándo ("Puerto de Busan, 1975"). */
  pie: z.string().max(70).optional(),
  /** Palabra EXACTA de la voz con la que aparece (si falta, al empezar la escena). */
  dice: z.string().optional(),
  encuadre: z.enum(['ken-burns', 'fijo']).optional(),
});

/** Mapa de países (Natural Earth): se centra, destaca países en los colores de las series y dibuja etiquetas/flechas. */
export const VisualMapa = z.object({
  tipo: z.literal('mapa'),
  /** Países a resaltar (orden = color de serie; el primero va en dorado). */
  destacar: z.array(Iso3).min(1).max(8),
  /** Centro y zoom (1 = mundo, 3 = continente, 5 = país grande, 7 = país chico). Si faltan, se calculan desde `destacar`. */
  centro: LonLat.optional(),
  zoom: z.number().min(1).max(7).optional(),
  /** Etiquetas sueltas (ciudad, puerto, mar) con su posición. */
  etiquetas: z.array(z.object({ texto: z.string().min(1).max(30), en: LonLat })).max(6).optional(),
  /** Flechas de A → B (comercio, migración, capital). `texto` corto sobre la flecha ("cobre", "US$ 2.000 M"). */
  flechas: z.array(z.object({ desde: Iso3, hasta: Iso3, texto: z.string().max(24).optional() })).max(6).optional(),
  /** Viaje de cámara durante la escena: de `zoom` − 2 al `zoom` final (si false, cámara fija). */
  acercar: z.boolean().optional(),
  /**
   * v3 (orden de Santiago, 2026-11-07): VIAJE entre países para marcar un cambio grande de protagonista ("hasta aquí Corea;
   * ahora Chile"). La cámara arranca sobre `desde` (zoom de país), al decir `dice` (o al entrar el mapa) vuela por el círculo
   * máximo hasta `hasta` y termina acercada sobre él. Se usa 1–2 veces por video, SOLO en cambios grandes, nunca escena a escena.
   */
  viaje: z.object({ desde: Iso3, hasta: Iso3, dice: z.string().optional() }).optional(),
  dice: z.string().optional(),
});

/** Lista de 2–6 conceptos con icono (emoji de Noto Color Emoji o pictograma propio) que aparecen a medida que la voz los nombra. */
export const VisualIconos = z.object({
  tipo: z.literal('iconos'),
  items: z.array(z.object({
    /** Emoji ("🚢", "⚙️") o nombre de pictograma propio ("barco", "dinero", "tren"; ver src/plantillas/comun/pictogramas). */
    icono: z.string().min(1).max(24),
    texto: z.string().min(1).max(28),
    /** Cifra opcional bajo el texto ("52 %", "US$ 413"). */
    valor: z.string().max(16).optional(),
    /** v3: `no` = cruz roja sobre el icono ("no tiene petróleo"), `si` = check verde ("tiene minas"). Sin marca = neutro. */
    marca: z.enum(['si', 'no']).optional(),
    /** Palabra EXACTA de la voz con la que aparece este ítem (si falta, se reparten en el tiempo de la escena). */
    dice: z.string().optional(),
  })).min(2).max(6),
  /** Título corto encima de la lista (≤ 40). */
  titulo: z.string().max(40).optional(),
  dice: z.string().optional(),
});

/**
 * Ilustración plana pedida a GPT (skill `caratulas-con-gpt`): el guion trae el prompt; `scripts/ilustraciones.mts` la pide y la
 * deja en public/ilustraciones/<id>/<n>.png. Si el archivo no existe al renderizar, la escena cae al gráfico previo (nunca rompe).
 */
export const VisualIlustracion = z.object({
  tipo: z.literal('ilustracion'),
  /** Qué se ve, para el generador (en español, concreto, estilo plano vectorial sobre #111418; sin texto dentro). */
  prompt: z.string().min(20).max(600),
  /** Pie opcional en pantalla ("Ilustración"). */
  pie: z.string().max(70).optional(),
  dice: z.string().optional(),
});

/**
 * v3 (2026-11-07, pedido de Santiago al ver Chile-Corea): DOS columnas con bandera, una por país, con ítems que entran
 * cuando la voz los nombra (`dice`) y llevan cruz roja (`no`) o check verde (`si`). Para "Corea no tiene petróleo ni cobre…
 * Chile tiene minas, puertos…". `apuesta`: al decir `dice`, una ficha se desliza hacia el país favorito ("la apuesta obvia era Chile").
 */
export const VisualVersus = z.object({
  tipo: z.literal('versus'),
  titulo: z.string().max(40).optional(),
  lados: z.tuple([
    z.object({
      pais: Iso3,
      /** Subtítulo bajo la bandera (≤ 24; por defecto el nombre del país). */
      titulo: z.string().max(24).optional(),
      items: z.array(z.object({
        icono: z.string().min(1).max(24),
        texto: z.string().min(1).max(28),
        marca: z.enum(['si', 'no']).optional(),
        /** Palabra EXACTA de la voz con la que entra el ítem. */
        dice: z.string().optional(),
      })).min(1).max(5),
    }),
    z.object({
      pais: Iso3,
      titulo: z.string().max(24).optional(),
      items: z.array(z.object({
        icono: z.string().min(1).max(24),
        texto: z.string().min(1).max(28),
        marca: z.enum(['si', 'no']).optional(),
        dice: z.string().optional(),
      })).min(1).max(5),
    }),
  ]),
  /** Ficha de apuesta que se desliza hacia `pais` cuando la voz dice `dice` (≤ 20 de texto: "LA APUESTA OBVIA"). */
  apuesta: z.object({ pais: Iso3, dice: z.string(), texto: z.string().max(20).optional() }).optional(),
  /** Palabra EXACTA de la voz con la que aparece el visual (si falta, al empezar la escena). */
  dice: z.string().optional(),
});
export type VisualVersus = z.infer<typeof VisualVersus>;

export const Visual = z.discriminatedUnion('tipo', [VisualFoto, VisualMapa, VisualIconos, VisualIlustracion, VisualVersus]);
export type Visual = z.infer<typeof Visual>;
export const TIPOS_VISUAL = ['foto', 'mapa', 'iconos', 'ilustracion', 'versus'] as const;

/**
 * v3: SELLO sobre el gráfico (o sobre el visual si la escena no tiene gráfico): un dato grande que la voz acaba de decir,
 * estampado encima del contenido en el momento exacto ("4×" con la bandera de Chile; "9 de 10" con la de Corea). `animo`
 * tiñe el sello: `feliz` dorado con flecha arriba, `triste` rojo con flecha abajo. Máximo 3 por escena; uno a la vez en pantalla.
 */
export const Sello = z.object({
  /** Texto corto y enorme (≤ 10): "4×", "3 a 1", "12 VECES". */
  texto: z.string().min(1).max(10),
  /** Bandera del país al que pertenece el dato. */
  pais: Iso3.optional(),
  animo: z.enum(['feliz', 'triste']).optional(),
  /** Palabra EXACTA de la voz con la que se estampa. Obligatoria. */
  dice: z.string().min(1),
});
export type Sello = z.infer<typeof Sello>;

/** Poses de la mascota (una imagen por pose en public/mascota/<pose>.png; hasta que lleguen, un dibujo SVG de reserva). */
export const POSES_MASCOTA = ['saluda', 'senala', 'piensa', 'sorpresa', 'tapa-ojos', 'celebra'] as const;
export type PoseMascota = (typeof POSES_MASCOTA)[number];

/** La mascota comenta en una esquina (no explica): pose + bocadillo corto opcional. Máximo 1 por escena, ≤ 1 de cada 3 escenas. */
export const Mascota = z.object({
  pose: z.enum(POSES_MASCOTA),
  /** Bocadillo ≤ 40 caracteres ("¿3 veces? ¡Uf!"). */
  bocadillo: z.string().max(40).optional(),
  /** Palabra EXACTA de la voz con la que entra (si falta, al empezar la escena). */
  dice: z.string().optional(),
});
export type Mascota = z.infer<typeof Mascota>;

/** Cómo conviven visual y gráfico en la misma escena. Si falta: `dividido` cuando hay ambos, `completo` si hay uno solo. */
export const DISPOSICIONES = ['completo', 'dividido'] as const;

/** Clave estable de un visual dentro del guion (capítulo, escena) para que preparar-* guarde lo resuelto en props.visuales. */
export const claveDeVisual = (capitulo: number, escena: number) => `c${capitulo}e${escena}`;

/** Foto ya resuelta por preparar-* (descargada en public/imagenes/<id>/): la composición la lee de props.visuales[clave]. */
export const FotoResuelta = z.object({
  archivo: z.string(),
  ancho: z.number().int(),
  alto: z.number().int(),
  titulo: z.string(),
  autor: z.string(),
  licencia: z.string(),
  pagina: z.string().url(),
});
export type FotoResuelta = z.infer<typeof FotoResuelta>;
export const VisualesResueltos = z.record(z.string(), z.object({ foto: FotoResuelta.optional(), ilustracion: z.string().optional() }));
export type VisualesResueltos = z.infer<typeof VisualesResueltos>;
