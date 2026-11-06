/**
 * Pipeline de UN día de En Números Rojos. Pensado para cron (ver scripts/cron.txt, 01:15), pero se puede correr a mano.
 *
 *   npx tsx scripts/diario.mts [--solo-render] [--solo-subir] [--sin-generar] [--sin-subir] [--dry-run]
 *                              [--n K] [--largos K] [--sin-largos] [--solo-largos]
 *
 * --n K: renderiza exactamente K Shorts (`grafico`) aunque la bandeja tenga el mínimo. --largos K: idem con K largos
 * (`tesis`). --sin-largos / --solo-largos: salta o hace solo el paso de largos. --sin-guiones = --sin-generar;
 * --cuantos K = --n K. --sin-subir: no llama a `subir --todos`; igual actualiza PARA-SUBIR-A-MANO.md.
 *
 * (0) Marca como 'error' los .json 'listo' de la bandeja que no tienen mp4 (renders interrumpidos).
 * (a) SHORTS: si la bandeja tiene menos de `minimoBandeja` Shorts 'listo', toma guiones `grafico` del backlog, los
 *     promueve a contenido/guiones/<fecha>-grafico-<slug>.json, los pasa por el REVISOR NUMÉRICO
 *     (scripts/verificar-cifras.mts: si falla → estado 'error' con el detalle, NO se renderiza), corre
 *     preparar-grafico y renderiza la composición `Grafico` (1080×1920) de a uno, con --concurrency=1, bajo el
 *     lock de render compartido entre canales (/tmp/bolita-render.lock, flock) y con RAM ≥ 1500 MB.
 * (a') LARGOS: si hay menos de `minimoBandejaLargos` largos 'listo', lo mismo con un guion `tesis` → composición
 *     `Tesis` (1920×1080; el fps lo fija la composición), tiempo máximo 240 min. Si existe la composición
 *     `Miniatura`, genera salida/bandeja/<id>-mini.png con `remotion still --frame=0`. La descripción recibe los
 *     capítulos con su timestamp (si preparar-tesis dejó los tiempos en los props). Entrada con `tipo: 'largo'`.
 * (b) Si el backlog baja de `minimoBacklog`, genera guiones nuevos con generar-guiones.mts.
 * (c) Sube con `subir --todos` si la API está auditada y hay token; si no, `exportar` (PARA-SUBIR-A-MANO.md).
 * Lock en salida/diario.lock; log en salida/logs/<fecha>.log. Un fallo marca el guion con estado 'error' y sigue
 * con el siguiente; cada paso tiene tiempo máximo: nunca se cuelga el día.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  ARCHIVO_API_AUDITADA, ARCHIVO_TOKEN_YT, DIR_BANDEJA, caducidadTokenYT, DIR_GUIONES, DIR_SALIDA, DIR_TRABAJO, RAIZ,
  asegurarDirectorios, cargarCalendario, composicionDe, correr, crearLog, detectarHuerfanos, duracionVideo,
  enLaNube, escribirJson, existeSecreto, fechaHoyLocal, formatoDuracion, leerBacklog, leerBandeja, memoriaDisponibleMb,
  ordenRotacion, resumenSalida, rotacionDe, siguientePlantilla, slugificar, tipoDe,
  type EntradaBandeja, type Guion, type Log, type Plantilla, type TipoVideo,
} from './lib/operacion.mjs';

const { values: opc } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'solo-render': { type: 'boolean', default: false },
    'solo-subir': { type: 'boolean', default: false },
    'sin-generar': { type: 'boolean', default: false },
    /** Alias de --sin-generar. */
    'sin-guiones': { type: 'boolean', default: false },
    /** No sube a YouTube (solo exporta la lista manual). */
    'sin-subir': { type: 'boolean', default: false },
    /** Renderiza exactamente K Shorts seguidos (aunque la bandeja ya tenga el mínimo). */
    n: { type: 'string' },
    /** Alias de --n. */
    cuantos: { type: 'string' },
    /** Renderiza exactamente K largos seguidos. */
    largos: { type: 'string' },
    'sin-largos': { type: 'boolean', default: false },
    'solo-largos': { type: 'boolean', default: false },
    /** Tope de renders de Shorts cuando se rellena la bandeja hasta el mínimo (por defecto = minimoBandeja). */
    'max-renders': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});

