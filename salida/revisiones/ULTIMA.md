# Revisión 2026-11-26 — largo candidato a viral (Haití vs República Dominicana)

## Detectado
- Ingeniería inversa de 9 canales nuevos de solo largos (`/home/santiago/projects/yt/_propuestas/2026-11-26-viral-numeros-rojos.md` §1): 7 de 9
  sacaron ≥ 90 K en su PRIMER largo; ninguno tiene Shorts; 25 de 30 miniaturas son "dos lados enfrentados" con 1–3 palabras, sin caras, fotos,
  gráficos ni marca; 90–95 % del tiempo es mapa animado; Fortune of Nations ES es la traducción de un canal en inglés ya probado; la ola de clones
  (≥ 30 canales) ya decae. NR: 17 Shorts (mediana 169) y 7 largos (mediana 48).
- El lector "detector de IA" le puso 5/10 a la primera versión del guion: "no es X, es Y", tríadas, remates-aforismo, "sospechosos", primera
  persona impostada. Lista de 10 tics en el documento §2.3.
- El verificador numérico atrapó un conteo mío mal hecho (34 por 35 años de caída en Haití) y una palabra vetada ("vende").
- `producir.yml` pisaba el json de bandeja con el guion (mismo nombre en el artifact).

## Mejorado
- Plantilla `tesis` v4, compatible hacia atrás: escenas `relato`, `gancho.visuales` (imagen a sangre desde el frame 0, sin tarjeta de título),
  `promesaVisual`, foto con `archivo` exacto de Commons y `sangrado`, descarga a 1920 px.
- Guion reescrito en dos rondas: revisor del canal 3,57 → 4,0 (4,14 con los 4 cambios finales, aplicados); detector de IA 5/10 → 7/10.
- `producir.yml`: el guion va al artifact como `<id>.guion.json` + `plan.json`.

## Herramientas exploradas
- Render del largo en la nube: 19 min para 11:30 de video (el local habría esperado el lock compartido).
- Qwen3-TTS VoiceDesign para una voz diseñada de narrador: 4 candidatas medidas contra Edge (WER, deriva y variación del tono, pausas, seseo
  acústico, MOS estimado con torchaudio SQUIM). No es claramente mejor: deriva de tono 10–26 % entre frases. Clips en Downloads para el oído de Santiago.
- Verificación de hechos con web por un agente aparte (24 afirmaciones; 9 obligaron a cambiar el texto).

## Agregado
- Gráfico `anios` ("años en rojo": un cuadro por año, rojo si el valor cae) y operación de cifra `cuenta` en `verificar-cifras`.
- Largo "Haití era más rico que República Dominicana. ¿Qué pasó?" (11:30) y Short tráiler (41 s), renderizados; guiones en `contenido/guiones/2026-11-26-*`,
  fuentes del guion en `contenido/fuentes-guion/`, veredicto del revisor en `salida/revisiones/guiones/`.
- Pedidos de carátula "una isla partida" (A y B) en `salida/caratulas/pedidos/`.

## Pendiente
- Carátula GPT: el pedido A no llegó en 3,5 h; reintentar (`gh run list -R sinostrozadev/entender-chile -w "Pedido a GPT"`), mirarla y ponerla con
  `herramientas/navegador/miniatura-studio.mjs`. No publicar con la miniatura de Remotion.
- Tráiler subido privado (`EPyqg1wKfSc`). Largo (`…-3.mp4`, run `45875686447`) SIN subir: Studio dio "Oops, you don't have permission" 3 veces; reintentar `bash salida/tmp/subir-haiti.sh`.
- Santiago: ver el largo entero, oír los 3 clips de voz, decidir canal (NR o canal nuevo de solo largos) y fecha.
- Integrar `lab/voces/narrar.py` al pipeline si elige la voz diseñada; portar `videos.mts` de Línea Punteada; llevar la lista de tics al validador del generador.


# Revisión 2026-11-26 (2.ª parte, noche 26→27) — hito del jueves: semana 30-11 → 06-12

## Detectado
- El generador perdía guiones enteros (20 min de Opus cada uno) por un solo error mecánico: 5 largos rechazados seguidos por palabras de
  "consejo" (comprar/compra), "dice llega tarde" (pantalla apagada antes de una foto), fotos fijas de 12 s y pares paralelos sin iconos.
