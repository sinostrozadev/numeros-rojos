/**
 * Resumen del estado de la fábrica de En Números Rojos: backlog por plantilla, bandeja de LARGOS y de SHORTS por
 * separado (con huérfanos y errores del revisor numérico), próximas ranuras de cada tipo (con qué video iría en cada
 * una), caché de datos, últimos errores, credenciales y métricas del día.
 *   npx tsx scripts/estado.mts [--sin-marcar] [--sin-metricas]
 * Por defecto marca como 'error' los json 'listo' sin mp4 (huérfanos), igual que el diario.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  ARCHIVO_API_AUDITADA, ARCHIVO_CLIENTE_YT, ARCHIVO_TOKEN_YT, DIR_CONTENIDO, DIR_SALIDA, RAIZ, PLANTILLAS, caducidadTokenYT,
  cargarCalendario, detectarHuerfanos, existeSecreto, formatoDuracion, formatoLocal, leerBacklog, leerBandeja,
  memoriaDisponibleMb, ordenarParaPublicar, proximasRanuras, siguientePlantilla, tipoDe, ultimosErrores,
  type EntradaConRuta, type TipoVideo,
} from './lib/operacion.mjs';

const rel = (p: string) => path.relative(RAIZ, p);
const cal = cargarCalendario();
const zona = cal.zonaHoraria;
const marcar = !process.argv.includes('--sin-marcar');
const NOMBRE = process.env.NR_CANAL_NOMBRE || 'En Números Rojos';

console.log(`${NOMBRE.toUpperCase()} · estado · ${formatoLocal(new Date(), zona)} · RAM disponible ${memoriaDisponibleMb()} MB\n`);

// Backlog
const backlog = leerBacklog();
console.log(`Backlog: ${backlog.length} guion(es) (mínimo ${cal.minimoBacklog})${backlog.length < cal.minimoBacklog ? '  ⚠ bajo: el diario generará más' : ''}`);
for (const p of PLANTILLAS) {
  const de = backlog.filter((g) => g.plantilla === p);
  console.log(`  ${p.padEnd(8)} ${String(de.length).padStart(2)}  (${tipoDe(p)})  ${de.slice(0, 2).map((g) => g.titulo).join(' · ')}${de.length > 2 ? ' …' : ''}`);
}
console.log(`  próximo render: Short ${siguientePlantilla(cal, 'short')} · largo ${siguientePlantilla(cal, 'largo')}`);

// Bandeja
const huerfanos = detectarHuerfanos(marcar, marcar ? 10 : 0);
const bandeja = leerBandeja();
const tipoDeEntrada = (e: EntradaConRuta): TipoVideo => (e.tipo === 'largo' ? 'largo' : 'short');

const seccion = (tipo: TipoVideo) => {
  const de = bandeja.filter((e) => tipoDeEntrada(e) === tipo);
  const porEstado = (s: string) => de.filter((x) => x.estado === s);
  const listos = porEstado('listo').filter((e) => e.mp4Existe);
  const minimo = tipo === 'largo' ? cal.minimoBandejaLargos : cal.minimoBandeja;
  const titulo = tipo === 'largo' ? 'LARGOS (tesis, 16:9)' : 'SHORTS (grafico, 9:16)';
  console.log(`\nBandeja ${titulo}: ${listos.length} listo (mínimo ${minimo})${listos.length < minimo ? ' ⚠' : ''}, ${porEstado('subido').length} subido, ${porEstado('error').length} error`);
  for (const e of listos) {
    const mini = tipo === 'largo' ? (e.miniatura && fs.existsSync(path.resolve(RAIZ, e.miniatura)) ? ' · miniatura ✓' : ' · ✗ sin miniatura') : '';
    console.log(`  • ${e.id}  ${formatoDuracion(e.duracionSeg)}${mini}${tipo === 'largo' && e.duracionSeg && e.duracionSeg < 480 ? ' · ⚠ < 8:00 (sin mid-rolls)' : ''}`);
  }
  for (const e of porEstado('listo').filter((x) => !x.mp4Existe && !huerfanos.includes(x))) console.log(`  … ${e.id}: json sin mp4 hace < 10 min (¿render en curso?)`);
  for (const e of porEstado('subido').slice(-5)) {
    const url = tipo === 'largo' ? `youtube.com/watch?v=${e.videoId}` : `youtube.com/shorts/${e.videoId}`;
    console.log(`  ↑ ${e.id}  ${url}  publica ${e.publicarEn ? formatoLocal(new Date(e.publicarEn), zona) : '?'}`);
  }
  for (const e of porEstado('error')) console.log(`  ✗ ${e.id}  ${(e.error ?? '').split('\n')[0].slice(0, 140)}`);

  // Ranuras de este tipo
  const orden = ordenarParaPublicar(listos, cal, tipo);
  const n = Math.max(tipo === 'largo' ? 3 : 6, orden.length);
  const ranuras = proximasRanuras(n, new Date(), cal, tipo);
  console.log(`  Próximas ranuras libres de ${tipo === 'largo' ? 'largo' : 'Short'} (${zona}):`);
  ranuras.forEach((r, i) => console.log(`    ${formatoLocal(r, zona)}  ${orden[i] ? `← ${orden[i].id}` : '(vacía: falta video)'}`));
};
seccion('largo');
seccion('short');
if (huerfanos.length) console.log(`\n✗ huérfanos (json 'listo' sin mp4)${marcar ? ' → marcados error' : ''}: ${huerfanos.map((e) => e.id).join(', ')}`);
const compilaciones = leerBandeja(true).filter((e) => e.tipo === 'largo' && !bandeja.includes(e) && e.rutaJson.includes('compilaciones'));
if (compilaciones.length) console.log(`  compilaciones: ${compilaciones.map((c) => `${c.id} [${c.estado}${c.mp4Existe ? '' : ', sin mp4'}] ${formatoDuracion(c.duracionSeg)}`).join(', ')}`);

// Caché de datos
{
  const dirDatos = path.join(DIR_CONTENIDO, 'datos');
  const contar = (f: string) => (fs.existsSync(path.join(dirDatos, f)) ? fs.readdirSync(path.join(dirDatos, f)).filter((x) => x.endsWith('.json')).length : 0);
  let catalogo = 0;
  try { catalogo = (JSON.parse(fs.readFileSync(path.join(dirDatos, 'catalogo.json'), 'utf8')).indicadores ?? []).length; } catch { /* sin catálogo */ }
  console.log(`\nDatos: catálogo ${catalogo} indicador(es) · caché ${contar('wdi')} WDI + ${contar('owid')} OWID (contenido/datos; refrescar: npx tsx scripts/datos.mts refrescar)`);
}