if (opc.cuantos !== undefined && opc.n === undefined) opc.n = opc.cuantos;
if (opc['sin-guiones']) opc['sin-generar'] = true;

const ARCHIVO_LOCK = path.join(DIR_SALIDA, 'diario.lock');
const TSX = path.join(RAIZ, 'node_modules', '.bin', 'tsx');
const REMOTION = path.join(RAIZ, 'node_modules', '.bin', 'remotion');
const CONCURRENCIA = process.env.NR_CONCURRENCIA ?? '1';
const MEMORIA_MIN_MB = parseInt(process.env.NR_MEMORIA_MIN_MB ?? '1500', 10);
/** Lock de render compartido entre canales (el mismo de Bolita Lab y Línea Punteada): un solo Chrome de Remotion a la vez. */
const LOCK_RENDER = process.env.NR_LOCK_RENDER ?? '/tmp/bolita-render.lock';
const ESPERA_MEMORIA_MAX_MIN = 30;
const MIN = 60_000;
const TIEMPO_VERIFICAR = 10 * MIN;
const TIEMPO_PREPARAR = { short: 20 * MIN, largo: 45 * MIN } as const;
/** Short 35–50 s a 60 fps ≈ 3.000 frames; largo 9–12 min a 30 fps ≈ 16.000–21.600 frames (~2 h en esta máquina). */
const TIEMPO_RENDER = {
  short: parseInt(process.env.NR_RENDER_MAX_MIN ?? '90', 10) * MIN,
  largo: parseInt(process.env.NR_RENDER_LARGO_MAX_MIN ?? '240', 10) * MIN,
} as const;
const TIEMPO_STILL = 10 * MIN;
const TIEMPO_GENERAR = { short: 20 * MIN, largo: 45 * MIN } as const;
const TIEMPO_SUBIR = 4 * 60 * MIN;
const rel = (p: string) => path.relative(RAIZ, p);

/** Espera (hasta 30 min) a que haya RAM suficiente antes de renderizar. Devuelve false si no llegó. */
const esperarMemoria = async (log: Log): Promise<boolean> => {
  const limite = Date.now() + ESPERA_MEMORIA_MAX_MIN * MIN;
  let ultimoAviso = 0;
  while (memoriaDisponibleMb() < MEMORIA_MIN_MB) {
    if (Date.now() > limite) return false;
    if (Date.now() - ultimoAviso > 5 * MIN) {
      log(`  ⏳ RAM disponible ${memoriaDisponibleMb()} MB < ${MEMORIA_MIN_MB} MB: espero (máx ${ESPERA_MEMORIA_MAX_MIN} min)…`);
      ultimoAviso = Date.now();
    }
    await new Promise((ok) => setTimeout(ok, 20_000));
  }
  log(`  RAM disponible ${memoriaDisponibleMb()} MB ≥ ${MEMORIA_MIN_MB} MB: adelante.`);
  return true;
};

// ---------------------------------------------------------------- lock
const tomarLock = (log: Log): boolean => {
  for (let intento = 0; intento < 2; intento++) {
    try {
      fs.writeFileSync(ARCHIVO_LOCK, String(process.pid), { flag: 'wx' }); // atómico: falla si ya existe
      return true;
    } catch {
      const pid = parseInt(fs.readFileSync(ARCHIVO_LOCK, 'utf8').trim(), 10);
      let vivo = false;
      try { process.kill(pid, 0); vivo = true; } catch { vivo = false; }
      if (vivo) {
        log(`✗ Ya hay un diario corriendo (pid ${pid}, ${rel(ARCHIVO_LOCK)}). Salgo.`);
        return false;
      }
      log(`⚠ Lock huérfano (pid ${pid} no existe): lo reemplazo.`);
      try { fs.unlinkSync(ARCHIVO_LOCK); } catch { /* otro lo borró */ }
    }
  }
  return false;
};
const soltarLock = () => {
  try {
    if (fs.readFileSync(ARCHIVO_LOCK, 'utf8').trim() === String(process.pid)) fs.unlinkSync(ARCHIVO_LOCK);
  } catch { /* nada */ }
};

