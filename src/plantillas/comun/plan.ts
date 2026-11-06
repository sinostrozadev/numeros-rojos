/**
 * Línea de tiempo de la VOZ, compartida (módulo puro, sin Remotion): la usan las composiciones y los scripts de
 * Node (voz, sonido, preparar), así video y audio parten de los mismos tiempos.
 *
 * Cada plantilla entrega sus líneas de voz (`LineaVoz`: tipo, texto y los silencios `antes`/`despues`) desde su
 * propio plan puro (tesis/plan.ts, grafico/plan.ts). Una línea con texto vacío (escena `respiro`) no se sintetiza:
 * dura solo su silencio.
 */
import { pesoDeLectura } from './numeros';

/** Pausa por defecto entre líneas de voz, en segundos. */
export const PAUSA = 0.32;

export type Palabra = { texto: string; inicio: number; fin: number }; // relativos a la línea, en segundos
export type TipoLinea = 'gancho' | 'promesa' | 'escena' | 'numero' | 'remate' | 'siguiente';

/** Lo que una plantilla le pide a voz.mts: qué decir y cuánto silencio dejar antes y después. */
export type LineaVoz = { tipo: TipoLinea; texto: string; antes?: number; despues?: number };

export type LineaTiempo = {
  indice: number;
  tipo: TipoLinea;
  texto: string;
  /** Ruta relativa a public/ (voz/<id>/<n>.mp3); vacía si la línea no tiene voz (respiro). */
  archivo: string;
  /** Inicio absoluto de la voz en el video, segundos (ya incluye el silencio `antes`). */
  inicio: number;
  duracionAudio: number;
  /** Hasta el final de la última palabra. */
  duracionHablada: number;
  /** Silencio antes y después de la línea (s). */
  antes: number;
  despues: number;
  palabras: Palabra[];
  /** true si los límites de palabra vienen del servicio TTS. */
  reales: boolean;
  /** Mayor desfase (s) de una palabra frente a su posición esperada; estado.mts puede avisar. */
  desfaseMax?: number;
};
export type Tiempos = { id: string; voz: string; pausa: number; lineas: LineaTiempo[]; total: number; limitesReales: boolean };

export type MedidaLinea = LineaVoz & { archivo: string; duracionAudio: number; palabras: Palabra[]; reales: boolean; desfaseMax?: number };

export const tokenizar = (texto: string) => texto.split(/\s+/).filter(Boolean);

/** Minúsculas, sin tildes ni puntuación (para comparar palabras). */
export const normalizar = (p: string) => p.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');

/** Estimación de tiempos por largo de palabra, para Studio sin voz o si el servicio no da límites. */
export const estimarPalabras = (texto: string, duracion?: number): Palabra[] => {
  const tokens = tokenizar(texto);
  if (!tokens.length) return [];
  const pesos = tokens.map((t) => 0.12 + 0.055 * pesoDeLectura(t) + (/[,.;:!?…]$/.test(t) ? 0.16 : 0));
  const suma = pesos.reduce((a, b) => a + b, 0);
  const total = duracion ?? suma + 0.1;
  const k = (total - 0.1) / suma;
  let t = 0.1;
  return tokens.map((texto, i) => {
    const d = pesos[i] * k;
    const p = { texto, inicio: t, fin: t + d * 0.9 };
    t += d;
    return p;
  });
};

/**
 * Desfase por palabra (s): cuánto se aparta su inicio de donde la pondría un reparto proporcional DENTRO de su
 * oración. Una cifra que llega tarde porque el alineador se desplazó se ve aquí; las pausas normales no.
 */
