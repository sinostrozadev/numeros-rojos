# Revisión 2026-11-15 — En Números Rojos (agente de estrategia: "no crece, revisa la estrategia")

## Detectado
- Studio a 8 días del lanzamiento: 3 subs, ~1.950 vistas, ~7 h. Línea Punteada (mismo motor): 51 subs / 26 K.
- **Shorts:** el 95,7 % de sus vistas viene del feed (YouTube sí los prueba), pero "se queda a ver" es 38 · 34 · 18 · 48 · 33 · 32 · 29 %
  (media 32,6 %; LP 71 %; meta ≥ 55 %). El feed los deja de empujar: 646 → 412 → 319 → 43 → 3 → 89 → 139 vistas.
- **Fotograma 0 del Short:** gráfico vacío con ejes, subtítulo técnico "Inflación (deflactor del PIB, % anual) · %" y bloque de fuente;
  la voz abre "Según el Banco Mundial…". LP abre con un mapa y "¿DE QUIÉN ES ESTE LAGO?".
- **Largos:** Chile-Corea 1.600 impresiones, CTR 2,7 % (carátula GPT), 227 vistas, duración media 3:06 (30 %); Uruguay 1.300 impresiones,
  CTR 1,0 % (miniatura de Remotion con barras y pie de fuente), 24 vistas, 3:47 (37 %). El cuello está en el clic.
- **Operación:** los largos Argentina (`BQNaK5R-yrk`) e Irlanda (`3m2VqXoQIO0`) y el Short Irlanda (`8JBkI1LW1B4`) estaban en **Draft**
  desde el 11-09: el lote imprimió ✓ y nadie verificó la lista de Studio. Solo 2 de 4 largos salieron.
- Audiencia: 81 % Chile, 99 % espectadores nuevos; los mejores Shorts son rivalidades con Chile dentro (Chile-Corea 646, Panamá-Chile 412).

## Mejorado
- Plantilla `grafico`: **cold open** (gráfico terminado en el frame 0 durante 1,1 s y rebobinado en 0,4 s), sin la línea técnica del
  indicador, pie "Fuente" desde los 3 s. tsc limpio; fotogramas de prueba revisados (Argentina inflación, escala 0,25).
- `docs/GUION.md` §4b (primer segundo del Short y orden de temas) y §10 (largo sin carátula GPT no sale; título con Chile/Argentina).
- `scripts/generar-guiones.mts`: `chequeosGanchoShort` rechaza ganchos que abren con la fuente, primera frase > 14 palabras, jerga
  (PIB, per cápita, PPA, deflactor…) y rótulos > 4 palabras. Probado sobre los 19 Shorts existentes: marca 10.
- `herramientas/navegador/subir-studio.mjs`: BORRADOR=1 elige el borrador por título exacto (había 4 en Draft) y `publicarEn` refleja
  la fecha programada.
- `docs/ESTRATEGIA.md` §0: modo "salvar o cerrar", hipótesis muertas, qué se duplica y qué se mata, proyección y criterio de corte.
- `contenido/calendario.json`: largos lunes y jueves 19:00 desde el 23-11.

## Herramientas exploradas
- Studio por video con el piloto (Analytics → "Stayed to watch", Impressions, CTR, Average view duration): script de volcado de texto
  por URL (scratchpad) — candidato a `herramientas/navegador/retencion-studio.mjs` propio de NR.
- Referentes por el piloto: Los Ecomonos (474 K subs; últimos 24 largos 96 K–1,2 M; temas de bolsillo, futuro e IA, todos "explicado con
  plátanos"); VisualEconomik Shorts (3–28 K, picos 162–224 K con "¿Es hoy todo más caro que antes?"); búsquedas "por qué Chile economía"
  y "economía latinoamérica explicada" (lo que crece: Chile vs Argentina, cobre, "por qué no despega").
- ffmpeg del sistema no está; se usó el de `@remotion/compositor-linux-x64-gnu` (sin filtro hstack).

## Agregado
- `/home/santiago/projects/yt/_propuestas/nr-estrategia-2026-11-15.md` (reglas de 1 página para producción).
- Pedido de carátula GPT para Uruguay (ya publicado) y para los largos 16/18/20 en `_propuestas/largos-sin-caratula.md`.
- Bloque "Revisión de estrategia 2026-11-15" en `docs/PLAN-SEMANAL.md` (rescates y semana 23–29).

## Pendiente
- Medir el cold open: "se queda a ver" de los Shorts del 17-11 en adelante (meta ≥ 50 %). Control lun 2026-11-30; corte lun 2026-12-07.
- Rescatar Irlanda del Draft para lun 23-11 19:00 (si no quedó hecho en esta sesión, `BORRADOR=1 … subir-studio.mjs 2026-11-08-tesis-irlanda-pib-v3 2026-11-23 19:00`).
- Que la verificación "Scheduled" en la lista quede dentro de `subir-studio.mjs` (hoy se hace a mano).
- Decisión de Santiago si el 2026-12-07 cumple 0–1 de 3 criterios: pausar NR y pasar su cupo a Línea Punteada.