// ---------------------------------------------------------------- (a) render
const marcarError = (guion: Guion, mensaje: string, log: Log) => {
  const entrada: EntradaBandeja = {
    id: guion.id, plantilla: guion.plantilla, titulo: guion.titulo, descripcion: guion.descripcion,
    hashtags: guion.hashtags, duracionSeg: 0, estado: 'error', tipo: tipoDe(guion.plantilla), error: mensaje.slice(0, 1500),
  };
  escribirJson(path.join(DIR_BANDEJA, `${guion.id}.json`), entrada);
  log(`  ✗ ${guion.id} → estado 'error': ${mensaje.split('\n')[0]}`);
};

/**
 * Slug de un guion del backlog: su id sin el prefijo `pendiente-` ni `<plantilla>-`.
 *   pendiente-tesis-chile-corea → chile-corea ;  grafico-deuda-argentina → deuda-argentina
 */
const slugDeBacklog = (g: Pick<Guion, 'id' | 'plantilla' | 'titulo'>): string => {
  let base = g.id.trim();
  base = base.replace(/^pendiente-/, '');
  base = base.replace(new RegExp(`^${g.plantilla}-`), '');
  base = base.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(new RegExp(`^${g.plantilla}-`), '');
  return slugificar(base || g.titulo, 60);
};

/** Mueve un guion del backlog a contenido/guiones con id `<fecha>-<plantilla>-<slug>`. */
const promover = (g: Guion & { ruta: string }, fecha: string, log: Log): Guion & { ruta: string } => {
  const slug = slugDeBacklog(g);
  let id = `${fecha}-${g.plantilla}-${slug}`;
  const ocupado = (x: string) => fs.existsSync(path.join(DIR_GUIONES, `${x}.json`)) || fs.existsSync(path.join(DIR_BANDEJA, `${x}.json`));
  for (let k = 2; ocupado(id); k++) id = `${fecha}-${g.plantilla}-${slug}-${k}`;
  const destino = path.join(DIR_GUIONES, `${id}.json`);
  const { ruta: origen, ...resto } = g;
  const nuevo: Guion = { ...resto, id, props: { ...resto.props, id } };
  escribirJson(destino, nuevo);
  fs.unlinkSync(origen);
  log(`  → promovido ${rel(origen)} ⇒ ${rel(destino)}`);
  return { ...nuevo, ruta: destino };
};

/** Gate: revisor numérico. Devuelve null si pasa; si no, el motivo (primera línea útil). */
const verificarCifras = async (g: Guion & { ruta: string }, log: Log): Promise<string | null> => {
  log(`  🔢 verificar-cifras ${rel(g.ruta)}`);
  const r = await correr(TSX, [path.join(RAIZ, 'scripts', 'verificar-cifras.mts'), g.ruta, '--json'], { log, timeoutMs: TIEMPO_VERIFICAR });
  if (r.codigo === 0) return null;
  const resumen = /RESUMEN: (.*)/.exec(r.salida)?.[1];
  return `verificar-cifras salió con código ${r.codigo}: ${resumen ?? resumenSalida(r.salida, 4)} (detalle: salida/trabajo/${g.id}.verificacion.json)`;
};

const tieneComposicion = (nombre: string) => {
  try { return new RegExp(`id=["'{\`]*${nombre}["'}\`]`).test(fs.readFileSync(path.join(RAIZ, 'src', 'Root.tsx'), 'utf8')); } catch { return false; }
};

const ts = (seg: number) => {
  const s = Math.max(0, Math.floor(seg));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
};

/**
 * Capítulos con timestamp para la descripción del largo, leídos de los props que escribe preparar-tesis. Acepta:
 *  - `props.capitulosTiempos: [{ titulo, inicio }]` (segundos), o
 *  - `props.tiempos.lineas[]` (src/plantillas/comun/plan.ts, orden de lineasDeVozTesis: gancho, promesa, escenas…,
 *    número, remate, siguiente) + `props.capitulos[].escenas` para saber dónde empieza cada capítulo.
 * Devuelve [] si no puede (YouTube exige ≥ 3 capítulos, el primero en 0:00 y cada uno ≥ 10 s).
 */
