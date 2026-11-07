/**
 * Mascota de En Números Rojos (prototipo): pedir la hoja de poses a GPT, esperarla y recortarla.
 *   npx tsx scripts/mascota.mts pedir [v2]      imprime el comando `gh api -X PUT …` (NO lo ejecuta)
 *   npx tsx scripts/mascota.mts esperar         descarga la Salida cada 60 s (hasta 30 min), verifica IEND
 *   npx tsx scripts/mascota.mts recortar <hoja.png>   recorta 3×2 → public/mascota/<pose>.png (+ hoja.png)
 * Sin sharp/jimp: recorta con el ffmpeg de Remotion (filtro crop) y verifica PNG con la cabecera/IEND.
 */
import fs from 'node:fs';
import path from 'node:path';
import { correrBinario, FFMPEG_R } from './lib/fotogramas.mjs';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const POSES = ['saluda', 'senala', 'piensa', 'sorpresa', 'tapa-ojos', 'celebra'] as const; // fila 1: 3 primeras; fila 2: 3 últimas
const REPO_EC = 'sinostrozadev/entender-chile';
const PEDIDOS = { v1: 'PEDIDO-numeros-rojos-mascota-poses.md', v2: 'PEDIDO-numeros-rojos-mascota-poses-v2.md' } as const;
const DIR_PEDIDOS = path.join(RAIZ, 'salida', 'caratulas', 'pedidos');
const DESTINO_HOJA = path.join(RAIZ, 'salida', 'caratulas', 'mascota-poses.png');
const RECORTE_ROTULO = 0.12;

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
  const cw = Math.floor(info.ancho / 3), ch = Math.floor(info.alto / 2), util = Math.floor(ch * (1 - RECORTE_ROTULO));
  const dir = process.env.MASCOTA_DIR ?? path.join(RAIZ, 'public', 'mascota');
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(hoja, path.join(dir, 'hoja.png'));
  console.log(`Hoja ${info.ancho}x${info.alto} → celdas ${cw}x${ch}, útil ${cw}x${util} (se quita el ${RECORTE_ROTULO * 100} % inferior)`);
  let ok = true;
  for (let i = 0; i < POSES.length; i++) {
    const x = (i % 3) * cw, y = Math.floor(i / 3) * ch;
    const salida = path.join(dir, `${POSES[i]}.png`);
    const r = await correrBinario(FFMPEG_R, ['-v', 'error', '-y', '-i', hoja, '-vf', `crop=${cw}:${util}:${x}:${y}`, '-frames:v', '1', salida]);
    if (r.codigo !== 0) { console.error(`✗ ${POSES[i]}: ${r.error}`); ok = false; continue; }
    const p = infoPng(salida);
    const bien = p.entero && p.ancho === cw && p.alto === util;
    if (!bien) ok = false;
    console.log(`${bien ? '✓' : '✗'} ${POSES[i]}.png ${p.ancho}x${p.alto} ${p.bytes} bytes ${p.entero ? 'IEND_OK' : 'INCOMPLETO'}`);
  }
  if (!ok) process.exit(1);
};

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'pedir') pedir(arg);
else if (cmd === 'esperar') await esperar(arg);
else if (cmd === 'recortar') await recortar(arg);
else { console.error('Uso: mascota.mts pedir [v2] | esperar [v2] | recortar <hoja.png>'); process.exit(1); }
