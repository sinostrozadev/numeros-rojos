/**
 * Contrato de guion de EN NÚMEROS ROJOS, compartido por las dos plantillas:
 *  - `tesis`   → largo 16:9 (1920×1080, 30 fps) de 9–12 min: UNA pregunta económica, UNA tesis, 3–5 capítulos con
 *                un gráfico cada uno y un giro de datos al final de cada capítulo. Es el producto (horas y mid-rolls).
 *  - `grafico` → Short 9:16 (1080×1920, 60 fps) de 35–50 s: UN gráfico que se construye con la voz y un giro.
 *                Es el embudo al largo.
 * Este archivo es a la vez el validador (zod) y el texto que lee `scripts/generar-guiones.mts` para explicarle a
 * Claude qué escribir: cada campo lleva su documentación. Cambiarlo obliga a revisar voz.mts, plan.ts,
 * preparar-*.mts, verificar-cifras.mts, generar-guiones.mts y docs/GUION.md.
 *
 * Fórmula (docs/GUION.md): gancho con contradicción medible → pregunta cerrada + promesa → índice (3–5 paradas) →
 * capítulos [pregunta → dato con gráfico y fuente en pantalla → giro de datos] → "el número que nadie mira" →
 * qué significa para el espectador latino (sin consejo) → remate simétrico → pregunta que abre el siguiente largo.
 * Tono: evidencia, no catastrofismo. Prohibido en títulos y remates: "colapso", "destruir", "el fin", "se acerca".
 */
import { z } from 'zod';
import { Cifra, Grafico, Iso3 } from './datos';

export const PLANTILLAS_CANAL = ['tesis', 'grafico'] as const;
export type PlantillaCanal = (typeof PLANTILLAS_CANAL)[number];

/** Voces de msedge-tts permitidas. Por defecto es-MX-JorgeNeural (A/B con es-CL-LorenzoNeural en los primeros videos). */
export const VOCES = ['es-MX-JorgeNeural', 'es-CL-LorenzoNeural', 'es-ES-AlvaroNeural', 'es-MX-DaliaNeural'] as const;
export const VOZ_POR_DEFECTO: (typeof VOCES)[number] = 'es-MX-JorgeNeural';

/** Palabras habladas del LARGO (gancho + promesa + capítulos + número + remate + siguiente): ≈ 9–12 min a ~2,7 palabras/s. */
export const PALABRAS_TESIS_MIN = 1350;
export const PALABRAS_TESIS_MAX = 1950;
/** Palabras habladas del SHORT: ≈ 35–50 s. */
export const PALABRAS_GRAFICO_MIN = 85;
export const PALABRAS_GRAFICO_MAX = 150;

/** Palabras prohibidas en títulos, cabeceras y remates (catastrofismo = marca de la competencia y riesgo de brand safety). */
export const PROHIBIDAS_TITULO = /colaps|destru|el fin de|se acerca|apocalip|hundir|quebrar[áa]|última oportunidad/i;

/**
 * Estructura argumental del largo. Las 4 rotan (ninguna > 40 % de los largos de la semana) para que los videos se
 * vean distintos en la hoja de contacto (regla YPP "contenido inauténtico"):
 *  - comparacion: dos o más países/empresas frente a frente en el tiempo ("Chile vs Corea").
 *  - linea-de-tiempo: un solo sujeto y sus quiebres ("Argentina, de rica a estancada en 5 gráficos").
 *  - autopsia: cómo quebró / cómo despegó algo concreto, causa por causa.
 *  - cuanto-rinde: la cuenta de la vida diaria entre países (sueldo, arriendo, jubilación) con la operación en pantalla.
 */
export const ESTRUCTURAS = ['comparacion', 'linea-de-tiempo', 'autopsia', 'cuanto-rinde'] as const;

export const TIPOS_ESCENA = ['planteamiento', 'dato', 'giro', 'respiro', 'reenganche', 'significado'] as const;

