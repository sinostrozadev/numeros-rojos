/**
 * CLI de datos de En Números Rojos (usa scripts/lib/datos.mts).
 *
 *   npx tsx scripts/datos.mts traer <wdi|owid> <indicador> <ISO3,ISO3…> [desde] [hasta] [--refrescar]
 *   npx tsx scripts/datos.mts catalogo [filtro]
 *   npx tsx scripts/datos.mts buscar <texto>              # busca indicadores WDI por nombre en la API del Banco Mundial
 *   npx tsx scripts/datos.mts refrescar [wdi|owid]        # vuelve a descargar todo lo que está en la caché
 *   npx tsx scripts/datos.mts verificar-catalogo          # GET real de cada indicador del catálogo; quita los que fallan
 *
 * La caché vive en contenido/datos/<fuente>/<indicador>.json (archivo completo; se recorta en memoria).
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  ARCHIVO_CATALOGO, LICENCIA_OK, RAIZ_DATOS, cargarIndicador, catalogo, elegirColumnaOwid, fmtNumero, obtener, proveedorDe, resolverDatos, urlWdi,
  type EntradaCatalogo, type MetaOwid,
} from './lib/datos.mjs';
import type { DatoRef } from '../src/plantillas/comun/datos';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const refrescar = process.argv.includes('--refrescar');
const [sub, ...resto] = args;

const AYUDA = `Uso:
  npx tsx scripts/datos.mts traer <wdi|owid> <indicador> <ISO3,ISO3…> [desde] [hasta] [--refrescar]
  npx tsx scripts/datos.mts catalogo [filtro]
  npx tsx scripts/datos.mts buscar <texto>
  npx tsx scripts/datos.mts refrescar [wdi|owid]
  npx tsx scripts/datos.mts verificar-catalogo [--dry-run]`;

const traer = async () => {
  const [fuente, indicador, paisesTxt, desdeTxt, hastaTxt] = resto;
  if ((fuente !== 'wdi' && fuente !== 'owid') || !indicador || !paisesTxt) throw new Error(AYUDA);
  const ref: DatoRef = {
    fuente, indicador,
    paises: paisesTxt.toUpperCase().split(/[,;]/).filter(Boolean),
    ...(desdeTxt ? { desde: parseInt(desdeTxt, 10) } : {}),
    ...(hastaTxt ? { hasta: parseInt(hastaTxt, 10) } : {}),
  };
  const [s] = await resolverDatos([ref], { refrescar });
  console.log(`${s.etiqueta}${s.unidad ? ` (${s.unidad})` : ''}`);
  console.log(`Fuente: ${s.fuenteTexto} · ${s.fuenteUrl} · consultado ${s.consultadoEn}\n`);
  const isos = Object.keys(s.series);
  const anios = [...new Set(isos.flatMap((i) => s.series[i].puntos.map((p) => p.anio)))].sort((a, b) => a - b);
  const ancho = 14;
  console.log('año   ' + isos.map((i) => s.series[i].pais.slice(0, ancho - 1).padStart(ancho)).join(''));
  for (const a of anios) {
    console.log(String(a).padEnd(6) + isos.map((i) => fmtNumero(s.series[i].puntos.find((p) => p.anio === a)?.valor).padStart(ancho)).join(''));
  }
  for (const i of isos) {
    const p = s.series[i].puntos;
    console.log(`\n${s.series[i].pais}: ${p.length} años con dato (${p[0]?.anio}–${p.at(-1)?.anio}); último ${fmtNumero(p.at(-1)?.valor)}`);
  }
};

const verCatalogo = () => {
  const filtro = (resto.join(' ') || '').toLowerCase();
  const lista = catalogo().filter((e) => !filtro || JSON.stringify(e).toLowerCase().includes(filtro));
  for (const e of lista) {
    console.log(`${e.fuente.padEnd(5)} ${e.indicador.padEnd(48)} ${e.etiqueta} [${e.unidad}]${e.anios ? ` ${e.anios}` : ''}\n      ${e.paraQue}`);
  }
  console.log(`\n${lista.length} indicador(es)${filtro ? ` con "${filtro}"` : ''}.`);
};

const buscar = async () => {
  const texto = resto.join(' ').trim().toLowerCase();
  if (!texto) throw new Error(AYUDA);
  const j = await obtener('https://api.worldbank.org/v2/indicator?format=json&per_page=20000&source=2');
  const filas = (j?.[1] ?? []) as Array<{ id: string; name: string; sourceNote?: string }>;
  const palabras = texto.split(/\s+/);
  const hits = filas.filter((f) => palabras.every((p) => `${f.id} ${f.name}`.toLowerCase().includes(p)));
  for (const f of hits.slice(0, 60)) console.log(`${f.id.padEnd(26)} ${f.name}`);
  console.log(`\n${hits.length} indicador(es) WDI con "${texto}"${hits.length > 60 ? ' (se muestran 60)' : ''}. Pruébalo con: datos.mts traer wdi <CODIGO> CHL`);
};

const refrescarTodo = async () => {
  const fuentes = (resto[0] ? [resto[0]] : ['wdi', 'owid']) as Array<'wdi' | 'owid'>;
  let ok = 0, mal = 0;
  for (const f of fuentes) {
    const dir = path.join(RAIZ_DATOS, f);
    if (!fs.existsSync(dir)) continue;
    for (const archivo of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      const { indicador } = JSON.parse(fs.readFileSync(path.join(dir, archivo), 'utf8')) as { indicador: string };
      try {
        const c = await cargarIndicador(f, indicador, true);
        console.log(`✓ ${f} ${indicador} (${Object.keys(c.series).length} países, ${c.consultadoEn})`);
        ok++;
      } catch (e) {
        console.log(`✗ ${f} ${indicador}: ${(e as Error).message}`);
        mal++;
      }
    }
  }
  console.log(`\n${ok} refrescado(s), ${mal} con error.`);
  if (mal) process.exitCode = 1;
};


/**
 * Verifica cada entrada del catálogo con un GET real. WDI: 1 país (CHL, si no MEX/USA) → años con dato.
 * OWID: metadata.json sin redirección a una vista con parámetros, columna numérica, y la licencia de CADA proveedor
 * original (api.ourworldindata.org …/indicators/<id>.metadata.json → origins[].license): debe ser CC BY.
 * Las que fallan se quitan del catálogo (con --dry-run solo se informa).
 */
