# Revisión 2026-11-07 — En Números Rojos (sesión de madrugada, v2 visual)

## Detectado
- Santiago, al ver los primeros largos (Chile-Corea, Argentina, Irlanda): "no estás aprovechando todas las herramientas"; los temas hablan de lugares e historias y solo había gráficos. Medido en las hojas de contacto: 0 fotos, 0 mapas, 0 iconos en 10 min de video; solo gráficos y citas.
- En la primera subida real de largos (11-06): el piloto quedaba en otro canal de la cuenta (métricas de Línea Punteada) y Studio mostraba "no tienes permiso" con nuestro id en la URL; la miniatura personalizada no se aplica porque el canal no tiene verificación por teléfono.
- Hojas v2: lista de iconos en pantalla completa deja la mitad derecha vacía 30–40 s; título del gráfico cortado con "…" en disposición dividida; bocadillo de la mascota poco legible en un fotograma de Argentina.
- (09:00) Los Shorts del generador duraban 57–67 s con 113 palabras "crudas": la voz lee los números expandidos ("1990" = tres
  palabras, "%" = dos). El tope de 150 palabras del contrato no predecía la duración.
- (09:08) Las poses de GPT recortadas con ffmpeg traían el fondo de la hoja y el rótulo de la pose: se veía un cuadrado y el texto.
- `subir-studio.mjs` exige `NR_CANAL_ID`: lanzado desde un script propio sin `source secrets/canal.env` falla al instante.
- **(noche) Revisión de Santiago del largo Chile-Corea v2 (5 capturas):** tarjetas de título y capítulo de 0,9–1,0 s (ilegibles), foto de
  Seúl 26 s fija durante una enumeración, tarjeta de espera de 17 s antes del gráfico de las dos familias (gráfico sin relación con el
  ejemplo), texto flash de 0,6 s en 4:49, "apuesta obvia" y "4 veces" sin visual, el remate termina y entra "siguiente" sin marcar el cierre,
  poco uso del mapa. El validador nuevo `problemasDeRitmo` reproduce 13 de esos errores sobre la v2: la revisión manual era el eslabón débil.

## Mejorado
- Contrato de guion v2 (`src/plantillas/comun/visual.ts`): cada escena puede llevar foto de Commons (licencia PD/CC0/CC BY/CC BY-SA, crédito en pantalla y descripción), mapa (Natural Earth, países destacados, flechas), lista de iconos, ilustración plana por GPT y mascota con bocadillo; regla: ≥ 5 visuales de ≥ 2 tipos por largo, datos siempre en gráfico.
- Plantilla `tesis` v2 con disposición completo/dividido; fotos resueltas y descargadas por `scripts/lib/imagenes.mts` (port de Línea Punteada); créditos automáticos en la descripción.
- Tres largos redirigidos a v2 con 15 fotos de Commons verificadas, mapas e iconos; Chile-Corea v2 (dom 19:00, `eTq0TBuEWIs`) y Argentina v2 (lun 19:00, `b1F1JlfZwIw`) ya reemplazan a las v1 en Studio (v1 en privado); Irlanda v2 se renderiza a las 07:20 y se reemplaza a las 09:35.
- `subir-studio.mjs`: cambia de canal solo ante "no tienes permiso", verifica por nombre del canal, fallback de descripción; `reemplazar-largo.sh` para sustituir un largo programado.
- Miniatura de Remotion remaquetada (4 marcas en el eje X, 180 px para etiquetas, sin leyenda en ranking).
- Contrato del Short: `contarPalabrasHabladas` (dígitos = 3, "%" = 2) y tope 85–120 habladas; `docs/GUION.md` §4 con la medida
  (≈ 0,40 s/palabra). Los dos Shorts nuevos quedaron en 49,4 s y 48,5 s.
- `scripts/mascota.mts recortar` por Chromium (canvas): fondo transparente, sin rótulo, lienzo ajustado. Fotogramas reales con la
  ardilla en `salida/pruebas/mascota-real-{7100,9040,14600}.png`.
- Irlanda v2 (fotos de Dublín, iconos, mapa LatAm, mascota) reemplazó a la v1 en Studio sin perder la ranura (hoja:
  `salida/pruebas/v2-irlanda-hoja.jpg`).
- **(noche) Plantilla `tesis` v3 (3 agentes Opus en paralelo, archivos repartidos):** tarjetas con tiempo de lectura (≥ 2,5 s + 0,3 s/palabra),
  rótulo de capítulo "02 · …" 3 s, pantalla `versus` (dos columnas con bandera, ✗/✓ y ficha "apuesta" animada), `sellos` ("3 A 1", "4×", "9 DE 10",
  "CASI 1/4") con bandera y ánimo, `marca` ✗/✓ en iconos, `viaje` de mapa entre países (3 s, línea punteada dorada; solo en cambios grandes de
  protagonista, 2 por video), fundido a negro + rótulo "PRÓXIMO VIDEO" al final, cierre sonoro suave si el remate se funde. Guion v3 con la misma
  voz palabra por palabra y 20 escenas con visual (antes 9). Subido PRIVADO (`bBeAk-psx5c`, título con sufijo "PRUEBA V3") para que Santiago lo compare con la v2 programada (intacta).