const capitulosDeProps = (props: Record<string, any>, duracionSeg: number): Array<{ inicio: number; titulo: string }> => {
  let caps: Array<{ inicio: number; titulo: string }> = [];
  if (Array.isArray(props.capitulosTiempos)) {
    caps = props.capitulosTiempos.filter((c: any) => typeof c?.inicio === 'number' && c?.titulo).map((c: any) => ({ inicio: c.inicio, titulo: String(c.titulo) }));
  } else if (Array.isArray(props.tiempos?.lineas) && Array.isArray(props.capitulos)) {
    const lineas = props.tiempos.lineas as Array<{ inicio: number; antes?: number }>;
    const inicioDe = (i: number) => (lineas[i] ? Math.max(0, lineas[i].inicio - (lineas[i].antes ?? 0)) : undefined);
    let i = 2; // 0 = gancho, 1 = promesa
    for (const c of props.capitulos as Array<{ titulo: string; escenas: unknown[] }>) {
      const t = inicioDe(i);
      if (t !== undefined) caps.push({ inicio: t, titulo: c.titulo });
      i += c.escenas?.length ?? 0;
    }
    const tNumero = inicioDe(i);
    if (tNumero !== undefined) caps.push({ inicio: tNumero, titulo: 'El número que nadie mira' });
  }
  if (!caps.length) return [];
  if (caps[0].inicio > 0) caps.unshift({ inicio: 0, titulo: 'La pregunta' });
  else caps[0].inicio = 0;
  // Quita capítulos de menos de 10 s (YouTube invalida todos si uno es más corto).
  const limpios = caps.filter((c, k) => (caps[k + 1]?.inicio ?? duracionSeg) - c.inicio >= 10);
  return limpios.length >= 3 ? limpios : [];
};

/** Inserta el bloque "Capítulos" después del primer párrafo de la descripción (la pregunta). */
const descripcionConCapitulos = (descripcion: string, caps: Array<{ inicio: number; titulo: string }>) => {
  if (!caps.length || /^\s*0?0:00\s/m.test(descripcion)) return descripcion;
  const bloque = ['Capítulos:', ...caps.map((c) => `${ts(c.inicio)} ${c.titulo}`)].join('\n');
  const partes = descripcion.split(/\n\s*\n/);
  return [partes[0], bloque, ...partes.slice(1)].join('\n\n');
};

