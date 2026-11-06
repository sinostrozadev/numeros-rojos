# Plantilla `grafico` — Short 9:16 (1080×1920, 60 fps, 35–50 s)

El embudo al largo: UN gráfico que se construye con la voz y un giro. Contrato: `GuionGrafico`
(`src/plantillas/comun/guion.ts`, re-exportado en `guion.ts`). Ejemplo: `ejemplo.json` (Chile vs Corea, 105 palabras).

## Flujo
```
npx tsx scripts/preparar-grafico.mts <guion.json> [--fixture <series.json>] [--refrescar]
flock -w 1800 /tmp/bolita-render.lock npx remotion render src/index.ts Grafico salida/bandeja/<id>.mp4 \
  --props=salida/trabajo/<id>.props.json --concurrency=1 --x264-preset=veryfast
```

## Cómo está armado
- `plan.ts` (puro): `lineasGrafico` (gancho, escenas, remate con sus pausas) y `planGrafico` (bloques, claves de
  construcción, énfasis, eventos de sonido).
- Frame 0: rótulo del gancho en caja dorada + título del gráfico + ejes, ENTEROS (sin animación de entrada).
- El gráfico principal se construye desde `dice` hasta la última escena `dato` antes del giro (la línea llega a
  cada año cuando la voz lo dice). Una escena con un gráfico DISTINTO lo reemplaza durante esa escena. Las
  escenas `dato` con `usaGraficoPrincipal: true` (o que repiten el gráfico) siguen construyéndolo. `escena.enfasis.pais`
  elige el país que se enciende en rojo en el giro; `anotacion.dice` hace entrar la anotación con esa palabra.
- Los rótulos de escena reemplazan al del gancho en la misma caja (rojo en el giro). Subtítulos a y≈1505.
- Zona segura: todo entre y 220 y 1580, lados 60, y 40 px extra libres a la derecha por la columna de botones.
- Remate gigante con velo, cierre de marca 1,2 s. Nada estático > 2 s (rejilla + deriva del gráfico).