## Herramientas exploradas
- Wikimedia Commons por API (adoptada; la búsqueda es literal: términos concretos en inglés + época, 2 alternativas por foto).
- d3-geo + world-atlas (ya instalados) para el mapa de países con flechas de comercio (adoptado; sin raster ni calles).
- GPT por el canal de pedidos de Entender Chile: carátula del largo en 4 min (adoptada; variante 2 elegida) y hoja de poses de la mascota (pedido a las 09:00; 1 pedido/día).
- Generador `claude -p --model opus`: un largo v2 válido a la primera en 7 min 18 s (adoptado como modelo por defecto).
- Hoja de poses (sprite sheet 3×2) por GPT: 4 min, personaje consistente en las 6 celdas → la forma correcta de pedir un personaje.
- Chromium headless + canvas como procesador de imágenes (no hay sharp/PIL y el ffmpeg de Remotion no trae rawvideo): recorte,
  chroma por relleno desde los bordes, medición de píxeles. Gotcha: el código va como string (tsx inyecta `__name`).

## Agregado
- Skills: `navegador-piloto` (cambio de canal, reemplazo de video programado, miniatura y teléfono), `videos-largos` (modelo vivo de subida de largos y v2 visual), `herramientas-disponibles` §1d (visuales del largo de datos), `incidentes-canal` §6.
- Docs: `docs/GUION.md` §7b dirección visual, `docs/MASCOTA.md`, `docs/CONVENCIONES.md` (licencias de fotos), `src/plantillas/tesis/README.md`.
- Scripts: `scripts/lib/imagenes.mts`, `scripts/mascota.mts` (pedir/esperar/recortar), `herramientas/navegador/reemplazar-largo.sh`.
- Guion nuevo generado para el vie 11-13: "Uruguay produce 46 % más que Chile. Con precios, empatan" (pendiente de revisor independiente).
- Shorts programados: jue 11-12 13:00 "México gastaba el doble que Chile" `k8gTTX8R9Ao`; dom 11-15 13:00 "Bolivia tenía 15.000 millones
  en reservas" `fHVOchMTSE0`. Largo mié 11-11 ahora `m_Lp1dgEsvA` (v2). 9 de 13 ranuras programadas.
- `public/mascota/<pose>.png` (6 poses reales, transparentes) + `hoja.png`; `docs/MASCOTA.md` estado 09:15; `docs/DECISIONES.md`.
- Skills: `guiones-de-video` (palabras habladas), `caratulas-con-gpt` (hoja de poses verificada), `herramientas-disponibles`
  (Chromium como procesador de imágenes, mascota en uso), `navegador-piloto` (`NR_CANAL_ID`, cadena del piloto entre 3 canales).
- **(noche) Validador de ritmo** `problemasDeRitmo(plan, guion)` en `src/plantillas/tesis/plan.ts`: errores (espera > 3 s sin visual, foto o
  ilustración fija > 12 s, cita > 12 s, gráfico estático > 20 s, > 3 s atenuado antes de un visual completo tardío) y avisos (enumeración sin
  iconos, > 2 viajes, sello sin palabra). `preparar-tesis.mts` corta con error (salvo `--permitir-ritmo`). `subir-studio.mjs` con
  `NR_VISIBILIDAD=privado`. Composición `PruebaVisuales` (carpeta Pruebas) para ver versus/sello/viaje sin render completo.
- **(noche) `subir-studio.mjs`:** `RETOMAR=1` (retoma un diálogo de subida abierto desde Visibility si falló un paso tardío), categoría tolerante (Studio
  recuerda "Education" y ya no muestra "People & Blogs"), y título con sufijo "· PRUEBA vN" en modo privado para que el anti-duplicados por título no lo
  confunda con la versión programada.
## Pendiente
- Verificación por teléfono del canal (Santiago) para poner las miniaturas (Remotion o GPT) a los 3 largos.
- Mascota: aprobación de identidad por Santiago con los fotogramas reales; si aprueba, re-render de los 3 largos con las poses PNG (hoy llevan el SVG de reserva).
- Ilustraciones planas por GPT para las escenas que hoy caen al gráfico previo (1 pedido/día).
- Pulido en curso: iconos centrados en pantalla completa, título del gráfico en 2 líneas en dividido, bocadillo legible.
- Backlog: faltan Short mar 11-10 (IPC Chile, sale tras el dato del 11-06… verificar) y vie 11-13 (INDEC 11-12), largo vie 11-13 (Uruguay: revisor Opus en curso) y Short sáb 11-14; el Short `grafico` aún no usa visuales.
- **(noche)** Veredicto de Santiago sobre el v3 privado → si aprueba: reemplazar `eTq0TBuEWIs` con `reemplazar-largo.sh`, regenerar Argentina e
  Irlanda con la v3, y volcar las reglas al generador (`docs/GUION.md` §7b/§11 + `generar-guiones.mts`, en curso). Revisor Opus del guion y
  control visual post-render (fotogramas → Opus) siguen propuestos, no construidos.