const renderizarUno = async (g: Guion & { ruta: string }, log: Log): Promise<boolean> => {
  const tipo = tipoDe(g.plantilla);
  const salidaMp4 = path.join(DIR_BANDEJA, `${g.id}.mp4`);
  const props = path.join(DIR_TRABAJO, `${g.id}.props.json`);
  const composicion = composicionDe(g.plantilla);

  // 1. Revisor numérico: ninguna cifra fuera de tolerancia llega a render.
  const fallo = await verificarCifras(g, log);
  if (fallo) { marcarError(g, fallo, log); return false; }

  // 2. Preparar (datos → voz → sonido → props).
  const preparar = path.join(RAIZ, 'scripts', `preparar-${g.plantilla}.mts`);
  if (!fs.existsSync(preparar)) {
    marcarError(g, `no existe ${rel(preparar)} (la plantilla "${g.plantilla}" aún no entrega su script de preparación)`, log);
    return false;
  }
  log(`  ⚙ preparar-${g.plantilla} ${rel(g.ruta)}`);
  const p = await correr(TSX, [preparar, g.ruta], { log, timeoutMs: TIEMPO_PREPARAR[tipo] });
  if (p.codigo !== 0) {
    marcarError(g, `preparar-${g.plantilla} salió con código ${p.codigo}: ${resumenSalida(p.salida, 5)}`, log);
    return false;
  }
  if (!fs.existsSync(props)) {
    marcarError(g, `preparar-${g.plantilla} no escribió ${rel(props)}`, log);
    return false;
  }

  // 3. Render (resolución y fps los fija la composición: Grafico 1080×1920@60, Tesis 1920×1080@30).
  const argsRender = [
    'render', 'src/index.ts', composicion, salidaMp4,
    `--props=${props}`, '--codec=h264', '--crf=18', `--concurrency=${CONCURRENCIA}`, '--log=error',
    // timeout alto: con la máquina cargada un frame puede tardar más de los 30 s por defecto.
    '--timeout=180000',
    // veryfast: x264 con menos lookahead usa mucha menos RAM (con el preset por defecto el kernel mató a ffmpeg por OOM).
    '--x264-preset=veryfast',
  ];
  let r = { codigo: 1, salida: '' };
  for (let intento = 1; intento <= 2; intento++) {
    if (!(await esperarMemoria(log))) {
      marcarError(g, `sin RAM suficiente (<${MEMORIA_MIN_MB} MB disponibles) tras ${ESPERA_MEMORIA_MAX_MIN} min de espera`, log);
      return false;
    }
    log(`  🎬 render ${composicion} (${tipo}) → ${rel(salidaMp4)} (concurrency ${intento === 1 ? CONCURRENCIA : 1}, intento ${intento}, máx ${TIEMPO_RENDER[tipo] / MIN} min)`);
    const inicio = Date.now();
    const args = intento === 1 ? argsRender : argsRender.map((a) => (a.startsWith('--concurrency=') ? '--concurrency=1' : a));
    // flock -w: espera hasta 30 min a que termine otro render (de este u otro canal) antes de empezar.
    r = await correr('flock', ['-w', '1800', LOCK_RENDER, REMOTION, ...args], { log, timeoutMs: TIEMPO_RENDER[tipo] });
    if (r.codigo === 0 && fs.existsSync(salidaMp4)) {
      let duracionSeg = 0;
      try { duracionSeg = Math.round((await duracionVideo(salidaMp4)) * 10) / 10; } catch (e) { log(`  ⚠ ${(e as Error).message}`); }
      let descripcion = g.descripcion;
      let miniatura: string | undefined;
      if (tipo === 'largo') {
        try {
          const caps = capitulosDeProps(JSON.parse(fs.readFileSync(props, 'utf8')), duracionSeg);
          if (caps.length) { descripcion = descripcionConCapitulos(descripcion, caps); log(`  ✓ ${caps.length} capítulos en la descripción`); }
          else log('  ⚠ sin tiempos de capítulos en los props (props.capitulosTiempos o props.tiempos.lineas): la descripción va sin capítulos');
        } catch (e) { log(`  ⚠ capítulos: ${(e as Error).message}`); }
        miniatura = await generarMiniatura(g, props, log);
        if (duracionSeg && duracionSeg < 8 * 60) log(`  ⚠ el largo dura ${formatoDuracion(duracionSeg)} (< 8:00): no admite mid-rolls`);
      }
      const entrada: EntradaBandeja = {
        id: g.id, plantilla: g.plantilla, titulo: g.titulo, descripcion, hashtags: g.hashtags,
        duracionSeg, estado: 'listo', tipo,
        ...(miniatura ? { miniatura } : {}),
        ...(process.env.NR_ARTEFACTO ? { artefacto: process.env.NR_ARTEFACTO } : {}),
      };
      escribirJson(path.join(DIR_BANDEJA, `${g.id}.json`), entrada); // json SIEMPRE después del mp4
      log(`  ✓ listo ${g.id} (${formatoDuracion(duracionSeg)} de video, ${((Date.now() - inicio) / 60000).toFixed(1)} min de render)`);
      return true;
    }
    try { fs.unlinkSync(salidaMp4); } catch { /* no había mp4 parcial */ }
    const motivo = r.codigo === 137 ? ' (SIGKILL: probablemente el kernel lo mató por falta de RAM)' : r.codigo === 124 ? ' (tiempo agotado)' : '';
    log(`  ⚠ render falló con código ${r.codigo}${motivo}: ${resumenSalida(r.salida, 3)}`);
    // Un largo que agotó 240 min no se reintenta (serían otras 4 h): hay que pasarlo a render por tramos (videos-largos §5).
    if (tipo === 'largo' && r.codigo === 124) break;
    if (intento === 1) log('  ↻ reintento una vez (concurrency 1)…');
  }
  marcarError(g, `remotion render salió con código ${r.codigo}: ${resumenSalida(r.salida, 6)}`, log);
  return false;
};

