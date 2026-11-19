# Revisión 2026-11-18 (noche) — En Números Rojos (aplicar el diagnóstico de virales)

## Detectado
- Tres canales nacidos en octubre de 2026 con **exactamente nuestro formato largo** crecen: Fortune of Nations en Español (mediana
  71 K), Borderline Billions (41 K), Curiosito (13 K; "¿Por qué Argentina dejó de ser potencia?" 347 K = nuestro Argentina de 21
  vistas). Ninguno sube Shorts. Diagnóstico completo: `/home/santiago/projects/yt/_propuestas/2026-11-18-diagnostico-virales.md` §4.
- Nuestros Shorts: mediana 166 vistas, 31–39 % "se queda" aun con cold open (2 rediseños). Largos: CTR 1,0–3,2 % con títulos de cifra
  técnica; Panamá (pantalla partida A | B) 6,5 %. Chile-Corea: 56 % sigue a los 30 s.
- **Visual a los 3 s** (fotogramas en `lab/diagnostico-2026-11-18/tr/`): Fortune = archivo sepia de Buenos Aires 1913 a sangre;
  Curiosito = mapa de época ilustrado con íconos, un personaje y la etiqueta "PARÍS hacia 1910"; chilenómetro = valle en 3D con "AÑO
  1540"; Batallas en el Mapa = campo de batalla en 3D. Nosotros = gráfico de barras vacío con "PIB por persona (Maddison, US$
  internacionales de 2011)" y la línea de fuente.

## Mejorado
- **Canal solo de largos desde el lun 23-11** (lun y jue 19:00): `calendario.json` `shortsActivos: false`; `diario.mts` no renderiza ni
  genera Shorts (salvo `--n`), `estado.mts` deja de pedirlos. Corte del 07-12 reescrito en largos (ESTRATEGIA §00).
- **Arranque con escena** (GUION §3b) con validador `chequeosArranqueLargo` en `generar-guiones` (gancho sin gráfico, con año y lugar;
  sin PIB/per cápita/Maddison/capítulos/gráficos/fuentes en los primeros 30 s).
- **Molde de título y carátula** (GUION §10b, `docs/PEDIDO-CARATULA-MOLDE.md`).
- **5 largos retitulados al molde por API** (tabla con títulos anteriores en `docs/DECISIONES.md`): Venezuela `PpkBOxDMuLg`, Irlanda
  `3m2VqXoQIO0`, Argentina `BQNaK5R-yrk`, Uruguay `JBZm6fouVPM`, México `419I0beU4SA`.
- Reparto con Entender Chile: NR = comparaciones entre países; EC = solo Chile (GUION §1).

- **Contingencia GTA 6** (excepción puntual a "solo largos", pedida por la sesión principal): Short "¿Cuántas horas de sueldo mínimo
  cuesta GTA 6 en tu país?" (España 10 h · EE. UU. 11 · Chile 25 · México 33 · Colombia 35 · Argentina 59), precios leídos de la Xbox
  Store el 18-11, `verificar-cifras` ✓, render en GitHub Actions (2,5 min, run 44450277857), subido por Studio bajo `piloto.lock`:
  `AgGIMWE67oI`, **publishAt 2026-11-20T16:00Z = vie 20-11 13:00** verificado por API. El Short Corea `7z5bMWnsmH0` pasó al mar 24-11 13:00.

## Herramientas exploradas
- YouTube Data API `videos.update` (snippet) y `status.publishAt` con el token nuevo del canal (sin piloto): retitular y reprogramar.
  Gotcha: la lectura tarda ~10–20 s en reflejar el cambio (los scripts reintentan).
- Precios de la Xbox Store leídos del JSON embebido en xbox.com/<locale>/games/store/… (`productSummaries`/`specificPrices`): sirve para
  verificar precios oficiales sin piloto (la PS Store carga con JavaScript y no se lee con curl).

## Agregado
- `scripts/titulo.mts` (cambia solo el título, conserva el snippet, verifica canal), `scripts/reprogramar.mts` (publishAt de un video
  privado), `scripts/miniatura.mts` (copiado de LP), `docs/PEDIDO-CARATULA-MOLDE.md`.
- Plan del hito del jue 19-11 (semana 23→29) con el molde: jue 26 "¿Por qué Nueva Zelanda se hizo rica y Chile no?" (sobre el
  outlier de Fortune) y "GTA 6 en números" solo si Take-Two publica cifras oficiales.

## Pendiente
- ⚠ Error propio: corrí `scripts/estado.mts` sin `--sin-metricas` y lanzó `metricas.mts`, que usó el piloto ~1 min (03:05 UTC) **sin**
  `flock /tmp/piloto.lock` (verificó el canal NR; capturas en `salida/metricas/2026-11-19/`). Para revisar el plan: `estado.mts --sin-metricas`.
  Propuesta: que `metricas.mts` tome el lock él mismo.
- Render local del GTA quedó en cola >20 min detrás de Bolita/Blender/serie: para un Short urgente, `producir.yml` en Actions es más rápido.
- Plantilla `tesis`: soportar `gancho.visual` (foto de archivo a sangre en el frame 0) antes del render del jue 26.
- Medir el 25-11 el CTR de los 5 retitulados (Studio, 7 días) y la carátula molde de Argentina.
