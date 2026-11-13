- 2026-11-05: propuesta aprobada por Santiago ('dale con todo'); nombre En Números Rojos (@enumerosrojos) decidido por Claude con autoridad delegada. Repo clonado de linea-punteada; contrato tesis/grafico en comun/guion.ts; fuentes de datos limitadas a WDI/OWID/manual-oficial (FMI fuera).
- 2026-11-05 (docs/marca): meta YPP por la ruta de horas (8.000 h ≈ 120.000 vistas de largos; base marzo–abril 2027, límite interno 2027-04-30); métrica que manda = mediana de vistas de largos a 7 d (apoyo: minutos/día, retención > 40 %, subs/día, CTR > 4 %). `docs/ESTRATEGIA.md`.
- 2026-11-05 (docs/marca): tope de 1 Short/día hasta el YPP (luego 3/semana) por el efecto medido por AIR de los Shorts sobre el RPM de largos; doblaje automático a inglés activo desde el día 1.
- 2026-11-05 (docs/marca): hipótesis H1–H5 abiertas (comparación de 2 países ≥ 2× mediana; LatAm > global; voz Jorge vs Lorenzo; doblaje EN ≥ 15 %; Short derivado ≥ 10 % de las vistas del largo) con criterio de falsación en ESTRATEGIA §8.
- 2026-11-05 (docs/marca): criterio de cierre fijado: 2027-05-31, mediana < 3.000 vistas/largo a 7 d y sin YPP proyectado antes del 2027-11-30.
- 2026-11-05 (docs/marca): canal-meta Los Ecomonos (video-meta "Comprar Coche vs Leasing, explicado con plátanos", 1,35 M); apoyo VisualEconomik y How Money Works. Diferencia defendida: datos primarios y fuente en pantalla, sin catastrofismo, mirada LatAm, sin personaje. `docs/META-REFERENTE.md`.
- 2026-11-05 (docs/marca): identidad visual: isotipo = línea de datos que sube en verde y cae en rojo hasta un punto rojo sobre grafito; banner 2560×1440 con zona segura; marca de agua "En Números Rojos" transparente. `marca-canal/` (generado con Playwright del navegador de bolita-lab, sin instalar nada). `src/marca/Logo.tsx` aún dibuja el isotipo de Línea Punteada: debe adoptar `marca-canal/logo.svg`.
- 2026-11-05 (docs/marca): plan semanal con las fechas reales del calendario (11-08 es domingo y 11-09 lunes): primer largo dom 11-08 19:00 (excepción), ranuras normales desde lun 11-09; largos de la semana siguiente: Argentina (lun), Uruguay (mié, tercer largo), Irlanda/PIB vs INB (vie, primer tema global para H2). Contingencias: IPC Chile oct (INE, 11-06) → Short mar 11-10; IPC Argentina oct (INDEC, jue 11-12) → Short vie 11-13.
- 2026-11-05 23:45: canal creado por Claude con el piloto (id UC8uOwislkGbnnfoqsJ_FgAw, @enumerosrojos); banner, foto, marca de agua, descripción, país Chile y 15 palabras clave publicados. Queda COPPA para Santiago.
- 2026-11-06 09:10: LANZAMIENTO PROGRAMADO. 7 videos renderizados (2 Shorts ~3 min y largos ~20 min de render cada uno) y programados por el piloto en Studio: Short sáb 11-07 13:00, largo dom 11-08 19:00, y las ranuras del dom 11-08, lun 11-09 (×2) y mié 11-11 (×2). Arreglos de la primera subida real: (1) `subir-studio.mjs` ahora detecta la página "Oops, you don't have permission" (la sesión del piloto estaba en otro canal de la cuenta tras las métricas de Línea Punteada) y cambia de canal por "Switch account" → youtube.com/account; la verificación exige el nombre del canal en la barra lateral, no solo el id en la URL; (2) descripción con fallback /eval + /tipear; (3) `tieneComposicion` buscaba la Miniatura solo en Root.tsx → el largo salía sin miniatura. Miniatura remaquetada (modo largo, 4 marcas en X, 180 px para etiquetas; sin leyenda en ranking). BLOQUEO: Studio exige verificación por teléfono para miniaturas personalizadas en este canal (pedido a Santiago, docs/SANTIAGO.md f); los 3 largos van con fotograma automático hasta entonces. Pendiente del largo en Studio (a mano): pausas publicitarias en los límites de capítulo (irrelevante hasta el YPP), pantalla final y comentario fijado.
- 2026-11-06 09:20: primera carátula hecha con GPT (skill `caratulas-con-gpt`, pedida vía la sesión de Línea Punteada; pedido → PNG en 4 min): `salida/caratulas/chile-corea-2.png` elegida para el largo Chile-Corea (texto más grande y sin ejes: lee mejor a 160 px que la miniatura de Remotion). Se pone cuando Santiago verifique el teléfono; luego A/B con la de Remotion (`salida/bandeja/2026-11-06-tesis-chile-corea-mini.png`) en "Probar y comparar". Para los otros largos, pedir carátula GPT el mismo día del render.
- 2026-11-07 (docs/marca): mascota en PROTOTIPO, pendiente de que Santiago apruebe la identidad: ardilla dorada con bufanda roja (ficha en docs/MASCOTA.md), hoja de 6 poses pedida a GPT (`scripts/mascota.mts pedir`), recorte a `public/mascota/<pose>.png`; SVG de reserva en `public/mascota/reserva/`. No aparece en producción hasta el visto bueno.
- 2026-11-07 04:10: **v2 visual del largo** (pedido de Santiago: "no estás aprovechando todas las herramientas"). Contrato con `visual` (foto Commons, mapa, iconos, ilustración) + `mascota` por escena; plantilla y pipeline hechos en una noche por 3 agentes; Chile-Corea v2 renderizado (25 min) y programado en la misma ranura (dom 11-08 19:00, `eTq0TBuEWIs`); la v1 `vQT5ObEGz5U` quedó privada con título "(versión anterior)". Argentina v2 y Irlanda v2 se reemplazan igual (lun y mié). Mascota "Nuez" (ardilla, bufanda roja) en prototipo con SVG de reserva; poses por GPT pedidas el 11-07 09:00. Pendiente: título del gráfico se corta en disposición dividida; lista de iconos deja medio cuadro vacío (usar dividido con el gráfico previo); ilustraciones por GPT (1 pedido/día) → mientras, caen al gráfico previo.