/** Miniatura 1280×720 del largo: composición `Miniatura` (si existe) con los mismos props, frame 0. */
const generarMiniatura = async (g: Guion, props: string, log: Log): Promise<string | undefined> => {
  if (!tieneComposicion('Miniatura')) { log('  ⚠ no hay composición Miniatura en src/Root.tsx: el largo va sin miniatura propia'); return undefined; }
  const destino = path.join(DIR_BANDEJA, `${g.id}-mini.png`);
  log(`  🖼 miniatura → ${rel(destino)}`);
  const r = await correr('flock', ['-w', '1800', LOCK_RENDER, REMOTION, 'still', 'src/index.ts', 'Miniatura', destino, '--frame=0', `--props=${props}`, '--log=error', '--timeout=180000'], { log, timeoutMs: TIEMPO_STILL });
  if (r.codigo !== 0 || !fs.existsSync(destino)) { log(`  ⚠ miniatura falló (código ${r.codigo}): ${resumenSalida(r.salida, 3)}`); return undefined; }
  const mb = fs.statSync(destino).size / 1048576;
  if (mb > 2) log(`  ⚠ la miniatura pesa ${mb.toFixed(1)} MB (> 2 MB): YouTube la rechaza; conviértela a JPG`);
  return rel(destino);
};

const elegirDelBacklog = (tipo: TipoVideo, log: Log): (Guion & { ruta: string }) | undefined => {
  const calendario = cargarCalendario();
  const rot = rotacionDe(tipo, calendario);
  const backlog = leerBacklog().filter((g) => rot.includes(g.plantilla));
  if (backlog.length === 0) return undefined;
  const toca = siguientePlantilla(calendario, tipo);
  for (const p of ordenRotacion(toca, calendario, tipo)) {
    const candidatos = backlog.filter((g) => g.plantilla === p);
    if (candidatos.length) {
      if (p !== toca) log(`  (no hay guiones de "${toca}" en el backlog; uso "${p}")`);
      return candidatos[0];
    }
  }
  return undefined;
};

const pasoRender = (tipo: TipoVideo) => async (log: Log) => {
  const calendario = cargarCalendario();
  const fecha = fechaHoyLocal(calendario.zonaHoraria);
  const etiqueta = tipo === 'largo' ? '(a\') Largos' : '(a) Shorts';
  const minimo = tipo === 'largo' ? calendario.minimoBandejaLargos : calendario.minimoBandeja;
  const forzadoTxt = tipo === 'largo' ? opc.largos : opc.n;
  const forzados = forzadoTxt !== undefined ? Math.max(1, parseInt(forzadoTxt, 10) || 1) : undefined;
  const tope = forzados ?? (tipo === 'largo' ? Math.max(1, minimo) : Math.max(1, parseInt(opc['max-renders'] ?? String(minimo), 10) || minimo));
  let renders = 0;
  while (renders < tope) {
    const listos = leerBandeja().filter((e) => e.estado === 'listo' && e.mp4Existe && (e.tipo ?? 'short') === tipo).length;
    if (forzados === undefined && listos >= minimo) {
      log(`${etiqueta}: bandeja con ${listos} listo(s) ≥ ${minimo}: no hace falta renderizar.`);
      return;
    }
    const elegido = elegirDelBacklog(tipo, log);
    if (!elegido) {
      log(`${etiqueta}: backlog sin guiones ${rotacionDe(tipo, calendario).join('/')} (bandeja: ${listos} listo(s)).${opc['sin-generar'] ? '' : ' Se generarán guiones en (b).'}`);
      return;
    }
    log(`${etiqueta}: render ${renders + 1}/${tope}${forzados ? ' (forzado)' : ''} · bandeja: ${listos} listo(s) · ${elegido.plantilla} ← ${rel(elegido.ruta)}`);
    if (opc['dry-run']) { log(`  [dry-run] se promovería a ${fecha}-${elegido.plantilla}-${slugDeBacklog(elegido)}, se verificarían las cifras y se renderizaría ${composicionDe(elegido.plantilla)}.`); return; }
    const g = promover(elegido, fecha, log);
    let ok = false;
    try {
      ok = await renderizarUno(g, log);
    } catch (e) {
      marcarError(g, `excepción: ${(e as Error).message}`, log);
    }
    if (!ok && enLaNube()) process.exitCode = 1;
    renders++;
  }
  log(`${etiqueta}: ${renders} render(s) en esta corrida (tope ${tope}).`);
};