// Credenciales
console.log('\nCredenciales y subida:');
console.log(`  ${process.env.NR_CANAL_ID ? '✓' : '✗'} NR_CANAL_ID ${process.env.NR_CANAL_ID ?? '(falta: id UC… del canal; sin él subir-studio y metricas no corren)'}`);
console.log(`  ${existeSecreto(ARCHIVO_CLIENTE_YT) ? '✓' : '✗'} ${rel(ARCHIVO_CLIENTE_YT)}  ${existeSecreto(ARCHIVO_CLIENTE_YT) ? '' : '(docs/SANTIAGO.md)'}`);
console.log(`  ${existeSecreto(ARCHIVO_TOKEN_YT) ? '✓' : '✗'} ${rel(ARCHIVO_TOKEN_YT)}  ${existeSecreto(ARCHIVO_TOKEN_YT) ? '' : '(npx tsx scripts/subir.mts autorizar)'}`);
console.log(`  ${existeSecreto(ARCHIVO_API_AUDITADA) ? '✓ API auditada: el diario sube por API' : '· API sin auditar: se sube por Studio (subir-studio.mjs) desde salida/bandeja/PARA-SUBIR-A-MANO.md'}`);
{
  const cad = caducidadTokenYT();
  if (cad) {
    const dias = (cad.getTime() - Date.now()) / 86_400_000;
    console.log(`  ${dias < 2 ? '✗' : '⚠'} el refresh token caduca el ${formatoLocal(cad, zona)} (${dias.toFixed(1)} días) → antes de eso: npx tsx scripts/subir.mts autorizar`);
  }
}