export const Escena = z.object({
  /**
   * Papel de la escena:
   *  - planteamiento: abre el capítulo con una pregunta o una creencia común (1 por capítulo, la primera).
   *  - dato: un hecho con su gráfico y la fuente nombrada en la voz al menos una vez por capítulo.
   *  - giro: el dato contraintuitivo que cambia la lectura (EXACTAMENTE 1 por capítulo, la última o penúltima).
   *  - respiro: 3–4 s sin voz, el gráfico queda solo (`texto` vacío permitido); 1 por capítulo como máximo.
   *  - reenganche: frase-anzuelo de 1–2 oraciones justo antes del corte publicitario (solo en el largo, capítulos ≥ 2).
   *  - significado: qué quiere decir esto para el espectador latino, SIN consejo (solo en el último capítulo).
   */
  tipo: z.enum(TIPOS_ESCENA),
  /** Lo que dice la voz: UNA idea, frases cortas, cifras redondeadas como se hablan ("unos 3.200 dólares"). Vacío solo en `respiro`. */
  texto: z.string(),
  /** Gráfico que se construye durante esta escena. Obligatorio en las escenas `dato`. */
  grafico: Grafico.optional(),
  /** Cifras que dice la voz en esta escena, para el revisor numérico. Obligatorio si el texto tiene números con dataset. */
  cifras: z.array(Cifra).max(6).optional(),
  /** Rótulo corto (1–4 palabras) que aparece cuando la voz dice `dice`; va en la caja de acento, no tapa el gráfico. */
  rotulo: z.object({ texto: z.string().min(1).max(28), dice: z.string().optional() }).optional(),
  /** true si la voz nombra la fuente ("según el Banco Mundial…"). Obligatorio en ≥ 1 escena por capítulo. */
  fuenteEnVoz: z.boolean().optional(),
  /** Segundos de silencio al final de la escena (respiro visual). En `respiro` por defecto 3,5. */
  respiroSeg: z.number().min(0).max(6).optional(),
  /** Qué país se enciende en esta escena (p. ej. en el `giro` el que da la sorpresa). Si falta, el de `grafico.destacar.pais`. */
  enfasis: z.object({ pais: Iso3 }).optional(),
  /** Solo en el Short: la escena `dato` sigue mostrando el gráfico principal (`props.grafico`) sin copiarlo entero. */
  usaGraficoPrincipal: z.boolean().optional(),
}).superRefine((e, ctx) => {
  if (e.tipo !== 'respiro' && e.texto.trim().length < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `escena ${e.tipo} sin texto` });
  if (e.tipo === 'dato' && !e.grafico && !e.usaGraficoPrincipal) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'escena dato sin gráfico (o sin usaGraficoPrincipal en el Short)' });
});
export type Escena = z.infer<typeof Escena>;

