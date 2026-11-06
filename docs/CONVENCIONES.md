# Convenciones de En Números Rojos (léelas antes de tocar el repo)

## Qué es esto
Fábrica de videos de **economía explicada con datos abiertos**, en español neutro para Latinoamérica. Canal **@enumerosrojos**
("En Números Rojos"). Propuesta aprobada por Santiago el 2026-11-05: `docs/PROPUESTA-CANAL.md`. Fórmula de guion: `docs/GUION.md`.
Fábrica madre (solo lectura, de donde se copió todo): `/home/santiago/projects/yt/linea-punteada` (y antes `bolita-lab`).

**Dos plantillas, dos formatos:**
| Plantilla | Formato | Duración | Papel |
|---|---|---|---|
| `tesis` (composición `Tesis`) | 1920×1080, **30 fps** | 9–12 min (≥ 8:30 para mid-rolls) | **El producto**: horas del YPP y dinero. Lunes, miércoles y viernes 19:00 |
| `grafico` (composición `Grafico`) | 1080×1920, 60 fps | 35–50 s | **El embudo**: 1 al día (13:00) con enlace al largo |
Miniatura del largo: composición `Miniatura` 1280×720 (`remotion still`).

Contrato compartido: `src/plantillas/comun/guion.ts` (schema zod = validador + texto que lee `generar-guiones`) y
`src/plantillas/comun/datos.ts` (DatoRef, SerieResuelta, Grafico, Cifra). Marca: `src/marca/tokens.ts`.

## Reglas duras
- **Cada cifra se recalcula.** Toda cifra que dice la voz va declarada en `cifras[]` con su `calculo` sobre un dataset;
  `scripts/verificar-cifras.mts` la recalcula y **ningún video se renderiza con una cifra fuera de tolerancia (5 %)**.
- **Fuentes de datos permitidas** (licencia comercial verificada el 2026-11-05, `/home/santiago/projects/yt/lab/investigacion/handles-y-licencias.md`):
  Banco Mundial WDI (CC BY 4.0), Our World in Data grapher (CC BY 4.0; Maddison 2023 entra por ahí), datos oficiales
  incrustados a mano con URL de organismo oficial (INE, bancos centrales, CEPAL, SEC). **Prohibido:** FMI (uso comercial exige
  permiso), Numbeo, OCDE y Banco Central de Chile hasta verificar sus términos, cualquier dato "de memoria".
- **Fuente en pantalla siempre:** cada gráfico lleva abajo "Fuente: …" en pequeño; la voz nombra la fuente ≥ 1 vez por capítulo.
- **Sin consejo financiero, sin presentador:** la voz describe lo que muestran los datos; nunca "invierte", "compra", "deberías".
  No hay personaje ni "experto" (YouTube no monetiza personajes IA que dan información financiera). Aviso fijo
  (`MARCA.aviso`) en la pantalla final y en la descripción.
- **Sin catastrofismo:** `PROHIBIDAS_TITULO` en títulos, cabeceras, rótulos y remates. La tensión viene de la contradicción de datos.
- **Variación real (YPP "inauténtico"):** 4 estructuras argumentales en rotación (ninguna > 40 % de los largos de la semana),
  ≥ 2 tipos de gráfico por largo, descripción distinta por video, hoja de contacto semanal revisada.
- **Determinismo:** mismo guion → mismo video. Nada de `Math.random()` (`crearAzar(semilla)` de `src/lib/azar.ts`). Todo se
  anima por frame con `interpolate`/`spring`; nunca transiciones CSS.
- **Voz:** msedge-tts, `es-MX-JorgeNeural` +4 % por defecto (A/B con `es-CL-LorenzoNeural`). Nunca se presenta como persona;
  la descripción declara "Voz sintetizada".
- **Audio:** cama y SFX sintetizados en Node (`scripts/sonido.mts`), ~26 dB bajo la voz; en el largo ningún loop audible > 60 s.
- **Marca:** colores y tipografía solo de `src/marca/tokens.ts` (grafito, verde billete, rojo, dorado, azul). Marca de agua
  discreta; cierre 1,2 s. Gancho visible ENTERO en el frame 0. Nada estático > 8 s en el largo ni > 2 s en el Short.
- **Mid-rolls:** el largo trae `reenganche` antes de cada límite de capítulo ≥ 2; los cortes se ponen manuales en Studio en
  esos límites (skill `videos-largos`). Pantalla final de 20 s con el siguiente largo.
- **RAM (7,6 GB) compartida con 2 canales:** un render a la vez (`flock /tmp/bolita-render.lock`), ≥ 1500 MB libres,
  `--concurrency=1 --x264-preset=veryfast`. El largo se renderiza de madrugada; si supera 150 min, por tramos (`videos-largos` §5).
  Pruebas siempre con `--scale=0.25` y nunca junto a otro render.
- **Piloto:** se usa el de Bolita Lab (puerto 8777). No se copia, no se lanza desde aquí. `subir-studio.mjs` exige `NR_CANAL_ID`.
- Idioma del código, comentarios, docs y commits: **español**. Archivos en minúsculas sin acentos. Commits `ámbito: verbo en infinitivo`.
  No pushear sin pedirlo. Dependencias nuevas: anotarlas en `docs/DECISIONES.md`.

## Contrato de guion (resumen; el detalle está en el schema)
`{ plantilla: 'tesis'|'grafico', id, titulo (≤ 60, contradicción + número/lugar), descripcion, hashtags, props }`, `props.id === id`.
- `tesis`: `cabecera`, `gancho{texto,rotulo,grafico?,cifras?}`, `promesa`, `indice[3–5]`, `estructura`, `capitulos[3–5]{titulo, escenas[]}`,
  `numeroQueNadieMira{texto,grafico,cifras}`, `remate`, `siguiente`, `miniatura{texto,grafico?}`, `fuentes[≥4]`. 1.350–1.950 palabras.
- `grafico`: `gancho`, `grafico`, `escenas[2–4]`, `remate`, `fuentes[≥1]`, `enlaceLargo?`. 85–150 palabras.
- Escena: `tipo` (planteamiento · dato · giro · respiro · reenganche · significado), `texto`, `grafico?`, `cifras?`, `rotulo?`, `fuenteEnVoz?`, `respiroSeg?`.
- Gráfico: `tipo` (lineas · barras · area · ranking · contador · comparacion · mapa · tarjeta), `titulo`, `datos: DatoRef`, `destacar?`, `anotaciones?`, `formato?`, `dice?`.

## Flujo
```
generar-guiones ─► contenido/backlog/<plantilla>-<slug>.json
        diario ─► contenido/guiones/<fecha>-<plantilla>-<slug>.json
               ─► verificar-cifras (bloquea si falla) ─► preparar-<plantilla> (datos → voz → sonido) ─► salida/trabajo/<id>.props.json
               ─► flock render ─► salida/bandeja/<id>.mp4 + .json ('listo', tipo short|largo) [+ <id>-mini.png en largos]
               ─► subir-studio.mjs (piloto) o subir.mts (API) · largos sin #Shorts, categoría 27, capítulos en la descripción
```

## Cómo se ve "bien"
Fondo grafito, un gráfico grande y limpio por escena que se construye con la voz (la línea se dibuja, las barras crecen, el
contador cuenta), el país protagonista en dorado, la fuente abajo en pequeño, anotaciones con año que aparecen cuando la voz
llega ahí, subtítulos de 2–4 palabras con la palabra que suena en dorado, cabecera arriba a la izquierda, tarjeta de capítulo
al cambiar de capítulo, respiros de 3 s con el gráfico solo, remate simétrico gigante, pantalla final con el siguiente video.
