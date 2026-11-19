/**
 * Cambia la fecha de publicación (publishAt) de un video PROGRAMADO (privado) de En Números Rojos, por la API.
 *   npx tsx scripts/reprogramar.mts <videoId> <AAAA-MM-DD> <HH:MM>   (hora de Chile)  [--aplicar]
 * Verifica que el video sea del canal NR y que siga privado con publishAt (no toca videos ya públicos). No borra nada.
 * Creado el 2026-11-18 para correr un Short y hacerle lugar a la contingencia de GTA 6.
 */
import { google } from 'googleapis';
import { ARCHIVO_CLIENTE_YT, ARCHIVO_TOKEN_YT, escribirJson, leerJson } from './lib/operacion.mjs';

const CANAL_NR = 'UC8uOwislkGbnnfoqsJ_FgAw';
const args = process.argv.slice(2);
const aplicar = args.includes('--aplicar');
const [videoId, fecha, hora] = args.filter((a) => a !== '--aplicar');
if (!videoId || !/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') || !/^\d{2}:\d{2}$/.test(hora ?? '')) { console.error('uso: npx tsx scripts/reprogramar.mts <videoId> <AAAA-MM-DD> <HH:MM> [--aplicar]'); process.exit(2); }
// Chile continental en horario de verano (sep–abr) = UTC-3. Se calcula con Intl para no equivocarse de offset.
const utcDe = (f: string, h: string) => {
  const guess = new Date(`${f}T${h}:00Z`);
  const off = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', timeZoneName: 'longOffset' })
    .formatToParts(guess).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-03:00'; // "GMT-03:00"
  const m = off.match(/GMT([+-])(\d{2}):(\d{2})/);
  const min = m ? (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10)) : -180;
  return new Date(guess.getTime() - min * 60_000).toISOString().replace('.000Z', 'Z');
};
const publishAt = utcDe(fecha, hora);
const cj = leerJson<{ installed?: { client_id: string; client_secret: string }; web?: { client_id: string; client_secret: string } }>(ARCHIVO_CLIENTE_YT);
const c = cj.installed ?? cj.web!;
const cliente = new google.auth.OAuth2(c.client_id, c.client_secret, 'http://127.0.0.1:8765');
const tokens = leerJson<Record<string, unknown>>(ARCHIVO_TOKEN_YT);
cliente.setCredentials(tokens);
cliente.on('tokens', (nuevos) => escribirJson(ARCHIVO_TOKEN_YT, { ...tokens, ...nuevos }, 0o600));
const yt = google.youtube({ version: 'v3', auth: cliente });
const v = (await yt.videos.list({ id: [videoId], part: ['snippet', 'status'] })).data.items?.[0];
if (!v?.snippet || v.snippet.channelId !== CANAL_NR) { console.error(`✗ ${videoId} no es de En Números Rojos o no existe`); process.exit(1); }
if (v.status?.privacyStatus !== 'private') { console.error(`✗ ${videoId} está ${v.status?.privacyStatus}: solo se reprograman videos privados`); process.exit(1); }
console.log(`${videoId} · ${v.snippet.title}\n  antes: ${v.status?.publishAt ?? '(sin fecha)'}\n  ahora: ${publishAt} (${fecha} ${hora} Chile)`);
if (!aplicar) { console.log('  [simulación] agrega --aplicar'); process.exit(0); }
await yt.videos.update({ part: ['status'], requestBody: { id: videoId, status: { privacyStatus: 'private', publishAt, selfDeclaredMadeForKids: v.status?.selfDeclaredMadeForKids ?? false, embeddable: v.status?.embeddable, license: v.status?.license, publicStatsViewable: v.status?.publicStatsViewable } } });
for (let i = 0; i < 4; i++) {
  await new Promise((ok) => setTimeout(ok, 8000));
  const v2 = (await yt.videos.list({ id: [videoId], part: ['status'] })).data.items?.[0];
  if (v2?.status?.publishAt === publishAt) { console.log(`  ✓ publishAt verificado: ${publishAt}`); process.exit(0); }
}
console.log('  ⚠ publishAt aún no se refleja; volver a mirar');
