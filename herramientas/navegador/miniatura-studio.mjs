// Pone (o cambia) la miniatura personalizada de un video YA subido, por YouTube Studio con el piloto (8777).
// Para canales sin token de API (En Números Rojos). Requiere canal verificado por teléfono.
//   NR_CANAL_ID=UC… node herramientas/navegador/miniatura-studio.mjs <videoId> <ruta imagen png/jpg>
// Verifica el canal como subir-studio.mjs (nunca toca un video de otro canal), abre /video/<id>/edit, carga el archivo en el
// input de ytcp-thumbnail-uploader, espera la vista previa, pulsa Save y comprueba que Studio lo guardó.
import fs from 'node:fs';
import path from 'node:path';

const B = 'http://127.0.0.1:8777';
const CANAL = process.env.NR_CANAL_ID;
const NOMBRE = process.env.NR_CANAL_NOMBRE || 'En Números Rojos';
const [videoId, rutaArg] = process.argv.slice(2);
if (!videoId || !rutaArg) { console.error('uso: NR_CANAL_ID=UC… node miniatura-studio.mjs <videoId> <imagen>'); process.exit(2); }
if (!CANAL || !/^UC[\w-]{22}$/.test(CANAL)) { console.error('falta NR_CANAL_ID'); process.exit(2); }
const ruta = path.resolve(rutaArg);
if (!fs.existsSync(ruta)) { console.error('no existe', ruta); process.exit(2); }
if (fs.statSync(ruta).size > 2 * 1024 * 1024) { console.error('imagen > 2 MB: conviértela a JPG'); process.exit(2); }

const q = (s) => encodeURIComponent(s);
const llamar = async (p) => { const r = await fetch(B + p); const t = await r.text(); try { return JSON.parse(t); } catch { return t; } };
const esperar = (ms) => llamar(`/esperar?ms=${ms}`);
const evalJs = (js) => llamar(`/eval?js=${q(js)}`);
const textoPagina = async () => { const t = await llamar('/texto'); return typeof t === 'string' ? t : JSON.stringify(t); };
const hasta = async (fn, ms = 60000, paso = 1000, nombre = 'condición') => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await esperar(paso); }
  throw new Error('timeout esperando ' + nombre);
};
const fallo = (m) => { console.error('FALLO:', m); process.exit(1); };

const asegurarCanal = async () => {
  await esperar(2500);
  for (let i = 0; i < 2; i++) {
    const tx = await textoPagina();
    if (/don.t have permission to view this page/i.test(tx)) {
      console.log(`… Studio está en otro canal → "Switch account" → "${NOMBRE}"`);
      await llamar(`/clicktexto?texto=${q('Switch account')}&exacto=1`); await esperar(4000);
      const r = await llamar(`/clicktexto?texto=${q(NOMBRE)}&exacto=1`);
      if (r && r.error) fallo('no pude elegir el canal: ' + r.error);
      await esperar(6000); continue;
    }
    if (!/Select a channel/i.test(tx)) break;
    const r = await llamar(`/clicktexto?texto=${q(NOMBRE)}&exacto=1`);
    if (r && r.error) fallo('no pude elegir el canal: ' + r.error);
    await esperar(5000);
  }
  const estado = () => evalJs(`({u:location.href,n:(document.querySelector('#entity-name, ytcp-navigation-drawer')?.innerText||'').replace(/\\n+/g,' | ')})`);
  let e = {};
  try {
    e = await hasta(async () => { const v = await estado(); return v && typeof v === 'object' && !/signin_prompt/.test(v.u) && v.n.includes(NOMBRE) ? v : null; }, 30000, 1500, 'verificación de canal');
  } catch { e = await estado(); fallo('no estoy en el canal "' + NOMBRE + '": ' + JSON.stringify(e).slice(0, 300)); }
  console.log('✓ canal verificado:', (e.u || '').slice(0, 80));
};

// 1. Entrar al canal y a la página de edición del video.
await llamar(`/ir?url=${q(`https://studio.youtube.com/channel/${CANAL}`)}`);
await asegurarCanal();
await llamar(`/ir?url=${q(`https://studio.youtube.com/video/${videoId}/edit`)}`);
await esperar(4000);
const SEL = 'ytcp-thumbnails-compact-editor-uploader input[type=file], ytcp-thumbnail-uploader input[type=file], ytcp-video-metadata-editor input#file-loader';
try { await hasta(() => evalJs(`!!document.querySelector(${JSON.stringify(SEL)})`), 30000, 1500, 'input de miniatura'); }
catch { fallo('no encontré el input de miniatura en /video/' + videoId + '/edit (¿canal sin verificación por teléfono? ¿video de otro canal?)'); }
const titulo = await evalJs(`(document.querySelector('ytcp-video-metadata-editor #textbox, ytcp-social-suggestions-textbox #textbox')?.innerText||'').trim()`);
console.log(`→ ${videoId} · "${String(titulo).slice(0, 80)}" · miniatura ${path.basename(ruta)}`);

// 2. Cargar el archivo y esperar la vista previa.
const rm = await llamar(`/archivo?sel=${q(SEL)}&ruta=${q(ruta)}`);
if (rm && rm.error) fallo('archivo: ' + rm.error);
await hasta(() => evalJs(`[...document.querySelectorAll('ytcp-thumbnails-compact-editor-uploader img, ytcp-thumbnail-uploader img, #still-picker img')].some(i=>/^blob:|^data:/.test(i.src))`), 30000, 1500, 'vista previa de la miniatura')
  .catch(() => console.log('⚠ sin vista previa blob visible; sigo e intento guardar'));

// 3. Guardar.
const habilitado = await hasta(() => evalJs(`(()=>{const b=document.querySelector('ytcp-video-metadata-editor #save, #save-button, ytcp-button#save');return b && !b.hasAttribute('disabled') && b.getAttribute('aria-disabled')!=='true'})()`), 20000, 1000, 'botón Save habilitado').catch(() => false);
if (!habilitado) fallo('el botón Save no se habilitó (¿la miniatura no cargó?)');
await llamar(`/click?sel=${q('ytcp-video-metadata-editor #save, #save-button, ytcp-button#save')}`);
await esperar(3000);
// Si Studio abre un diálogo de confirmación (p. ej. "Save changes?"), aceptar.
const tx = await textoPagina();
if (/Changes saved|Cambios guardados/i.test(tx)) console.log('✓ Studio: cambios guardados');
else {
  const guardado = await hasta(async () => /Changes saved|Cambios guardados/i.test(await textoPagina()) || (await evalJs(`(()=>{const b=document.querySelector('ytcp-video-metadata-editor #save, #save-button, ytcp-button#save');return !b || b.hasAttribute('disabled') || b.getAttribute('aria-disabled')==='true'})()`)), 20000, 1500, 'guardado').catch(() => false);
  console.log(guardado ? '✓ guardado (Save volvió a deshabilitarse)' : '⚠ no pude confirmar el guardado: revisar en Studio');
}
await llamar(`/captura?ruta=${q(`/tmp/miniatura-${videoId}.png`)}`);
console.log('captura: /tmp/miniatura-' + videoId + '.png');
