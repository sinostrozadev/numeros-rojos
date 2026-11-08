/**
 * Mascota de En Números Rojos (prototipo): pedir la hoja de poses a GPT, esperarla y recortarla.
 *   npx tsx scripts/mascota.mts pedir [v2]      imprime el comando `gh api -X PUT …` (NO lo ejecuta)
 *   npx tsx scripts/mascota.mts esperar         descarga la Salida cada 60 s (hasta 30 min), verifica IEND
 *   npx tsx scripts/mascota.mts recortar <hoja.png>   recorta 3×2 → public/mascota/<pose>.png (+ hoja.png)
 * Sin sharp/jimp: recorta con el Chromium headless de Playwright (canvas): celda sin rótulo, fondo transparente por relleno
 * desde los bordes, lienzo ajustado. Verifica PNG con la cabecera/IEND.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const POSES = ['saluda', 'senala', 'piensa', 'sorpresa', 'tapa-ojos', 'celebra'] as const; // fila 1: 3 primeras; fila 2: 3 últimas
const REPO_EC = 'sinostrozadev/entender-chile';
const PEDIDOS = { v1: 'PEDIDO-numeros-rojos-mascota-poses.md', v2: 'PEDIDO-numeros-rojos-mascota-poses-v2.md' } as const;
const DIR_PEDIDOS = path.join(RAIZ, 'salida', 'caratulas', 'pedidos');
const DESTINO_HOJA = path.join(RAIZ, 'salida', 'caratulas', 'mascota-poses.png');
const RECORTE_ROTULO = 0.2; // la hoja de GPT escribe el nombre de la pose en el 20 % inferior de cada celda
const INSET_CELDA = 0.02; // margen que se descarta en cada lado de la celda (líneas de la grilla)
const TOLERANCIA_FONDO = 60; // suma |ΔR|+|ΔG|+|ΔB| respecto del píxel de la esquina para considerarlo fondo

/** Se ejecuta DENTRO de Chromium (ver recortar). Recibe { poses, inset, rotulo, tolerancia }. */
const CODIGO_RECORTE = `({ poses, inset, rotulo, tolerancia }) => {
  const img = document.querySelector('img');
  const W = img.naturalWidth, H = img.naturalHeight, cw = Math.floor(W / 3), ch = Math.floor(H / 2);
  const res = [];
  poses.forEach((pose, i) => {
    const x0 = (i % 3) * cw + Math.round(cw * inset), y0 = Math.floor(i / 3) * ch + Math.round(ch * inset);
    const w = cw - 2 * Math.round(cw * inset), h = Math.round(ch * (1 - rotulo)) - Math.round(ch * inset);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); ctx.drawImage(img, x0, y0, w, h, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h), px = d.data;
    const fondo = [px[0], px[1], px[2]];
    const parecido = (k) => Math.abs(px[k] - fondo[0]) + Math.abs(px[k + 1] - fondo[1]) + Math.abs(px[k + 2] - fondo[2]) <= tolerancia;
    const visto = new Uint8Array(w * h); const cola = [];
    for (let x = 0; x < w; x++) { cola.push(x, (h - 1) * w + x); }
    for (let y = 0; y < h; y++) { cola.push(y * w, y * w + w - 1); }
    while (cola.length) {
      const p = cola.pop(); if (visto[p]) continue; visto[p] = 1;
      if (!parecido(p * 4)) continue;
      px[p * 4 + 3] = 0;
      const x = p % w, y = (p - x) / w;
      if (x > 0) cola.push(p - 1); if (x < w - 1) cola.push(p + 1); if (y > 0) cola.push(p - w); if (y < h - 1) cola.push(p + w);
    }
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let p = 0; p < w * h; p++) if (px[p * 4 + 3] > 0) { const x = p % w, y = (p - x) / w; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    ctx.putImageData(d, 0, 0);
    const rw = maxX - minX + 5, rh = maxY - minY + 5;
    const c2 = document.createElement('canvas'); c2.width = rw; c2.height = rh;
    c2.getContext('2d').drawImage(c, minX - 2, minY - 2, rw, rh, 0, 0, rw, rh);
    res.push({ pose, dataUrl: c2.toDataURL('image/png'), ancho: rw, alto: rh });
  });
  return res;
}`;

/** Lee ancho/alto/IEND de un PNG. */
const infoPng = (archivo: string) => {
  const b = fs.readFileSync(archivo);
  const firma = b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return { bytes: b.length, ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20), entero: firma && b.subarray(b.length - 8, b.length - 4).toString() === 'IEND' };
};

/** Lee la ruta de Salida del pedido (cabecera `Salida:`). */
const salidaDe = (version: keyof typeof PEDIDOS) => {
  const t = fs.readFileSync(path.join(DIR_PEDIDOS, PEDIDOS[version]), 'utf8');
  const m = t.match(/^Salida:\s*(\S+)/m);
  if (!m) throw new Error('El pedido no tiene "Salida:"');
  return m[1];
};