export const Capitulo = z.object({
  /** Título SEO del capítulo (≤ 50): va a la descripción con su timestamp y a la tarjeta de capítulo ("Por qué Corea apostó al acero"). */
  titulo: z.string().min(3).max(50),
  /** 3–8 escenas: empieza con `planteamiento`, tiene ≥ 1 `dato` con gráfico y exactamente 1 `giro`. */
  escenas: z.array(Escena).min(3).max(8),
}).superRefine((c, ctx) => {
  const tipos = c.escenas.map((e) => e.tipo);
  if (tipos[0] !== 'planteamiento') ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": la primera escena debe ser planteamiento` });
  if (!tipos.includes('dato')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": sin escena dato` });
  if (tipos.filter((t) => t === 'giro').length !== 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": debe tener exactamente 1 giro` });
  if (tipos.filter((t) => t === 'respiro').length > 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": máximo 1 respiro` });
  if (!c.escenas.some((e) => e.fuenteEnVoz)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": ninguna escena nombra la fuente en la voz` });
  if (PROHIBIDAS_TITULO.test(c.titulo)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo "${c.titulo}": palabra prohibida (catastrofismo)` });
});
export type Capitulo = z.infer<typeof Capitulo>;

export const Fuente = z.object({ texto: z.string().min(1), url: z.string().url() });

/** Campos comunes a las dos plantillas. */
export const CamposBase = z.object({
  /** Igual al id del envoltorio (el pipeline lo reescribe al promover el guion). */
  id: z.string().min(1),
  voz: z.enum(VOCES).optional(),
  gancho: z.object({
    /** Cold open: la contradicción medible en la PRIMERA frase + la pregunta cerrada. Largo: 2–4 frases. Short: 1–2. */
    texto: z.string().min(1),
    /** 1–4 palabras que se ven ENTERAS en el frame 0 ("CHILE VS COREA", "3,1 VECES"). */
    rotulo: z.string().min(1).max(28),
    /** Gráfico del cold open (opcional): en el largo suele ser el `contador` o la `comparacion` que resume la contradicción. */
    grafico: Grafico.optional(),
    cifras: z.array(Cifra).max(4).optional(),
  }),
  /** Frase final SIMÉTRICA (dos mitades espejo), gigante en dos líneas. ≤ 130 caracteres. Sin palabras prohibidas. */
  remate: z.string().min(1).max(130),
  /** Fuentes verificables: van a la descripción. Largo ≥ 4, Short ≥ 1. Siempre la URL del dataset exacto. */
  fuentes: z.array(Fuente).min(1),
});
export type GuionBase = z.infer<typeof CamposBase>;

/** Cuenta palabras habladas (tokens separados por espacio que tienen letra o número). */
export const contarPalabras = (texto: string) => texto.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;

// ---------------------------------------------------------------- TESIS (largo 16:9)
export const CamposTesis = CamposBase.extend({
  /** Título corto en pantalla durante el video, arriba a la izquierda, mayúsculas (≤ 44): "CHILE VS COREA DEL SUR · 1960–2024". */
  cabecera: z.string().min(3).max(44),
  /** Qué sabrá el espectador al final, en una frase que dice la voz tras el gancho ("Al final vas a saber por qué…"). */
  promesa: z.string().min(10).max(220),
  /** 3–5 paradas del índice (≤ 24 c/u) que se ven como lista con pictogramas y luego marcan cada capítulo. */
  indice: z.array(z.string().min(2).max(24)).min(3).max(5),
  estructura: z.enum(ESTRUCTURAS),
  /** 3–5 capítulos. Los capítulos ≥ 2 terminan con un `reenganche` si el video lleva pausas publicitarias (todos lo llevan). */
  capitulos: z.array(Capitulo).min(3).max(5),
  /** "El número que nadie mira": UNA cifra contraintuitiva con su gráfico `contador` o `comparacion` que explica el caso. Se dice después del último capítulo, antes del remate. */
  numeroQueNadieMira: z.object({ texto: z.string().min(10), grafico: Grafico, cifras: z.array(Cifra).min(1).max(3) }),
  /** Pregunta que abre el siguiente largo (la dice la voz al final y va al comentario fijado). */
  siguiente: z.string().min(10).max(160),
  /** Miniatura 1280×720: 3–5 palabras grandes (≠ título) y, si se da, el gráfico que la ilustra. */
  miniatura: z.object({ texto: z.string().min(2).max(40), grafico: Grafico.optional() }),
});

/** Líneas de voz del largo, en orden de locución (0 = gancho, 1 = promesa, luego escenas, número, remate, siguiente). */
export const lineasDeVozTesis = (g: z.infer<typeof CamposTesis>): string[] => [
  g.gancho.texto,
  g.promesa,
  ...g.capitulos.flatMap((c) => c.escenas.map((e) => e.texto)),
  g.numeroQueNadieMira.texto,
  g.remate,
  g.siguiente,
];
export const palabrasTesis = (g: z.infer<typeof CamposTesis>) => lineasDeVozTesis(g).reduce((s, t) => s + contarPalabras(t), 0);

export const validarTesis = (g: z.infer<typeof CamposTesis>, ctx: z.RefinementCtx) => {
  const n = palabrasTesis(g);
  if (n < PALABRAS_TESIS_MIN || n > PALABRAS_TESIS_MAX) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${n} palabras habladas; deben ser ${PALABRAS_TESIS_MIN}–${PALABRAS_TESIS_MAX} (9–12 min)` });
  if (g.fuentes.length < 4) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'el largo necesita ≥ 4 fuentes' });
  if (g.indice.length !== g.capitulos.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `índice (${g.indice.length}) y capítulos (${g.capitulos.length}) deben coincidir` });
  const conGrafico = g.capitulos.flatMap((c) => c.escenas.filter((e) => e.grafico));
  if (conGrafico.length < 3) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `solo ${conGrafico.length} gráficos; el largo necesita ≥ 3 (uno por capítulo)` });
  const tipos = new Set(conGrafico.map((e) => e.grafico!.tipo));
  if (tipos.size < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'todos los gráficos son del mismo tipo: variar (lineas, barras, contador…)' });
  const cifras = g.capitulos.flatMap((c) => c.escenas.flatMap((e) => e.cifras ?? [])).length + (g.gancho.cifras?.length ?? 0) + g.numeroQueNadieMira.cifras.length;
  if (cifras < 6) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `solo ${cifras} cifras declaradas para el revisor; el largo necesita ≥ 6` });
  g.capitulos.forEach((c, i) => {
    if (i >= 1 && !c.escenas.some((e) => e.tipo === 'reenganche')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `capítulo ${i + 1} "${c.titulo}": falta el reenganche antes del corte publicitario` });
  });
  const ultimo = g.capitulos[g.capitulos.length - 1];
  if (!ultimo.escenas.some((e) => e.tipo === 'significado')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'el último capítulo necesita una escena `significado` (sin consejo)' });
  if (g.capitulos.slice(0, -1).some((c) => c.escenas.some((e) => e.tipo === 'significado'))) ctx.addIssue({ code: z.ZodIssueCode.custom, message: '`significado` solo va en el último capítulo' });
  for (const t of [g.cabecera, g.remate, g.miniatura.texto]) if (PROHIBIDAS_TITULO.test(t)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `palabra prohibida (catastrofismo) en "${t}"` });
  if (/\b(invierte|compra|vende|deberías|te conviene|mi consejo)\b/i.test(lineasDeVozTesis(g).join(' '))) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'la voz da consejo financiero (invierte/compra/deberías…): prohibido' });
};

