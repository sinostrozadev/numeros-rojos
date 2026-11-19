/**
 * Cambia SOLO el título de un video ya subido de En Números Rojos, conservando el resto del snippet (descripción, tags,
 * categoría, idiomas). Por la API (videos.list + videos.update, ~51 unidades). Sin --aplicar solo muestra el cambio.
 *   npx tsx scripts/titulo.mts <videoId> "<título nuevo>" [--aplicar]
 * Verifica que el video sea del canal NR (UC8uOwislkGbnnfoqsJ_FgAw) antes de tocarlo. Anota el título anterior y el nuevo en
 * docs/DECISIONES.md para poder revertir (revertir = correr este mismo script con el título anterior).
 * Decisión 2026-11-18 (molde de título de los canales nuevos que crecen; docs/GUION.md §10b).
 */
import { google } from 'googleapis';
import { ARCHIVO_CLIENTE_YT, ARCHIVO_TOKEN_YT, escribirJson, existeSecreto, leerJson } from './lib/operacion.mjs';

const CANAL_NR = 'UC8uOwislkGbnnfoqsJ_FgAw';
const args = process.argv.slice(2);
const aplicar = args.includes('--aplicar');
const [videoId, nuevo] = args.filter((a) => a !== '--aplicar');
if (!videoId || !nuevo) { console.error('uso: npx tsx scripts/titulo.mts <videoId> "<título nuevo>" [--aplicar]'); process.exit(2); }
if (nuevo.length > 100) { console.error(`título de ${nuevo.length} caracteres (> 100)`); process.exit(2); }
if (/[<>]/.test(nuevo)) { console.error('YouTube no admite < ni > en el título'); process.exit(2); }
if (!existeSecreto(ARCHIVO_CLIENTE_YT) || !existeSecreto(ARCHIVO_TOKEN_YT)) { console.error('faltan secrets/youtube-client.json o youtube-token.json'); process.exit(2); }

const cj = leerJson<{ installed?: { client_id: string; client_secret: string }; web?: { client_id: string; client_secret: string } }>(ARCHIVO_CLIENTE_YT);
const c = cj.installed ?? cj.web!;
const cliente = new google.auth.OAuth2(c.client_id, c.client_secret, 'http://127.0.0.1:8765');
const tokens = leerJson<Record<string, unknown>>(ARCHIVO_TOKEN_YT);
cliente.setCredentials(tokens);
cliente.on('tokens', (nuevos) => escribirJson(ARCHIVO_TOKEN_YT, { ...tokens, ...nuevos }, 0o600));
const yt = google.youtube({ version: 'v3', auth: cliente });

const r = await yt.videos.list({ id: [videoId], part: ['snippet', 'status'] });
const v = r.data.items?.[0];
if (!v?.snippet) { console.error(`no encontré ${videoId} (¿otro canal o borrado?)`); process.exit(1); }
if (v.snippet.channelId !== CANAL_NR) { console.error(`✗ ${videoId} es del canal ${v.snippet.channelId}, no de En Números Rojos: no se toca`); process.exit(1); }
const anterior = v.snippet.title ?? '';
console.log(`${videoId} · ${v.status?.privacyStatus}${v.status?.publishAt ? ` · publica ${v.status.publishAt}` : ''}`);
console.log(`  antes:  ${anterior}`);
console.log(`  ahora:  ${nuevo}`);
if (anterior === nuevo) { console.log('  (sin cambio)'); process.exit(0); }
if (!aplicar) { console.log('  [simulación] agrega --aplicar para cambiarlo'); process.exit(0); }
const s = v.snippet;
await yt.videos.update({
  part: ['snippet'],
  requestBody: {
    id: videoId,
    snippet: {
      title: nuevo, description: s.description, tags: s.tags, categoryId: s.categoryId,
      defaultLanguage: s.defaultLanguage, defaultAudioLanguage: s.defaultAudioLanguage,
    },
  },
});
// La lectura tarda en reflejar el cambio (medido 2026-11-18: ~10–20 s): reintenta hasta 4 veces.
let v2: typeof v | undefined;
for (let i = 0; i < 4; i++) {
  await new Promise((ok) => setTimeout(ok, 8000));
  v2 = (await yt.videos.list({ id: [videoId], part: ['snippet', 'status'] })).data.items?.[0];
  if (v2?.snippet?.title === nuevo) break;
}
const ok = v2?.snippet?.title === nuevo && (v2?.snippet?.description ?? '') === (s.description ?? '') && v2?.status?.publishAt === v.status?.publishAt;
console.log(ok ? `  ✓ título cambiado (descripción y fecha de publicación intactas)` : `  ⚠ revisar: título="${v2?.snippet?.title}" publishAt=${v2?.status?.publishAt}`);
