# Operación de En Números Rojos

Fábrica de dos formatos: el **largo `tesis`** (16:9, 9–12 min, lunes/miércoles/viernes 19:00: el producto) y el **Short
`grafico`** (9:16, 35–50 s, todos los días 13:00: el embudo). Reglas del canal: `docs/CONVENCIONES.md`. Rutina de cada sesión:
skill global `operacion-diaria`; si algo falla, `incidentes-canal`.

## Flujo
```
generar-guiones ─► contenido/backlog/<plantilla>-<slug>.json
        diario ─► contenido/guiones/<fecha>-<plantilla>-<slug>.json
               ─► verificar-cifras (GATE: si una cifra no cuadra → bandeja 'error', no se renderiza)
               ─► preparar-<plantilla> (datos → voz → sonido) ─► salida/trabajo/<id>.props.json
               ─► flock /tmp/bolita-render.lock remotion render (Grafico 1080×1920@60 | Tesis 1920×1080@30)
               ─► salida/bandeja/<id>.mp4 + <id>.json ('listo', tipo short|largo) [+ <id>-mini.png del largo]
               ─► subir-studio.mjs (piloto, hoy) o subir.mts (API, cuando Google audite el proyecto)
```
- **Orden de una noche:** huérfanos → Shorts hasta `minimoBandeja` (3) → largos hasta `minimoBandejaLargos` (2) → guiones
  si el backlog < `minimoBacklog` (8) → subida o `PARA-SUBIR-A-MANO.md`.
- **Largo:** tiempo máximo de render 240 min (`NR_RENDER_LARGO_MAX_MIN`); si se agota no se reintenta (pasarlo a render
  por tramos, skill `videos-largos` §5). Si existe la composición `Miniatura` en `src/Root.tsx`, el diario genera
  `salida/bandeja/<id>-mini.png` con `remotion still --frame=0` y los mismos props. La descripción recibe el bloque
  **Capítulos** con timestamps si `preparar-tesis` deja en los props `capitulosTiempos: [{titulo, inicio}]` o
  `tiempos.lineas[]` (orden de `lineasDeVozTesis`: gancho, promesa, escenas…, número, remate, siguiente). YouTube exige
  ≥ 3 capítulos de ≥ 10 s, el primero en 0:00 (el diario lo garantiza o no pone ninguno).
- Un fallo marca el guion `error` en la bandeja (con el motivo) y el diario sigue con el siguiente. Para reintentar:
  borrar `salida/bandeja/<id>.json`, arreglar el guion y devolverlo a `contenido/backlog/`.

## Datos (`contenido/datos/`)
- **Fuentes permitidas:** Banco Mundial WDI (CC BY 4.0), Our World in Data grapher (CC BY 4.0 + licencia del proveedor
  original, que también debe ser CC BY / CC0) y `manual` con URL de organismo oficial. Prohibidos: FMI, OCDE, Numbeo,
  Banco Central de Chile (hasta verificar términos).
- **Caché:** `contenido/datos/<wdi|owid>/<indicador>.json`, archivo COMPLETO por indicador (todos los países y años, una
  línea por país), con `url`, `licencia`, `consultadoEn`. Se recorta en memoria; sin red funciona con la caché.
- **Catálogo:** `contenido/datos/catalogo.json` (lo lee `generar-guiones`): 89 indicadores verificados el 2026-11-05
  (74 WDI + 15 OWID) con etiqueta en español, unidad, rango de años y "para qué sirve". `descartados` guarda los que no
  pasaron (licencia no CC BY: horas trabajadas PWT/Huberman, esperanza de vida larga, escolaridad Barro-Lee, mortalidad
  infantil UNICEF, gasto militar SIPRI). Cobertura irregular conocida: deuda del gobierno central (`GC.DOD.TOTL.GD.ZS`)
  de Chile solo 1995–2000.
- **Gotcha de la API del Banco Mundial:** sin `date=` la ruta `country/all` devuelve solo los últimos años y con otra
  fuente (`sourceid: null`). `urlWdi` siempre pide `source=2` y `date=1960:<año>`.