export const GuionTesis = CamposTesis.superRefine(validarTesis);
export type GuionTesis = z.infer<typeof GuionTesis>;

// ---------------------------------------------------------------- GRAFICO (Short 9:16)
export const CamposGrafico = CamposBase.extend({
  /** EL gráfico del Short: se construye con la voz desde el gancho. */
  grafico: Grafico,
  /** 2–4 escenas: ≥ 1 `dato` (puede repetir `grafico` del Short o traer otro) y exactamente 1 `giro`. */
  escenas: z.array(Escena).min(2).max(4),
  /** Id del largo (`tesis`) del que sale este Short, si existe: la descripción y el comentario fijado lo enlazan. */
  enlaceLargo: z.string().optional(),
});

/** Líneas de voz del Short (0 = gancho, 1..n = escenas, n+1 = remate). */
export const lineasDeVozGrafico = (g: z.infer<typeof CamposGrafico>): string[] => [g.gancho.texto, ...g.escenas.map((e) => e.texto), g.remate];
export const palabrasGrafico = (g: z.infer<typeof CamposGrafico>) => lineasDeVozGrafico(g).reduce((s, t) => s + contarPalabras(t), 0);

export const validarGrafico = (g: z.infer<typeof CamposGrafico>, ctx: z.RefinementCtx) => {
  const n = palabrasGrafico(g);
  if (n < PALABRAS_GRAFICO_MIN || n > PALABRAS_GRAFICO_MAX) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${n} palabras habladas; deben ser ${PALABRAS_GRAFICO_MIN}–${PALABRAS_GRAFICO_MAX} (35–50 s)` });
  const tipos = g.escenas.map((e) => e.tipo);
  if (tipos.filter((t) => t === 'giro').length !== 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'el Short necesita exactamente 1 giro' });
  if (tipos.some((t) => t === 'reenganche' || t === 'significado')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'reenganche/significado son solo del largo' });
  if (!g.escenas.some((e) => e.fuenteEnVoz) && !/según|de acuerdo con|datos de/i.test(g.gancho.texto)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ninguna línea nombra la fuente en la voz' });
  const cifras = g.escenas.flatMap((e) => e.cifras ?? []).length + (g.gancho.cifras?.length ?? 0);
  if (cifras < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'el Short necesita ≥ 1 cifra declarada para el revisor' });
  for (const t of [g.remate, g.gancho.rotulo]) if (PROHIBIDAS_TITULO.test(t)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `palabra prohibida (catastrofismo) en "${t}"` });
};

export const GuionGrafico = CamposGrafico.superRefine(validarGrafico);
export type GuionGrafico = z.infer<typeof GuionGrafico>;

/** Envoltorio común de un guion en contenido/backlog o contenido/guiones. */
export const Envoltorio = <P extends z.ZodTypeAny>(plantilla: PlantillaCanal, props: P) => z.object({
  plantilla: z.literal(plantilla),
  id: z.string().min(1),
  /** ≤ 60 caracteres, contradicción + número o lugar, sin palabras prohibidas. Largo: sin #Shorts. */
  titulo: z.string().min(8).max(70).refine((t) => !PROHIBIDAS_TITULO.test(t), 'palabra prohibida en el título'),
  /** Línea 1 = la pregunta; luego 2–4 líneas propias del video (no plantilla), fuentes, "Voz sintetizada", "No es asesoría financiera". */
  descripcion: z.string().min(40).max(4000),
  hashtags: z.array(z.string()).max(6),
  props,
}).refine((g) => (g.props as { id?: string }).id === g.id, 'props.id debe ser igual a id');
export const EnvoltorioTesis = Envoltorio('tesis', GuionTesis);
export const EnvoltorioGrafico = Envoltorio('grafico', GuionGrafico);
