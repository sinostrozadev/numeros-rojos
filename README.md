# En Números Rojos (@enumerosrojos)

> 🎯 Objetivo (orden de Santiago, 2026-11-05): **MONETIZAR y GANAR MUCHO DINERO.** Todo lo demás es instrumento.

Canal de YouTube de **economía explicada con datos abiertos**, en español neutro para Latinoamérica, hecho de punta a punta por
una fábrica automática (Claude + voz sintetizada + Remotion). Lema: **"La economía, con la cuenta en pantalla."**

- **Producto:** largos 16:9 de 9–12 min (plantilla `tesis`): una pregunta, una tesis, 3–5 gráficos animados de datos con fuente
  en pantalla. **Lunes, miércoles y viernes 19:00** (America/Santiago).
- **Embudo:** un Short 9:16 de 35–50 s al día (plantilla `grafico`), **13:00**: un gráfico que sorprende, con enlace al largo.
- **Reglas que no se negocian:** cada cifra recalculada contra su dataset; solo fuentes con licencia comercial (Banco Mundial WDI,
  Our World in Data, Maddison; FMI y Numbeo prohibidos); sin presentador ni consejo financiero ("No es asesoría financiera");
  voz sintetizada declarada; sin catastrofismo.

## Estado (2026-11-05 noche)

Propuesta aprobada (GO con condiciones). Repo armado desde la fábrica de Línea Punteada; plantillas `tesis`/`grafico`, pipeline de
datos y guiones en construcción. **Canal de YouTube aún sin crear** (lo que falta de Santiago: `docs/SANTIAGO.md`). Lanzamiento
planificado: primer Short **sáb 2026-11-07 13:00**, primer largo **dom 2026-11-08 19:00**. Meta: YPP (1.000 subs + 8.000 h)
en **marzo–abril de 2027**.

## Por dónde empezar (cualquier sesión)

| Leer | Para qué |
|---|---|
| `docs/ESTRATEGIA.md` | objetivo, meta con fecha, KPIs, hipótesis, proyección, criterio de cierre |
| `docs/PLAN-SEMANAL.md` | qué sale esta semana y la siguiente (JSON parseable al final) |
| `docs/OPERACION.md` | **comandos**: diario, render, subida, estado, métricas, cron |
| `docs/CONVENCIONES.md` | reglas duras de producción y contrato de guion |
| `docs/GUION.md` | fórmula y system prompt de los guiones |
| `docs/META-REFERENTE.md` / `docs/REFERENTES.md` | contra quién competimos (Los Ecomonos) y qué aprendimos de 12 canales |
| `docs/MONETIZACION.md` | checklist YPP por video y por semana |
| `docs/SANTIAGO.md` | lo único que depende de Santiago |
| `docs/DECISIONES.md` | bitácora de decisiones fechadas |
| `docs/PROPUESTA-CANAL.md` | la propuesta aprobada (números y escenarios) |

## Comandos principales

El detalle está en **`docs/OPERACION.md`**. Atajos de `package.json`:

```bash
npm run studio          # Remotion Studio (previsualizar plantillas)
npm run typecheck       # tsc --noEmit
npx tsx scripts/diario.mts      # rutina diaria: guiones → cifras → voz → render → bandeja → subida
npx tsx scripts/estado.mts      # estado del canal, bandeja y plan semanal
node marca-canal/capturar.mjs   # regenerar avatar, banner y marca de agua
```

Render: uno a la vez en la máquina (lock compartido `/tmp/bolita-render.lock`), largos de madrugada.

## Estructura

```
src/            plantillas Remotion (tesis, grafico, comun/), marca (tokens.ts), lib
scripts/        diario, datos, generar-guiones, voz, sonido, compilar, subir, estado, metricas, cron.txt
contenido/      calendario.json, backlog/ (guiones por publicar), guiones/ (con fecha), datos/ (wdi, owid cacheados)
salida/         bandeja/ (mp4 listos), trabajo/, logs/, metricas/, revisiones/
marca-canal/    avatar.png, banner.png, marca-de-agua.png, logo*.svg, canal.md (descripción, palabras clave, tráiler)
docs/           estrategia, plan, operación, convenciones, guion, monetización, referentes, decisiones
herramientas/   navegador (el piloto vive en bolita-lab, puerto 8777)
secrets/        tokens (gitignored, chmod 600)
```

Canales hermanos (misma fábrica): `/home/santiago/projects/yt/linea-punteada` (geografía) y `/home/santiago/projects/yt/bolita-lab`.