// ---------------------------------------------------------------- (b) generar
const pasoGenerar = async (log: Log) => {
  const calendario = cargarCalendario();
  const backlog = leerBacklog();
  if (backlog.length >= calendario.minimoBacklog) {
    log(`(b) Backlog con ${backlog.length} guion(es) ≥ ${calendario.minimoBacklog}: no se generan.`);
    return;
  }
  const generador = path.join(RAIZ, 'scripts', 'generar-guiones.mts');
  if (!fs.existsSync(generador)) return log('(b) No existe scripts/generar-guiones.mts: no se puede generar.');
  const plantillas = [...new Set<Plantilla>([...calendario.rotacionLargo, ...calendario.rotacion])];
  // Lleva cada plantilla a ~minimoBacklog/plantillas, empezando por la que menos tiene (largos primero: son el producto).
  const meta = Math.ceil(calendario.minimoBacklog / plantillas.length) + 1;
  const plan = plantillas
    .map((p) => ({ p, n: Math.max(0, meta - backlog.filter((g) => g.plantilla === p).length) }))
    .filter((x) => x.n > 0);
  log(`(b) Backlog con ${backlog.length} < ${calendario.minimoBacklog}: generar ${plan.map((x) => `${x.n} ${x.p}`).join(', ')}.`);
  if (opc['dry-run']) return log('  [dry-run] no se llama a generar-guiones.');
  for (const { p, n } of plan) {
    const r = await correr(TSX, [generador, '--plantilla', p, '--n', String(n)], { log, timeoutMs: TIEMPO_GENERAR[tipoDe(p)] * Math.max(1, Math.ceil(n / 2)) });
    if (r.codigo !== 0) log(`  ✗ generar-guiones ${p} falló (código ${r.codigo}); sigo.`);
  }
};

// ---------------------------------------------------------------- (c) subir
const pasoSubir = async (log: Log) => {
  const bandeja = leerBandeja().filter((e) => e.estado === 'listo' && e.mp4Existe);
  const cuenta = `${bandeja.filter((e) => e.tipo !== 'largo').length} Short(s) y ${bandeja.filter((e) => e.tipo === 'largo').length} largo(s) listo(s)`;
  const subir = path.join(RAIZ, 'scripts', 'subir.mts');
  if (opc['sin-subir']) {
    log(`(c) --sin-subir: no se sube; exportar → salida/bandeja/PARA-SUBIR-A-MANO.md (${cuenta}).`);
  } else if (!existeSecreto(ARCHIVO_API_AUDITADA)) {
    // Hasta que Google apruebe la auditoría del proyecto, todo lo subido por API queda privado y consume el cupo
    // diario. Mientras tanto se sube por YouTube Studio (herramientas/navegador/subir-studio.mjs, con el piloto).
    log(`(c) API sin auditar (falta ${rel(ARCHIVO_API_AUDITADA)}): no se sube por API; exportar → PARA-SUBIR-A-MANO.md (${cuenta}).`);
  } else if (existeSecreto(ARCHIVO_TOKEN_YT)) {
    const cad = caducidadTokenYT();
    if (cad) {
      const dias = (cad.getTime() - Date.now()) / 86_400_000;
      if (dias < 0) log(`  ✗ El refresh token CADUCÓ el ${cad.toISOString()}: las subidas por API fallarán → npx tsx scripts/subir.mts autorizar`);
      else if (dias < 2) log(`  ⚠ El refresh token caduca en ${dias.toFixed(1)} días (${cad.toISOString()}) → reautorizar YA: npx tsx scripts/subir.mts autorizar`);
    }
    log(`(c) Token de YouTube presente: subir --todos (${cuenta}).`);
    const r = await correr(TSX, [subir, 'subir', '--todos', ...(opc['dry-run'] ? ['--dry-run'] : [])], { log, timeoutMs: TIEMPO_SUBIR });
    if (r.codigo !== 0) {
      log(`  ✗ subir terminó con código ${r.codigo}: ${resumenSalida(r.salida, 2)}`);
      if (enLaNube()) process.exitCode = 1;
    }
  } else {
    log(`(c) Sin ${rel(ARCHIVO_TOKEN_YT)}: exportar → salida/bandeja/PARA-SUBIR-A-MANO.md (${cuenta}).`);
  }
  // La lista manual se mantiene al día siempre (también sirve de respaldo si la API falla).
  const r = await correr(TSX, [subir, 'exportar'], { log, timeoutMs: 5 * MIN });
  if (r.codigo !== 0) log(`  ✗ exportar terminó con código ${r.codigo}.`);
};

