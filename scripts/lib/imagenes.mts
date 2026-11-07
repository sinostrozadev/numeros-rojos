/**
 * Fotos de archivo para los visuales `foto` (Wikimedia Commons, solo licencias claras). Portado de Línea Punteada
 * (scripts/imagenes.mts) y adaptado al contrato de src/plantillas/comun/visual.ts.
 *   prepararFotos(id, [{ clave, visual }]) → { visuales: VisualesResueltos, creditos, fallidas }
 * Para cada pedido prueba `busqueda` y luego `alternativas` en orden, y elige la PRIMERA foto que:
 *   - sea jpg/png con ≥ 1200 px en el lado mayor,
 *   - tenga licencia Public domain, CC0, CC BY o CC BY-SA (rechaza NC, ND y desconocidas),
 *   - NO tenga `Restrictions` (marcas, derechos de imagen, insignias…) ni categorías prohibidas.
 * Descarga una versión de 1280 px a public/imagenes/<id>/<clave>.<ext>. Caché en public/imagenes/<id>/imagenes.json:
 * si las búsquedas no cambiaron y el archivo existe, se reutiliza sin red (Commons cambia con el tiempo; así el
 * video es reproducible). No lanza: lo que falla queda sin foto (la escena cae al gráfico previo) y se informa.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { z } from 'zod';
import type { FotoResuelta, VisualFoto, VisualesResueltos } from '../../src/plantillas/comun/visual';

type PedidoFoto = { clave: string; visual: z.infer<typeof VisualFoto> };

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const API = 'https://commons.wikimedia.org/w/api.php';
/** Wikimedia pide un User-Agent descriptivo con contacto: https://meta.wikimedia.org/wiki/User-Agent_policy */
const USER_AGENT = 'EnNumerosRojos/1.0 (canal de YouTube En Números Rojos; contacto: sinostrozadev@gmail.com)';
const LADO_MINIMO = 1200;
const ANCHO_DESCARGA = 1280;
const RESULTADOS = 20;

type Clase = 'libre' | 'atribucion';

/** Clasifica la licencia corta de Commons. null = no se usa (NC, ND, desconocida). */
export const clasificarLicencia = (corta: string | undefined): Clase | null => {
  const s = (corta ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!s) return null;
  if (/\bnc\b|\bnd\b|non-?commercial|no ?deriv/.test(s)) return null;
  if (/^(public domain|dominio p[uú]blico|pd($|[ -])|cc0|cc-zero|no restrictions)/.test(s)) return 'libre';
  if (/^cc[ -]by(?:[ -]sa)?(?:[ -]\d(?:\.\d)?)?(?:[ -][a-z]{2,3})?$/.test(s)) return 'atribucion';
  return null;
};

const sinHtml = (h: string) => h.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

const pedir = async (url: string): Promise<Response> => {
  for (let intento = 1; ; intento++) {
    const r = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT } });
    if (r.ok || intento >= 3 || (r.status !== 429 && r.status < 500)) return r;
    await espera(1500 * intento);
  }
};

type Pagina = {
  index?: number;
  title: string;
  categories?: { title: string }[];
  imageinfo?: { url: string; thumburl?: string; descriptionurl: string; width: number; height: number; mime: string; extmetadata?: Record<string, { value: string }> }[];
};

/** Categorías que descartan un archivo aunque su licencia sea libre. */
const CATEGORIAS_PROHIBIDAS = /trademark|nudity|nude\b|pornograph|logos?\b/i;

const consultar = async (busqueda: string): Promise<Pagina[]> => {
  const p = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '1',
    prop: 'imageinfo|categories', cllimit: 'max',
    iiprop: 'url|extmetadata|size|mime', iiurlwidth: String(ANCHO_DESCARGA),
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|ObjectName|Restrictions',
    generator: 'search', gsrsearch: `${busqueda} filetype:bitmap`, gsrnamespace: '6', gsrlimit: String(RESULTADOS),
  });
  const r = await pedir(`${API}?${p}`);
  if (!r.ok) throw new Error(`Commons respondió ${r.status}`);
  const d = (await r.json()) as { query?: { pages?: Record<string, Pagina> } };
  return Object.values(d.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
};

type Candidata = Omit<FotoResuelta, 'archivo'> & { descarga: string; ext: string; clase: Clase; licenciaUrl?: string };