const verificarCatalogo = async () => {
  const crudo = JSON.parse(fs.readFileSync(ARCHIVO_CATALOGO, 'utf8')) as { indicadores: EntradaCatalogo[] } & Record<string, unknown>;
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());
  const buenos: EntradaCatalogo[] = [];
  const malos: string[] = [];
  for (const e of crudo.indicadores) {
    try {
      if (e.fuente === 'wdi') {
        let anios = '';
        for (const pais of ['CHL', 'MEX', 'USA']) {
          const j = await obtener(urlWdi(e.indicador, pais, undefined, undefined, 200));
          const filas = (Array.isArray(j) && Array.isArray(j[1]) ? j[1] : []) as Array<{ date: string; value: number | null }>;
          const con = filas.filter((f) => f.value !== null).map((f) => +f.date).sort((a, b) => a - b);
          if (con.length) { anios = `${con[0]}–${con.at(-1)} (${pais}, ${con.length} años)`; break; }
        }
        if (!anios) throw new Error('la API no devuelve datos (CHL, MEX ni USA)');
        buenos.push({ ...e, anios, verificado: hoy });
        console.log(`✓ wdi  ${e.indicador.padEnd(24)} ${anios}`);
      } else {
        const url = `https://ourworldindata.org/grapher/${e.indicador.split('#')[0]}.metadata.json`;
        const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        if (r.url.includes('?')) throw new Error(`redirige a una vista con parámetros (${r.url}): usa otro slug`);
        const meta = (await r.json()) as MetaOwid;
        const col = elegirColumnaOwid(meta, e.indicador.split('#')[1]);
        const completo = col.fullMetadata ? await obtener(col.fullMetadata) as { nonRedistributable?: boolean; origins?: Array<{ producer?: string; license?: { name?: string } }> } : {};
        if (completo.nonRedistributable) throw new Error('OWID lo marca como no redistribuible');
        const licencias = [...new Set((completo.origins ?? []).map((o) => o.license?.name ?? '(sin licencia declarada)'))];
        const malas = licencias.filter((l) => !LICENCIA_OK.test(l));
        if (!licencias.length || malas.length) throw new Error(`licencia del proveedor no es CC BY: ${licencias.join(' · ') || '(sin dato)'}`);
        const canonico = new URL(r.url).pathname.replace(/^\/grapher\//, '').replace(/\.metadata\.json$/, '');
        const proveedor = proveedorDe(col.citationShort ?? '');
        buenos.push({ ...e, indicador: canonico + (e.indicador.includes('#') ? `#${e.indicador.split('#')[1]}` : ''), anios: col.timespan ?? '', proveedor, licenciaOrigen: licencias.join(' · '), verificado: hoy });
        console.log(`✓ owid ${canonico.padEnd(44)} ${col.timespan ?? ''} · ${licencias.join(' · ')} · ${proveedor.slice(0, 60)}`);
      }
    } catch (err) {
      malos.push(`${e.fuente} ${e.indicador}: ${(err as Error).message}`);
      console.log(`✗ ${e.fuente} ${e.indicador}: ${(err as Error).message}`);
    }
  }
  console.log(`\n${buenos.length} verificados (${buenos.filter((x) => x.fuente === 'wdi').length} WDI, ${buenos.filter((x) => x.fuente === 'owid').length} OWID), ${malos.length} descartados.`);
  if (!process.argv.includes('--dry-run')) {
    fs.writeFileSync(ARCHIVO_CATALOGO, JSON.stringify({ ...crudo, verificadoEn: hoy, indicadores: buenos, descartados: [...((crudo.descartados as string[] | undefined) ?? []), ...malos.map((m) => `${hoy} ${m}`)] }, null, 2) + '\n');
    console.log(`✓ ${path.relative(process.cwd(), ARCHIVO_CATALOGO)} actualizado.`);
  }
};

const main = async () => {
  switch (sub) {
    case 'traer': return traer();
    case 'catalogo': return verCatalogo();
    case 'buscar': return buscar();
    case 'refrescar': return refrescarTodo();
    case 'verificar-catalogo': return verificarCatalogo();
    default: console.log(AYUDA);
  }
};

main().catch((e) => { console.error(`✗ ${(e as Error).message}`); process.exit(1); });