- **Operaciones de `Cifra`** (`calcularCifra`, tolerancia 5 %): `valor` (país, año; sin año = último con dato) ·
  `razon` (pais / paisB) · `variacion` ((v(anioB) − v(anio)) / v(anio); el `valor` puede venir en % —170— o fracción —1,7—)
  · `diferencia` (pais − paisB, o v(anioB) − v(anio) de un país) · `maximo`/`minimo`/`promedio` (entre anio y anioB) ·
  `ranking` (1 = mayor entre los `paises` del DatoRef; exacto). Si `texto` dice "mil / millones / mil millones / billones"
  y `valor` < 10.000, también se prueba `valor` × esa escala ("19 millones" con valor 19).
- **Reglas extra del revisor:** escena `dato` con dígitos en la voz → debe declarar `cifras`; dataset OWID cuyo proveedor no
  es CC BY → falla; indicador fuera del catálogo → aviso (no falla).
- Fixture válido: `contenido/datos/ejemplo-tesis-min.json` (tesis mínimo, texto de relleno, cifras reales; pasa con exit 0).

## Comandos
| Comando | Qué hace |
|---|---|
| `npx tsx scripts/diario.mts [--dry-run] [--n K] [--largos K] [--sin-largos] [--solo-largos] [--sin-generar] [--sin-subir]` | El día completo (lo corre el cron) |
| `npx tsx scripts/verificar-cifras.mts <guion.json\|props.json> [--json]` | Revisor numérico; exit 1 si algo no cuadra; `--json` → `salida/trabajo/<id>.verificacion.json` |
| `npx tsx scripts/datos.mts traer wdi NY.GDP.PCAP.PP.KD CHL,KOR 1990 2024` | Tabla de un indicador (de la caché o la red) |
| `npx tsx scripts/datos.mts catalogo [filtro]` · `buscar <texto>` | Catálogo propio · búsqueda de indicadores WDI por nombre |
| `npx tsx scripts/datos.mts refrescar` · `verificar-catalogo [--dry-run]` | Re-descarga la caché · GET real de cada indicador y su licencia |
| `npx tsx scripts/estado.mts [--sin-metricas]` | Bandeja de largos y de Shorts por separado, próximas ranuras de cada tipo, credenciales |
| `NR_CANAL_ID=UC… node herramientas/navegador/subir-studio.mjs <id> <AAAA-MM-DD> <HH:MM>` | Sube y programa por Studio con el piloto (largo o Short según la bandeja) |
| `npx tsx scripts/subir.mts exportar` · `subir --todos` · `autorizar` | Lista manual · subida por API · OAuth del canal |
| `npx tsx scripts/fotogramas.mts <mp4>` · `hoja-contacto.mts <mp4> <hoja.jpg> --cada 15` | Revisión visual (la hoja respeta 16:9 o 9:16) |
| `npx tsx scripts/compilar.mts` | Reserva, fuera del cron: compilación de Shorts (riesgo "reutilizado"; máx. 1 de cada 4 largos) |

## Subida de un largo por Studio (`subir-studio.mjs`)
Detecta `tipo: 'largo'` en `salida/bandeja/<id>.json`: lista "Videos" (no "Shorts"), URL `youtube.com/watch?v=…`, sin
`#Shorts` en etiquetas ni descripción, categoría Educación, descripción con los capítulos que dejó el diario, y sube la
miniatura `<id>-mini.png` por el input de archivo del bloque Miniatura del diálogo (mejor esfuerzo: si Studio no lo
permite —canal sin verificación por teléfono— avisa, sigue y anota `notaMiniatura` en la bandeja). Mantiene la rutina
"Select a channel" con `NR_CANAL_NOMBRE`. **Sin probar aún contra el piloto real** (selectores de la miniatura incluidos).
Queda a mano en Studio tras subir un largo: pausas publicitarias en cada límite de capítulo (justo después del
`reenganche`), pantalla final de 20 s, comentario fijado con la pregunta de `siguiente`.

