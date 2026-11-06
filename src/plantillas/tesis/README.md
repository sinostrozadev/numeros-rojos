# Plantilla `tesis` — largo 16:9 (1920×1080, 30 fps, 9–12 min)

El producto del canal: UNA pregunta, UNA tesis, 3–5 capítulos con un gráfico que se construye con la voz.
Contrato: `src/plantillas/comun/guion.ts` (`GuionTesis`, re-exportado en `guion.ts`). Ejemplo: `ejemplo.json`
(copia del guion Chile vs Corea del backlog).

## Flujo
```
npx tsx scripts/preparar-tesis.mts <guion.json> [--fixture <series.json>] [--refrescar] [--permitir-duracion]
  → salida/trabajo/<id>.props.json (guion + datos + tiempos + audio + duracionFrames)
  → salida/trabajo/<id>.plan.json  (capítulos con timestamps para la descripción, mid-rolls, fixture sí/no)
flock -w 1800 /tmp/bolita-render.lock npx remotion render src/index.ts Tesis salida/largos/<id>.mp4 \
  --props=salida/trabajo/<id>.props.json --concurrency=1 --x264-preset=veryfast      # de madrugada / por tramos
npx remotion still src/index.ts Miniatura salida/largos/<id>-mini.png --props=salida/trabajo/<id>.props.json
```
Sin `datos` (Studio) se usan series FIXTURE inventadas: el pie de cada gráfico lo dice en rojo. **Nunca publicar
un video con FIXTURE** (`<id>.plan.json` → `fixture: true`).

## Cómo está armado
- `plan.ts` (puro, sin Remotion): `lineasTesis` (líneas de voz + silencios), `planTesis(guion, tiempos, datos)` →
  bloques con frames, capítulo, gráfico vigente, claves de construcción, énfasis del giro, mid-rolls, eventos de
  sonido; `capitulosDescripcion(plan)` → "0:00 Introducción…". Lo usa el agente de operación para la descripción
  y los cortes manuales de Studio.
- Línea de tiempo: tarjeta de título 0,9 s (frame 0: cabecera + rótulo del gancho, entero) → gancho (con su
  gráfico) → promesa con índice de pictogramas → por capítulo: tarjeta 1 s (número + título) → escenas → "el
  número que nadie mira" → remate gigante → pantalla final 20 s (la pregunta siguiente + suscripción a la
  izquierda, hueco 840×472 del video siguiente a la derecha, aviso al pie) → cierre 1,2 s.
- **Regla: NUNCA hay un frame sin contenido visual** (ni pantalla negra ni ejes vacíos esperando a la voz):
  - Escena con gráfico propio y `dice` tardío: hasta 0,4 s antes de `dice` se ve el ÚLTIMO gráfico mostrado
    atenuado + el título del gráfico nuevo como tarjeta; luego transición y el nuevo se construye. Sin `dice`, se
    construye desde el inicio de la escena.
  - Escena sin gráfico propio (planteamiento, giro, reenganche, significado): "tarjeta de cita" = último gráfico
    atenuado (0,45) con paneo/zoom lentísimo + la frase que dice la voz grande al centro (display 66–72 px, máx.
    2 líneas, palabra que suena en dorado; rojo en el giro). Si aún no hubo gráfico: tarjeta del capítulo fija.
  - `respiro`: el último gráfico solo, sin voz, con zoom lento. Tarjeta de capítulo: sobre el gráfico anterior apagado.
  - `escena.enfasis.pais` decide qué país se enciende en rojo en el giro (si falta, `destacar.pais`);
    `anotacion.dice` hace entrar la anotación cuando la voz dice esa palabra.
- Construcción con la voz (`comun/construccion.ts`): la línea llega a cada AÑO cuando la voz lo dice; el contador
  cuenta cuando dice la cifra; barras/ranking/mapa crecen desde `dice` hasta el fin de la frase.
- Arriba: cabecera (izq.), marca de agua (der.), barra de capítulos con pictogramas. Abajo: subtítulos 2–4
  palabras, palabra que suena en dorado. Nada estático > 8 s: rejilla de fondo que deriva + micro-zoom.

## Verificar un video
`npx tsx scripts/fotogramas.mts salida/largos/<id>.mp4` y mirar: frame 0 con el rótulo entero; cada gráfico con
"Fuente: …" abajo; tarjetas de capítulo; respiro sin subtítulo; reenganche con fundido; pantalla final con aviso.