// Plan semanal (docs/PLAN-SEMANAL.md, skill plan-semanal): bloque ```json con las ranuras de esta semana y la siguiente.
// Hito del miércoles (plan-semanal §5b, orden de Santiago 2026-11-08): todas las ranuras hasta el miércoles siguiente deben
// estar `programado` el jueves; aquí se avisa cuántas faltan.
{
  const archivoPlan = path.join(RAIZ, 'docs', 'PLAN-SEMANAL.md');
  const CON_GUION = ['guion', 'dirigido', 'renderizado', 'programado', 'publicado'];
  const ASEGURADA = ['programado', 'publicado'];
  console.log('\nPlan semanal:');
  try {
    const bloque = fs.readFileSync(archivoPlan, 'utf8').match(/```json\n([\s\S]*?)\n```/);
    if (!bloque) throw new Error('sin bloque ```json');
    const plan = JSON.parse(bloque[1]) as {
      zona?: string;
      ranuras: { fecha: string; hora: string; formato: string; plantilla: string; tema: string; estado: string; bloqueo?: string | null }[];
    };
    // "Ahora" como texto 'AAAA-MM-DD HH:MM' en la zona del plan: se compara como texto, sin offsets.
    const enZona = (d: Date) => new Intl.DateTimeFormat('sv-SE', {
      timeZone: plan.zona ?? zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(d).replace('T', ' ');
    const ahora = enZona(new Date());
    const en7d = enZona(new Date(Date.now() + 7 * 86_400_000));
    // Próximo miércoles (si hoy es miércoles, el siguiente: el hito de esta noche cubre hasta allá).
    const diaSemana = new Date(`${ahora.slice(0, 10)}T12:00:00Z`).getUTCDay();
    const hastaMie = ((3 - diaSemana + 7) % 7) || 7;
    const finMie = `${enZona(new Date(Date.now() + hastaMie * 86_400_000)).slice(0, 10)} 23:59`;
    const futuras = plan.ranuras.filter((r) => `${r.fecha} ${r.hora}` > ahora).sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
    const conGuion = futuras.filter((r) => r.formato === 'short' && CON_GUION.includes(r.estado));
    const shortsFuturos = futuras.filter((r) => r.formato === 'short');
    console.log(`  ${futuras.length} ranura(s) futura(s); Shorts con guion: ${conGuion.length}/${shortsFuturos.length}`);
    if (conGuion.length < 3) console.log(`  ⚠ menos de 3 ranuras futuras con guion → ritual de cierre (skill plan-semanal §5) y encargar guiones`);
    if (!futuras.some((r) => `${r.fecha} ${r.hora}` > en7d)) console.log('  ⚠ ninguna ranura a más de 7 días → falta armar la semana siguiente');
    const hastaHito = futuras.filter((r) => `${r.fecha} ${r.hora}` <= finMie);
    const sinProgramar = hastaHito.filter((r) => !ASEGURADA.includes(r.estado));
    const ultima = plan.ranuras.map((r) => r.fecha).sort().pop() ?? '';
    if (sinProgramar.length === 0 && ultima >= finMie.slice(0, 10)) {
      console.log(`  ✓ semana asegurada hasta el mié ${finMie.slice(0, 10)} (${hastaHito.length} ranuras programadas)`);
    } else {
      if (sinProgramar.length > 0) console.log(`  ⚠ hito del miércoles: ${sinProgramar.length}/${hastaHito.length} ranura(s) hasta el mié ${finMie.slice(0, 10)} sin programar (${sinProgramar.map((r) => `${r.fecha.slice(5)} ${r.hora} ${r.estado}`).join(', ')})`);
      if (ultima < finMie.slice(0, 10)) console.log(`  ⚠ hito del miércoles: el plan termina el ${ultima}; faltan las ranuras hasta el mié ${finMie.slice(0, 10)}`);
    }
    for (const r of futuras.slice(0, 4)) {
      console.log(`  ${r.fecha} ${r.hora}  ${r.plantilla.padEnd(8)} ${r.estado.padEnd(11)} ${r.tema.slice(0, 70)}${r.bloqueo ? `  ⚠ ${r.bloqueo.slice(0, 60)}` : ''}`);
    }
  } catch (e) {
    console.log(`  ✗ ${path.relative(RAIZ, archivoPlan)}: ${(e as Error).message} → armarlo (skill plan-semanal)`);
  }
}

// Lock y errores
const lock = path.join(DIR_SALIDA, 'diario.lock');
if (fs.existsSync(lock)) console.log(`\n⚠ ${rel(lock)} presente (pid ${fs.readFileSync(lock, 'utf8').trim()}): ¿hay un diario corriendo?`);
if (fs.existsSync('/tmp/bolita-render.lock')) console.log('  (lock de render compartido: /tmp/bolita-render.lock; flock lo libera solo al terminar el render)');
const errores = ultimosErrores(8);
console.log(`\nÚltimos errores en logs: ${errores.length ? '' : 'ninguno'}`);
for (const l of errores) console.log(`  ${l.slice(0, 170)}`);

// Métricas del día (capturas de Studio + metricas.json): no debe romper el estado si falla.
if (!process.argv.includes('--sin-metricas')) {
  console.log('');
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [path.join(RAIZ, 'node_modules', 'tsx', 'dist', 'cli.mjs'), path.join(RAIZ, 'scripts', 'metricas.mts')], { stdio: 'inherit', timeout: 600_000 });
  if (r.status !== 0) console.log('⚠ metricas.mts falló (ver salida arriba); el estado no se ve afectado');
}