// ---------------------------------------------------------------- main
const main = async () => {
  asegurarDirectorios();
  const zona = cargarCalendario().zonaHoraria;
  const log = crearLog(fechaHoyLocal(zona), zona);
  const banderas = ['solo-render', 'solo-subir', 'sin-generar', 'sin-subir', 'sin-largos', 'solo-largos', 'dry-run'].filter((k) => opc[k as keyof typeof opc]).map((k) => `--${k}`);
  if (opc.n) banderas.push(`--n ${opc.n}`);
  if (opc.largos) banderas.push(`--largos ${opc.largos}`);
  log(`══ diario ${banderas.join(' ')} (pid ${process.pid}, RAM disponible ${memoriaDisponibleMb()} MB)`);
  if (!tomarLock(log)) process.exit(3);
  process.on('exit', soltarLock);
  process.on('SIGINT', () => { soltarLock(); process.exit(130); });
  process.on('SIGTERM', () => { soltarLock(); process.exit(143); });

  const inicio = Date.now();
  const render = !opc['solo-subir'];
  const pasos: Array<[string, (l: Log) => Promise<void>, boolean]> = [
    ['huérfanos', async (l) => {
      const h = detectarHuerfanos(!opc['dry-run']);
      if (h.length) l(`(0) ✗ ${h.length} json 'listo' sin mp4 → estado 'error': ${h.map((e) => e.id).join(', ')}`);
    }, true],
    // Shorts primero (minutos; la ranura de las 13:00 es diaria), luego el largo (~2 h, de madrugada).
    ['render shorts', pasoRender('short'), render && !opc['solo-largos']],
    ['render largos', pasoRender('largo'), render && !opc['sin-largos']],
    ['generar', pasoGenerar, render && !opc['solo-render'] && !opc['sin-generar'] && !opc['solo-largos']],
    ['subir', pasoSubir, !opc['solo-render'] && !opc['solo-largos']],
  ];
  for (const [nombre, paso, activo] of pasos) {
    if (!activo) continue;
    try {
      await paso(log);
    } catch (e) {
      log(`✗ ERROR en el paso ${nombre}: ${(e as Error).stack ?? (e as Error).message}`);
      process.exitCode = 1; // sigue con los demás pasos
    }
  }
  const b = leerBandeja();
  const n = (estado: string, tipo: TipoVideo) => b.filter((e) => e.estado === estado && (e.tipo ?? 'short') === tipo).length;
  log(`══ fin en ${((Date.now() - inicio) / 60000).toFixed(1)} min · Shorts: ${n('listo', 'short')} listo, ${n('subido', 'short')} subido, ${n('error', 'short')} error · largos: ${n('listo', 'largo')} listo, ${n('subido', 'largo')} subido, ${n('error', 'largo')} error · backlog: ${leerBacklog().length}`);
};

main();