/** Primera página que cumple formato, tamaño, licencia y categorías. */
const elegir = (paginas: Pagina[]): { candidata?: Candidata; rechazos: string[] } => {
  const rechazos: string[] = [];
  for (const pg of paginas) {
    const ii = pg.imageinfo?.[0];
    if (!ii) continue;
    const m = ii.extmetadata ?? {};
    const corta = m.LicenseShortName?.value;
    const motivo =
      !/^image\/(jpeg|png)$/.test(ii.mime) ? `formato ${ii.mime}`
      : Math.max(ii.width, ii.height) < LADO_MINIMO ? `chica (${ii.width}×${ii.height})`
      : !clasificarLicencia(corta) ? `licencia "${corta ?? '?'}"`
      : sinHtml(m.Restrictions?.value ?? '') ? `restricciones "${sinHtml(m.Restrictions!.value).slice(0, 40)}"`
      : pg.categories?.some((c) => CATEGORIAS_PROHIBIDAS.test(c.title)) ? 'categoría prohibida'
      : '';
    if (motivo) { rechazos.push(`${pg.title}: ${motivo}`); continue; }
    const k = Math.min(1, ANCHO_DESCARGA / ii.width);
    return {
      candidata: {
        titulo: pg.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
        pagina: ii.descriptionurl,
        autor: sinHtml(m.Artist?.value ?? '') || sinHtml(m.Credit?.value ?? '') || 'Autor desconocido (Wikimedia Commons)',
        licencia: corta!.trim(),
        licenciaUrl: m.LicenseUrl?.value,
        ancho: Math.round(ii.width * k),
        alto: Math.round(ii.height * k),
        descarga: ii.thumburl ?? ii.url,
        ext: ii.mime === 'image/png' ? 'png' : 'jpg',
        clase: clasificarLicencia(corta)!,
      },
      rechazos,
    };
  }
  return { rechazos };
};

type Manifiesto = Record<string, { busquedas: string; foto: FotoResuelta; licenciaUrl?: string }>;

/** Texto de créditos para la descripción: "Fotos: <título> — <autor> (<licencia>), <url>; …" (vacío si no hay fotos). */
export const textoCreditos = (fotos: { foto: FotoResuelta; licenciaUrl?: string }[]): string => {
  const vistas = new Set<string>();
  const partes: string[] = [];
  for (const { foto, licenciaUrl } of fotos) {
    if (vistas.has(foto.pagina)) continue;
    vistas.add(foto.pagina);
    // TASL: título, autor, fuente y licencia (con el enlace de la licencia cuando pide atribución).
    const lic = licenciaUrl && clasificarLicencia(foto.licencia) === 'atribucion' ? `${foto.licencia}, ${licenciaUrl}` : foto.licencia;
    partes.push(`${foto.titulo} — ${foto.autor} (${lic}), ${foto.pagina}`);
  }
  return partes.length ? `Fotos (Wikimedia Commons): ${partes.join('; ')}` : '';
};

/** Busca, descarga y devuelve las fotos pedidas. No lanza: lo que falla queda en `fallidas`. */
export const prepararFotos = async (id: string, pedidos: PedidoFoto[]): Promise<{ visuales: VisualesResueltos; creditos: string; fallidas: string[] }> => {
  const dir = path.join(RAIZ, 'public', 'imagenes', id);
  const rutaManifiesto = path.join(dir, 'imagenes.json');
  let previo: Manifiesto = {};
  try { previo = JSON.parse(fs.readFileSync(rutaManifiesto, 'utf8')) as Manifiesto; } catch { /* primera vez */ }
  const nuevo: Manifiesto = {};
  const visuales: VisualesResueltos = {};
  const fallidas: string[] = [];
  if (pedidos.length) fs.mkdirSync(dir, { recursive: true });
  for (const { clave, visual } of pedidos) {
    const busquedas = [visual.busqueda, ...(visual.alternativas ?? [])];
    const firma = busquedas.join(' | ');
    const enCache = previo[clave];
    if (enCache && enCache.busquedas === firma && fs.existsSync(path.join(RAIZ, 'public', enCache.foto.archivo))) {
      nuevo[clave] = enCache;
      visuales[clave] = { foto: enCache.foto };
      console.log(`  foto ${clave}: en caché (${enCache.foto.titulo})`);
      continue;
    }
    let lista = false;
    for (const b of busquedas) {
      try {
        const { candidata, rechazos } = elegir(await consultar(b));
        if (!candidata) { console.log(`  · foto ${clave} "${b}": ninguna válida (${rechazos.length} descartadas${rechazos.length ? `: ${rechazos.slice(0, 2).join('; ')}` : ''})`); await espera(250); continue; }
        const r = await pedir(candidata.descarga);
        const tipo = r.headers.get('content-type') ?? '';
        if (!r.ok || !/^image\/(jpeg|png)/.test(tipo)) throw new Error(`descarga ${r.status} ${tipo}`);
        for (const ext of ['jpg', 'png']) if (ext !== candidata.ext) fs.rmSync(path.join(dir, `${clave}.${ext}`), { force: true });
        fs.writeFileSync(path.join(dir, `${clave}.${candidata.ext}`), Buffer.from(await r.arrayBuffer()));
        const { descarga: _d, ext, clase, licenciaUrl, ...meta } = candidata;
        const foto: FotoResuelta = { ...meta, archivo: `imagenes/${id}/${clave}.${ext}` };
        nuevo[clave] = { busquedas: firma, foto, licenciaUrl };
        visuales[clave] = { foto };
        console.log(`  foto ${clave} "${b}" → ${foto.titulo} (${foto.licencia}${clase === 'atribucion' ? ', con atribución' : ''})`);
        lista = true;
        await espera(250); // cortesía con la API
        break;
      } catch (e) {
        console.log(`  · foto ${clave} "${b}": ${(e as Error).message}`);
      }
    }
    if (!lista) fallidas.push(clave);
  }
  if (pedidos.length) fs.writeFileSync(rutaManifiesto, JSON.stringify(nuevo, null, 2) + '\n');
  return { visuales, creditos: textoCreditos(Object.values(nuevo)), fallidas };
};
