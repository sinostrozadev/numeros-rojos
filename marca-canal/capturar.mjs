// Genera los PNG de marca desde los HTML de esta carpeta (método de linea-punteada/marca-canal).
// Uso: node marca-canal/capturar.mjs   (Playwright/Chromium del navegador de bolita-lab; no instala nada)
import { chromium } from '/home/santiago/projects/yt/bolita-lab/herramientas/navegador/node_modules/playwright/index.mjs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const trabajos = [
  ['avatar.html', 'avatar.png', 800, 800, false],
  ['banner.html', 'banner.png', 2560, 1440, false],
  ['banner-guia.html', 'banner-guia.png', 2560, 1440, false],
  ['marca.html', 'marca-de-agua.png', 400, 120, true],
  ['prueba48.html', 'prueba48.png', 300, 110, false],
  ['marca-sobre-fotograma.html', 'marca-sobre-fotograma.png', 960, 540, false],
];
const b = await chromium.launch({ args: ['--disable-gpu', '--no-sandbox', '--renderer-process-limit=2'] });
try {
  for (const [h, o, w, hh, t] of trabajos) {
    const p = await b.newPage({ viewport: { width: w, height: hh }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.join(dir, h));
    await p.waitForTimeout(1500);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(dir, o), omitBackground: t });
    await p.close();
    console.log(o);
  }
} finally { await b.close(); }
