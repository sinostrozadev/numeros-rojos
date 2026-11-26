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