## 2026-11-07 (mañana) — tope del Short en palabras HABLADAS, mascota real, 2 Shorts más programados
- **Hecho:** los dos primeros Shorts generados por `generar-guiones.mts` (113 palabras crudas) duraron 67 s y luego 57–59 s: la voz lee
  "1990" como tres palabras y "%" como dos. **Decisión:** el contrato cuenta palabras habladas (`contarPalabrasHabladas`: token con
  dígitos = 3, "%" = 2) y el tope pasa a 85–120 habladas (≈ 0,40 s/palabra → ≤ 50 s). Con eso los dos quedaron en 49,4 s y 48,5 s a la
  primera. `docs/GUION.md` §4 lo explica al generador. Idea de la casa (años de sueldo) a la cola: no hay dataset con licencia.
- **Mascota:** hoja de poses de GPT en 4 min, 6 poses consistentes; `scripts/mascota.mts recortar` ahora usa Chromium (canvas) para dejar
  fondo transparente y sin rótulo. Entra en los renders nuevos; los 3 largos subidos llevan el SVG de reserva. La identidad la decide
  Santiago con `salida/pruebas/mascota-real-*.png`.
- **Studio:** Irlanda v2 reemplaza a la v1 (mié 11-11 19:00, `m_Lp1dgEsvA`; v1 privada). Shorts jue 11-12 `k8gTTX8R9Ao` (México-Chile
  consumo) y dom 11-15 `fHVOchMTSE0` (reservas de Bolivia) programados. Cadena del piloto con LP y Bolita por mensajes "PILOTO LIBRE".

## 2026-11-07 (noche) — ritmo medible: nada fijo ni vacío en pantalla, y la revisión deja de ser manual
- **Qué pasó:** Santiago vio el largo Chile-Corea v2 y marcó tarjetas ilegibles (1 s), una foto fija 26 s, una espera de 17 s antes de un
  gráfico, un texto flash y un cierre sin marcar. Todo coincidía con lo que un validador de tiempos habría detectado sin mirar el video.
- **Decisión:** las reglas de ritmo viven en código, no en la revisión. `problemasDeRitmo` bloquea en `preparar-tesis` (umbrales: espera ≤ 3 s,
  nada fijo > 12 s, gráfico estático ≤ 20 s, tarjetas ≥ 2,5 s + 0,3 s/palabra). Las enumeraciones habladas van a `iconos` o `versus` con ✗/✓, las
  cifras fuertes a `sellos`, los cambios grandes de país a `viaje` de mapa (≤ 2 por video), y el remate se funde a negro antes de "siguiente".
- **Cómo se prueba:** Chile-Corea v3 (misma voz, dirección visual nueva) subido PRIVADO para que Santiago lo compare con la v2 programada
  (dom 11-08 19:00, intacta). Si aprueba, las reglas pasan al generador y a los largos de Argentina e Irlanda.

## 2026-11-07 (noche, 2.ª ronda) — lo que Santiago vio en el v3 privado
- **Cifras:** es-MX lee "1.000" como "uno punto cero cero cero" (en México el punto es decimal). Toda cifra con separador de miles
  o decimal con coma va al servicio en palabras (`textoParaVoz` en `scripts/voz.mts`); los subtítulos siguen mostrando la cifra.
- **Preguntas planas:** medido con Jorge, las preguntas con "qué/cómo" bajan el tono al final como una afirmación (f0 final/cuerpo ≈ 0,8)
  y el servicio rechaza todo SSML. Decisión: la frase que termina en "?" se sintetiza aparte con tono +10 % y ritmo −3 %
  (`PROSODIA_PREGUNTA`). Voces que sí suben al final en la misma frase: es-CO-Gonzalo (1,13), es-AR-Tomás casi plano (0,94);
  cambiar de voz es identidad del canal → lo decide Santiago.
- **Parpadeo de tarjetas:** la tarjeta de capítulo aclaraba su fondo en los últimos 7 frames y dejaba ver el gráfico anterior
  apagado. Ahora tarjeta de título y de capítulo cortan limpio; la escena nueva entra con su animación.
- **Viaje de mapa sin línea:** el vuelo de cámara basta; la línea punteada parecía explicar un trayecto.
- **Primer gráfico:** el título dice la variable ("PIB por persona en 1960") y la etiqueta la explica en lenguaje llano.

- **2026-11-12 · Render en la nube (GitHub Actions):** `.github/workflows/producir.yml` (solo `workflow_dispatch`, sin secretos ni commits del bot) renderiza Shorts `grafico` (2,5 min) y largos `tesis` (12 min) y entrega el mp4 como artifact de 14 días; la subida sigue local hasta la auditoría de la API. Ver docs/OPERACION.md § "Producción en la nube".