## Variables de entorno
| Variable | Para qué | Por defecto |
|---|---|---|
| `NR_CANAL_ID` | id `UC…` de @enumerosrojos: subir-studio y metricas no corren sin él (nunca otro canal por error) | — (obligatoria) |
| `NR_CANAL_NOMBRE` | nombre visible para "Select a channel" | `En Números Rojos` |
| `NR_RENDER_MAX_MIN` / `NR_RENDER_LARGO_MAX_MIN` | tope de render Short / largo | 90 / 240 |
| `NR_MEMORIA_MIN_MB` · `NR_CONCURRENCIA` · `NR_LOCK_RENDER` | RAM mínima · concurrency · lock compartido | 1500 · 1 · `/tmp/bolita-render.lock` |
| `NR_NUBE=1` · `NR_ARTEFACTO` | producción en la nube (no configurada) | — |
| `PILOTO_URL` | piloto de Bolita Lab | `http://127.0.0.1:8777` |

## Calendario (`contenido/calendario.json`)
Shorts: `ranuras` 13:00 todos los días, `rotacion: ["grafico"]`, `minimoBandeja: 3`. Largos: `ranurasLargo` lunes,
miércoles y viernes 19:00, `rotacionLargo: ["tesis"]`, `minimoBandejaLargos: 2`. `minimoBacklog: 8` (suma de ambos),
`margenMinutos: 20`. `siguienteRanura(…, tipo)` y `ordenarParaPublicar(…, tipo)` separan los dos tipos.

## Hito del miércoles: semana asegurada (orden de Santiago, 2026-11-08)
El cupo semanal del Max se renueva los **miércoles**. Cada miércoles en la noche quedan escritos, verificados y dirigidos los guiones de
TODAS las ranuras **jueves → miércoles siguiente**, arrancan los renders (local en serie con el lock; nube donde exista) y el **jueves**
todo está `programado` en Studio con su fecha (tope jue 23:59; resto el viernes con ≥ 72 h de colchón). Solo después el cupo sobrante va a
mejoras o canales nuevos. El bloque "Hito del mié AAAA-MM-DD" arriba de `docs/PLAN-SEMANAL.md` lleva la cuenta; `estado.mts` avisa
"⚠ hito del miércoles" si quedan ranuras sin programar antes del próximo miércoles. Regla: skill `plan-semanal` §5b y `operacion-diaria` §0.

## Cron
`scripts/cron.txt`: diario **00:30** (no 01:15: un Short + un largo ≈ 2 h 20 min y Bolita Lab toma el lock a las 03:30),
estado + métricas **08:30** (después de Bolita 08:00 y Línea Punteada 08:15, por el piloto único), refresco de datos
domingo 23:30. Lo instala Santiago con `crontab -e`, cambiando `UC8uOwislkGbnnfoqsJ_FgAw` por el id del canal.

## Lo que exige a Santiago
1. `NR_CANAL_ID` (Studio → Configuración → Canal → Configuración avanzada) y audiencia "No es para niños" en el canal.
2. Instalar las líneas de `scripts/cron.txt` (consentimiento suyo).
3. Token OAuth propio del canal: `npx tsx scripts/subir.mts autorizar` eligiendo En Números Rojos (mismo proyecto de
   Google Cloud que Bolita Lab; `secrets/youtube-client.json` se copia de allí). Mientras la API no esté auditada, se sube
   por Studio con el piloto.
4. Verificación por teléfono de la cuenta si Studio no deja subir miniaturas personalizadas.

## Métricas diarias (`salida/metricas/AAAA-MM-DD/`)
Skill global `metricas-diarias`. A las 08:30 `estado.mts` llama a `scripts/metricas.mts` (sin línea propia en el cron): 4
capturas de Studio (`1-overview`, `2-monetizacion`, `3-alcance`, `4-contenido` .png + .txt) y `metricas.json` (subs, vistas
por video con curl público, `vistasLargos` y `vistasShorts` por separado —horas del YPP vs embudo—, progreso al YPP leído de
Studio). Material del video "camino a la monetización": **no se borra nunca** y se commitea (`fallo-*.png` no). Requiere el
piloto en :8777; antes de capturar asegura el canal con la misma rutina de `subir-studio.mjs` ("Select a channel" → clic en
`NR_CANAL_NOMBRE`, más "Switch account" si sale "Oops, no permission"). Sin `NR_CANAL_ID` no mide nada (sale con aviso).
El cambio de canal es de toda la sesión del piloto: quien lo use después debe re-asegurar el suyo (subir-studio ya lo hace).