const pedir = (v: string | undefined) => {
  const version = v === 'v2' ? 'v2' : 'v1';
  const archivo = path.join(DIR_PEDIDOS, PEDIDOS[version]);
  const ruta = `contenido/urgente/${PEDIDOS[version]}`;
  console.log(`# Solo entre 09:00 y 23:00 (America/Santiago). Mira antes: gh api repos/${REPO_EC}/contents/contenido/urgente --jq '.[].name'`);
  console.log(`gh api -X PUT repos/${REPO_EC}/contents/${ruta} -f message="pedido imagen externo: numeros-rojos mascota-poses${version === 'v2' ? ' v2' : ''}" -f content="$(base64 -w0 ${archivo})"`);
  console.log(`# Salida esperada: ${salidaDe(version)}`);
};

const esperar = async (v: string | undefined) => {
  const version = v === 'v2' ? 'v2' : 'v1';
  const url = `https://raw.githubusercontent.com/${REPO_EC}/main/${salidaDe(version)}`;
  fs.mkdirSync(path.dirname(DESTINO_HOJA), { recursive: true });
  for (let i = 1; i <= 30; i++) {
    const r = await fetch(url).catch(() => null);
    if (r?.ok) {
      fs.writeFileSync(DESTINO_HOJA, Buffer.from(await r.arrayBuffer()));
      const info = infoPng(DESTINO_HOJA);
      console.log(`${DESTINO_HOJA}: ${info.bytes} bytes ${info.ancho}x${info.alto} ${info.entero ? 'IEND_OK' : 'INCOMPLETO'}`);
      if (info.entero) { console.log(`Siguiente: npx tsx scripts/mascota.mts recortar ${DESTINO_HOJA}`); return; }
    } else console.log(`[${i}/30] aún no (${r?.status ?? 'sin red'})`);
    await new Promise((s) => setTimeout(s, 60_000));
  }
  const noPude = url.replace(/\.png$/, '-NO-PUDE.md');
  console.error(`No llegó en 30 min. Mira ${noPude} y: gh run list -R ${REPO_EC} -w "Pedido a GPT" -L 3`);
  process.exit(1);
};

const recortar = async (hoja: string | undefined) => {
  if (!hoja) throw new Error('Uso: recortar <hoja.png>');
  const info = infoPng(hoja);
  if (!info.entero) throw new Error(`${hoja} está incompleta (sin IEND)`);
  const dir = process.env.MASCOTA_DIR ?? path.join(RAIZ, 'public', 'mascota');
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(hoja, path.join(dir, 'hoja.png'));
  // Chromium headless (Playwright del piloto de Bolita Lab, solo lectura; NO toca el 8777): canvas para recortar la celda,
  // volver transparente el fondo oscuro (relleno desde los bordes con tolerancia, así se van también las líneas de la grilla)
  // y ajustar el lienzo al dibujo. Sin esto el PNG trae el fondo de la hoja (se ve el cuadrado) y el rótulo de la pose.
  const requerir = createRequire('/home/santiago/projects/yt/bolita-lab/herramientas/navegador/package.json');
  const { chromium } = requerir('playwright');
  const navegador = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 900 } });
  await pagina.goto(`file://${path.resolve(hoja)}`);
  // El código del navegador va como TEXTO (JS plano): tsx/esbuild inyecta un helper `__name` en las funciones y
  // page.evaluate(fn) lo pierde al serializar ("__name is not defined").
  const args = JSON.stringify({ poses: POSES, inset: INSET_CELDA, rotulo: RECORTE_ROTULO, tolerancia: TOLERANCIA_FONDO });
  const recortes: { pose: string; dataUrl: string; ancho: number; alto: number }[] = await pagina.evaluate(`(${CODIGO_RECORTE})(${args})`);
  await navegador.close();
  console.log(`Hoja ${info.ancho}x${info.alto} → 3×2 celdas; se quita el ${RECORTE_ROTULO * 100} % inferior (rótulo), fondo transparente`);
  let ok = true;
  for (const r of recortes) {
    const salida = path.join(dir, `${r.pose}.png`);
    fs.writeFileSync(salida, Buffer.from(r.dataUrl.split(',')[1], 'base64'));
    const p = infoPng(salida);
    const bien = p.entero && p.ancho > 100 && p.alto > 100;
    if (!bien) ok = false;
    console.log(`${bien ? '✓' : '✗'} ${r.pose}.png ${p.ancho}x${p.alto} ${p.bytes} bytes ${p.entero ? 'IEND_OK' : 'INCOMPLETO'}`);
  }
  if (!ok) process.exit(1);
};

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'pedir') pedir(arg);
else if (cmd === 'esperar') await esperar(arg);
else if (cmd === 'recortar') await recortar(arg);
else { console.error('Uso: mascota.mts pedir [v2] | esperar [v2] | recortar <hoja.png>'); process.exit(1); }