- El revisor independiente rechazó 5 de 9 guiones en ronda 1 y en todos tenía razón: "ningún país de habla hispana" (España es más alta),
  "Chile se sigue acercando a Portugal" (la brecha se reabre desde 2013), "ingreso" donde el dato es producción, la convertibilidad 1991 con
  "cada peso vale un dólar" (eso es 1992), el BCRP "empieza a anunciar metas" en 2002 (anunciaba desde 1994), deflactor contra IPC en 2021–22,
  y un tráiler con frases calcadas del largo (B7). `verificar-cifras` dio verde en todos: la máquina no ve afirmaciones sin número.
- El esquema limita un ranking a 8 países: "ninguno de los 17 le gana" no se puede declarar; se comprobó a mano.
- Hoja de contacto del Short Portugal: el gráfico del giro invertía los colores (Portugal dorado) contra la voz ("la línea dorada es Chile").
- Studio: "Switch account" volvió a fallar (piloto en otro canal); entrar por la raíz de Studio bajo el lock lo arregló. Singapur quedó sin
  publishAt tras "timeout esperando subida completa" (el Draft silencioso de siempre).

## Mejorado
- Short Portugal re-renderizado con Chile dorado en todos los gráficos y anotación sin el año repetido.
- Largo Perú–Argentina: comparación larga con el deflactor para los dos países; 2021–2024 con el IPC (existe para Argentina solo desde 2018)
  y la voz dice cuándo cambia de medida; hechos de 1985, 1991–92, 1993 y 2002 confirmados con web en la ronda 2.

## Herramientas exploradas
- Revisor independiente como subagente Opus con brief fijo (`salida/tmp/brief-revisor.md`): 11 rondas en la noche, ~1,5–3 min cada una.
- ffmpeg del compositor de Remotion (`node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`, con `LD_LIBRARY_PATH`) para sacar un cuadro
  del mp4 cuando la hoja de contacto capta una animación a medias (la máquina no tiene ffmpeg).

## Agregado
- `scripts/generar-guiones.mts`: el borrador rechazado se guarda en `contenido/reserva/rechazado-<id>-i<n>.json` para repararlo a mano.
- 7 guiones aprobados (5 Shorts DATO, largo y tráiler del jue 03-12) y los 7 programados y verificados por API: Shorts `3vTK9EZLDlY` (01-12),
  `DzmImUcyySs` (02-12), `Lhk4vEHPttE` (03-12, tráiler), `aLEBv-UO1JE` (04-12), `zWQmrZk0pCY` (05-12), `cICCR3RUX6c` (06-12); largo `GPI5h-uw66M` (03-12 19:00,
  carátula GPT). Dos quedaron sin fecha tras Studio (Singapur y el largo) y se arreglaron con `reprogramar.mts --aplicar`.
- Respaldo del lun 30-11 "¿Por qué Uruguay se hizo rico y Paraguay no?": ronda 2 no aprobada (4,29, Verdad 4 por "Paraguay nunca había llegado
  a esos niveles": llegó a ~117 % en 1952). Frase corregida ("desde 1960"); queda en `contenido/reserva/` y necesita ronda 3 antes de producirse.
- Carátulas GPT: Haití (`salida/caratulas/haiti-rd-a.png`, llegó el 26-11 18:08, revisada; puesta en `miniatura` de su json de bandeja) y
  Perú–Argentina (`salida/caratulas/peru-argentina.png`, pedida 21:06, llegó en < 5 min, revisada).

## Pendiente
- Santiago: Haití en NR (lun 30-11 19:00 + tráiler 13:00) o en un canal nuevo. Si no lo aprueba, el lunes sale el respaldo Uruguay–Paraguay.
- Si Santiago no aprueba Haití para el lun 30-11: ronda 3 del revisor al respaldo, render en la nube (~16 min), su tráiler y programar antes del lun 13:00.
- A mano en Studio (largo 03-12): pausas publicitarias, pantalla final, comentario fijado.
- Related video del tráiler → largo y comentario fijado, el día de salida.
- Haití: un único intento de `subir-haiti.sh` (piloto en NR, 27-11 02:09) subió el mp4 y la carátula GPT pero se cortó en "timeout esperando botón Next": quedó **privado sin fecha `l-hAd_pfL_Q`** con el título del archivo ("2026 11 26 tesis haiti republica dominicana 3"). No se insistió. NO volver a subirlo: completar ese borrador (título, descripción, capítulos) con `RETOMAR=1`/`BORRADOR=1` de `subir-studio.mjs` o `scripts/titulo.mts` cuando Santiago decida.