export const desfasePorPalabra = (palabras: Palabra[]): number[] => {
  const res = new Array<number>(palabras.length).fill(0);
  let a = 0;
  for (let i = 0; i < palabras.length; i++) {
    if (!/[.?!:;…]["»”)]*$/.test(palabras[i].texto) && i < palabras.length - 1) continue;
    const grupo = palabras.slice(a, i + 1);
    const pesos = grupo.map((p) => Math.max(1, pesoDeLectura(p.texto)) + (/[,]$/.test(p.texto) ? 3 : 0));
    const suma = pesos.reduce((x, y) => x + y, 0);
    const t0 = grupo[0].inicio, dur = grupo[grupo.length - 1].fin - t0;
    let acum = 0;
    grupo.forEach((p, n) => { res[a + n] = Math.abs(p.inicio - (t0 + (dur * acum) / suma)); acum += pesos[n]; });
    a = i + 1;
  }
  return res;
};
export const desfaseMaximo = (palabras: Palabra[]): number => +Math.max(0, ...desfasePorPalabra(palabras)).toFixed(2);

/**
 * Arma la línea de tiempo absoluta a partir de líneas medidas (o estimadas): cada línea empieza tras el silencio
 * `antes` y deja `despues` (PAUSA por defecto) de silencio. `total` = fin de la última línea + su `despues`.
 */
export const armarTiempos = (id: string, voz: string, medidas: MedidaLinea[]): Tiempos => {
  let t = 0;
  const lineas: LineaTiempo[] = medidas.map((m, indice) => {
    const antes = m.antes ?? 0;
    const despues = m.despues ?? PAUSA;
    const ultima = m.palabras.length ? m.palabras[m.palabras.length - 1].fin : 0;
    const duracionHablada = m.texto.trim() ? Math.min(m.duracionAudio, ultima + 0.12) : 0;
    const inicio = t + antes;
    t = inicio + duracionHablada + despues;
    return { ...m, indice, inicio: +inicio.toFixed(3), duracionHablada: +duracionHablada.toFixed(3), antes, despues };
  });
  return { id, voz, pausa: PAUSA, lineas, total: +t.toFixed(3), limitesReales: medidas.every((m) => m.reales || !m.texto.trim()) };
};

/** Tiempos de respaldo sin voz (previsualizar en Studio). */
export const estimarTiempos = (id: string, voz: string, lineas: LineaVoz[]): Tiempos =>
  armarTiempos(id, voz, lineas.map((l, i) => {
    const palabras = estimarPalabras(l.texto);
    const fin = palabras.length ? palabras[palabras.length - 1].fin + 0.2 : 0;
    return { ...l, archivo: l.texto.trim() ? `voz/${id}/${i}.mp3` : '', duracionAudio: fin, palabras, reales: false };
  }));

const VACIAS = new Set(['del', 'los', 'las', 'una', 'uno', 'que', 'con', 'por', 'para', 'son', 'muy', 'el', 'la', 'de', 'en', 'y']);

/** Primera palabra hablada (desde `desde`) que coincide con alguna palabra significativa de `objetivo`. */
export const buscarPalabra = (palabras: Palabra[], objetivo: string, desde = 0) => {
  const partes = objetivo.split(/[\s–—\-:/·,]+/).map(normalizar).filter(Boolean);
  const claves = partes.filter((w, k) => (k === 0 && partes.length === 1) || (w.length >= 3 && !VACIAS.has(w)));
  if (!claves.length) return -1;
  for (let i = desde; i < palabras.length; i++) {
    const n = normalizar(palabras[i].texto);
    if (claves.some((obj) => n === obj || (obj.length >= 4 && n.startsWith(obj)))) return i;
  }
  return -1;
};

/** ¿El token es un año (1500–2100, sin separador de miles)? */
export const esAnio = (token: string) => /^\D*(1[5-9]\d\d|20\d\d|2100)\D*$/.test(token) && !/[.,]\d/.test(token);

/** Palabras que son años, con su valor: [{ i, anio }]. Sirve para que la línea llegue al año cuando la voz lo dice. */
export const aniosDichos = (palabras: Palabra[]) =>
  palabras.flatMap((p, i) => (esAnio(p.texto) ? [{ i, anio: Number(p.texto.replace(/\D/g, '')) }] : []));

/** Primera palabra con una cifra que NO es año (el contador arranca cuando la voz la dice). */
export const primeraCifra = (palabras: Palabra[], desde = 0) => {
  for (let i = desde; i < palabras.length; i++) if (/\d/.test(palabras[i].texto) && !esAnio(palabras[i].texto)) return i;
  return -1;
};

/** Índice de la palabra que se está diciendo en `t` (segundos relativos a la línea). */
export const indicePalabraActual = (palabras: Palabra[], t: number) => {
  let actual = -1;
  for (let i = 0; i < palabras.length; i++) if (palabras[i].inicio <= t) actual = i;
  return actual;
};

export type TipoEvento = 'whoosh' | 'golpe' | 'tic' | 'trazo' | 'pop' | 'riser' | 'cierre';
export type Evento = { t: number; tipo: TipoEvento; fuerza: number; dur?: number };

/** Dos SFX a menos de 0,12 s se pisan: queda el más fuerte (los golpes y el cierre nunca se descartan). */
export const depurarEventos = (crudos: Evento[]): Evento[] => {
  const out: Evento[] = [];
  for (const e of [...crudos].sort((a, b) => a.t - b.t)) {
    const u = out[out.length - 1];
    if (u && e.t - u.t < 0.12 && u.tipo !== 'golpe' && e.tipo !== 'cierre' && e.tipo !== 'golpe') { if (e.fuerza > u.fuerza) out[out.length - 1] = e; continue; }
    out.push(e);
  }
  return out;
};

/** Clave de animación: en el frame `f` el avance vale `v` (0–1). */
export type Clave = { f: number; v: number };

/** Avance 0–1 en el frame `frame` interpolando claves crecientes (lineal entre claves, con suavizado en cada tramo). */
export const avanceEn = (claves: Clave[], frame: number): number => {
  if (!claves.length) return 1;
  if (frame < claves[0].f) return 0;
  for (let k = 1; k < claves.length; k++) {
    const a = claves[k - 1], b = claves[k];
    if (frame <= b.f) {
      const x = b.f === a.f ? 1 : (frame - a.f) / (b.f - a.f);
      const s = x * x * (3 - 2 * x) * 0.35 + x * 0.65; // casi lineal: la línea avanza con la voz, sin tirones
      return a.v + (b.v - a.v) * s;
    }
  }
  return claves[claves.length - 1].v;
};
