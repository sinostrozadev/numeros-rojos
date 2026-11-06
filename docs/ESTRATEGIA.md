> 🎯 **OBJETIVO: lograr la MONETIZACIÓN y GANAR MUCHO DINERO. Lo MÁS IMPORTANTE, por encima de calidad, volumen, herramientas o cualquier otra meta, es MONETIZAR y HACER GANAR DINERO a Santiago** (orden textual de Santiago, 2026-11-05). Todo lo demás es instrumento. Skill `estrategia-viva`.

# En Números Rojos — Estrategia (Claude al mando; actualizado 2026-11-05 noche)

Canal **@enumerosrojos** · economía explicada con datos abiertos · español neutro LatAm · lema "La economía, con la cuenta en
pantalla." Propuesta aprobada (GO con condiciones): `docs/PROPUESTA-CANAL.md`. Reglas de producción: `docs/CONVENCIONES.md`.
Meta de calidad: `docs/META-REFERENTE.md` (Los Ecomonos). Cumplimiento: `docs/MONETIZACION.md`. Plan: `docs/PLAN-SEMANAL.md`.
Lo que depende de Santiago: `docs/SANTIAGO.md`. Claude decide tema, formato, cadencia, A/B y herramientas; Santiago, dinero,
identidad y consentimientos.

## 1. Meta con fecha

- **Ruta única: horas de largos.** Desde el **2027-02-01** el YPP exige 1.000 subs + **8.000 h** públicas de largos en 365 días
  (o 20 M de vistas de Shorts en 90 d, inalcanzable para un canal de economía en español). Con 4 min vistos por vista de un largo
  de 10 min: 8.000 h = 480.000 min ÷ 4 = **≈ 120.000 vistas de largos acumuladas**. Si se cruzan 4.000 h (≈ 60.000 vistas) y 1.000 subs
  **antes** del 2027-02-01, se postula ese mismo día con la regla vieja.
- **Meta: YPP en marzo–abril de 2027** (escenario base de la propuesta §4: 120 K vistas de largos en el mes 3,2 ≈ 2027-02-25;
  1.000 subs en el mes 3,5–4). Fecha límite interna: **2027-04-30**.
- **Meta de dinero (mes 12, base):** ~US$1.000–1.800/mes (ads largos + doblaje EN + primeros patrocinios). Optimista US$6.000–12.000.
- Los Shorts **no pagan en ningún escenario** (reparto solo con 10 M de vistas de Shorts/90 d): son embudo de suscriptores al largo.

## 2. Métrica que manda y KPIs de apoyo

**Manda: vistas de largos a 7 días** (mediana de los últimos 6 largos). Es la que mueve horas y dinero a la vez.

| KPI | Umbral | Cuándo se mira | Si no se cumple 2 revisiones seguidas |
|---|---|---|---|
| **Mediana vistas/largo a 7 d** | ≥ 1.000 sem. 2 · ≥ 2.500 sem. 6 · ≥ 5.000 sem. 10 · ≥ 3.000 al 2027-05-31 (cierre) | cada lunes | §7 plan B: título/miniatura primero, luego tema |
| Minutos vistos/día (largos) | ≥ 1.500 al mes 1 · ≥ 9.000 al mes 3 (≈ 150 h/día, ritmo base) | diario (`metricas-diarias`) | revisar duración y retención |
| Retención media del largo | **> 40 %** (≈ 4 min de 10) | por video a 48 h | gancho y primeros 30 s; capítulo donde cae la curva |
| Subs/día | ≥ 5 mes 1 · ≥ 12 mes 2 · ≥ 15 mes 3 | diario | pantalla final, comentario fijado, Short derivado |
| CTR de miniatura | **> 4 %** (impresiones de Studio a 7 d) | por video | A/B de miniatura (Studio "Probar y comparar") |

Proyección en cada revisión (`estrategia-viva` §3): `fecha YPP = hoy + (120.000 − vistas_largos_acumuladas) ÷ vistas_largos/día (7 d)`
y lo mismo con subs. Si cae después del 2027-04-30, se cambia algo esa misma semana.

## 3. Producto

- **Largo `tesis` 16:9, 9–12 min (≥ 8:30 para mid-rolls)** = el producto. Una pregunta cerrada + una tesis propia, probada con
  3–5 gráficos animados de datos abiertos, fuente en pantalla. Fórmula en `docs/GUION.md` (gancho con contradicción medible →
  pregunta y tesis → 3 actos con un gráfico y un giro cada uno → "el número que nadie mira" → qué significa para LatAm, sin
  consejo → cierre simétrico + puente al siguiente).
- **4 estructuras argumentales en rotación** (ninguna > 40 % de los largos de la semana): las define el schema de `tesis`
  (`estructura`). **≥ 2 tipos de gráfico por largo** (líneas, barras, ranking, área, contador, comparación, mapa, tarjeta).
- **Short `grafico` 9:16, 35–50 s** = el embudo: UN gráfico que sorprende, derivado del largo de la semana o autónomo, con
  enlace al largo (descripción + comentario fijado).
- **Series** (razón para volver): "El país que fue rico", "Cuánto rinde tu sueldo", "Quiebras explicadas", "El indicador que
  nadie mira". Cada largo termina con la pregunta del siguiente de su serie.
- **Revisor numérico obligatorio**: ninguna cifra sale sin recalcularse contra el dataset (tolerancia 5 %). Una cifra mal
  leída es el riesgo reputacional n.º 1 del nicho (Ecomonos recibe críticas exactamente por eso).

## 4. Cadencia

- **3 largos/semana: lunes, miércoles y viernes 19:00** (America/Santiago; 17:00 CDMX, 19:00 Buenos Aires, 23:00 Madrid).
- **1 Short/día a las 13:00.** **Tope 1 Short/día hasta el YPP** (luego 3/semana): AIR Media-Tech midió que mezclar 21+
  Shorts/mes deprime el RPM de los largos del mismo canal (−77 % en entretenimiento). Más Shorts no compran horas.
- Lanzamiento (decidido por la sesión principal el 2026-11-05): primer Short **sáb 2026-11-07 13:00**, primer largo
  **dom 2026-11-08 19:00** (excepción fuera de ranura) y desde el **lun 2026-11-09** la ranura normal. Colchón objetivo:
  ≥ 2 largos y ≥ 3 Shorts renderizados por delante (`contenido/calendario.json`).
- Render del largo solo de madrugada, uno a la vez, lock compartido `/tmp/bolita-render.lock` (3 canales en 7,6 GB).

## 5. Distribución y SEO (gratis)

- **Título:** pregunta cerrada con contradicción + país/número ("¿Por qué X… si Y?"), ≤ 60 caracteres, sin palabras de
  catástrofe (`PROHIBIDAS_TITULO`). Miniatura: UNA cifra o UNA línea que se cruza, ≤ 4 palabras, país en dorado.
- **Capítulos con timestamps** en cada descripción (salen de `capitulos[]`); los mid-rolls van en esos límites.
- **Comentario fijado** con la pregunta del siguiente video de la serie ("El miércoles: ¿por qué…?") + fuente principal.
- **Listas por serie** (una playlist por serie) y pantalla final de 20 s con el siguiente largo + lista.
- **Doblaje automático a inglés activado desde el día 1** (gratis; Ecomonos lo usa): acceso al RPM de EE. UU. (~3×). Se mide
  la proporción de vistas en inglés (H4).
- Primera línea de la descripción = la pregunta; luego 2–3 líneas propias del video (distintas siempre), fuentes con URL y
  "No es asesoría financiera. Datos abiertos con fuente en pantalla. Voz sintetizada."
- Comentarios: responder las preguntas de dato con la fuente; corregir en público (comentario fijado) si hubo un error.
  Nunca discutir política ni recomendar productos.

## 6. Cumplimiento

Checklist por video y por tanda en `docs/MONETIZACION.md` (skill `monetizacion-youtube`). Lo que más pesa en este nicho:
**sin presentador ni personaje IA "experto"** (regla 2026-07: no se monetizan personas IA dando información financiera),
**sin consejo ni productos**, aviso fijo "No es asesoría financiera", variación real entre videos (4 estructuras, ≥ 2 tipos de
gráfico, tesis distinta), fuentes CC BY citadas (WDI, OWID, Maddison; **FMI y Numbeo prohibidos**), voz sintética declarada,
categoría Educación, "no es para niños".

## 7. Riesgos y plan B

| Riesgo | Señal | Plan B |
|---|---|---|
| Los largos no retienen | retención < 40 % y caída fuerte antes del min 3 en ≥ 4 largos | gancho más corto y primer gráfico antes de 0:20; si no basta, bajar a 6–8 min (se pierde mid-roll) con más cadencia |
| Títulos/miniaturas no abren | CTR < 4 % en ≥ 4 largos | A/B de miniatura en Studio; reescribir títulos con la fórmula de `REFERENTES.md` §3 |
| Contenido inauténtico / plantilla | aviso en Studio, "uso limitado", caída de vistas a todo el canal | bajar a 2 largos/semana, más variación de estructura, auditar hoja de contacto, nunca repetir gancho |
| Cifra mal leída | comentario que la demuestra | corrección fijada en 24 h + entrada en DECISIONES + caso de prueba en el revisor numérico |
| YMYL / personaje IA | política nueva o rechazo en la revisión del YPP | nada de "yo te recomiendo"; aviso fijo; la voz describe datos |
| Shorts deprimen el RPM | RPM de largos < US$1,2 con > 30 Shorts/mes | 3 Shorts/semana tras el YPP (ya previsto) |
| RAM / render del largo | OOM, render > 150 min | por tramos (`videos-largos` §5), `.wslconfig memory=12GB` |
| Edge TTS cae | error de voz | Kokoro local (RTX 3060) o Azure gratis 500 K caracteres/mes |
| Roce con canales hermanos | mismo tema que Entender Chile o Línea Punteada | sin noticia del día, sin mapa como eje; cruzar temas antes de guionar |
| Doblaje de HMW/EE al español | caen las vistas de temas globales | ángulo LatAm propio; nosotros también nos doblamos al inglés |
| 2 hipótesis centrales muertas | — | pivotar a "Cuánto rinde tu sueldo" (finanzas personales comparadas, ficha B del informe) sin cambiar identidad; canal gemelo EN si H4 se confirma |

## 8. Hipótesis vivas

Lotes de ≥ 6, una variable por lote; n < 6 es anécdota (`estrategia-viva` §4).

| H# | Fecha | Creemos que… | Cómo se falsa (métrica, umbral, n) | Estado | Decisión |
|---|---|---|---|---|---|
| H1 | 2026-11-05 | Los largos que **comparan 2 países** (Chile vs Corea, Uruguay vs Argentina) rinden más | vistas 7 d de las comparaciones ≥ **2× la mediana** del canal con n ≥ 4 comparaciones vs ≥ 4 de un país; muere si < 1,3× | abierta | si se confirma: ≥ 50 % de los largos son comparaciones |
| H2 | 2026-11-05 | Los temas **LatAm** rinden más que los **globales** (EE. UU., China, Japón) | mediana 7 d LatAm > mediana global con n ≥ 6 + 6; muere si global ≥ LatAm | abierta | si muere: 50/50 con globales y ángulo LatAm en el capítulo "qué significa" |
| H3 | 2026-11-05 | La voz `es-MX-JorgeNeural` retiene más que `es-CL-LorenzoNeural` | retención media de 6 largos con cada voz (lotes consecutivos); gana la que supere por ≥ 3 puntos; empate → Jorge | abierta (lote 1 = Jorge) | voz fija del canal |
| H4 | 2026-11-05 | El doblaje automático a inglés aporta **≥ 15 % de las vistas** de los largos | Studio → Analytics → idioma de audio a 28 d con ≥ 10 largos; muere si < 5 % | abierta | si se confirma: canal gemelo EN al mes 3 (RPM ~3×) |
| H5 | 2026-11-05 | El Short derivado de un largo le trae **≥ 10 % de sus vistas** | Studio → fuentes de tráfico del largo (desde el Short), n ≥ 6 pares; muere si < 3 % | abierta | si muere: Shorts autónomos solo para subs, o 3/semana antes del YPP |

## 9. Proyección (línea base de la propuesta §4; se recalibra el día 14 y el 30 con Studio)

| | Pesimista | **Base** | Optimista |
|---|---|---|---|
| Vistas por largo a 28 d, meses 1→6 | 600 estables | 1 K → 2,5 K → 5 K → 8 K → 12 K → 15 K | 3 K → 30 K → 100 K |
| Vistas de largos acumuladas (m1…m6) | 8 K, 16 K, 23 K, 31 K, 39 K, 47 K | 13 K, 46 K, 111 K, 215 K, 370 K, 565 K | 39 K, 430 K, 1,7 M… |
| **120.000 vistas (8.000 h)** | mes 15 → no llega en 12 meses | **mes 3,2 (≈ 2027-02-25)** | mes 1,8 (≈ 2027-01-15) |
| **1.000 subs** | mes 13 | **mes 3,5–4** | mes 2 |
| **Fecha YPP** | ✗ (criterio de cierre) | **marzo–abril 2027** | enero–febrero 2027 |
| RPM largos ES (US$) | 1,2 | 1,8 | 2,5 |
| Ingreso ads/mes al mes 12 | US$50 | **US$720–940** (+US$240–420 doblaje EN) | US$3.600–7.500 |
| Patrocinios (fintech/educación financiera) | — | +US$500–1.500/mes desde ~100 K vistas/video (supuesto) | +US$2.000–5.000/mes |
| **Total mes 12** | ~US$50 | **~US$1.000–1.800** | ~US$6.000–12.000 |

La propuesta modeló el lanzamiento el 2026-11-18; al adelantarlo al 2026-11-07/08 los meses corren 11 días antes (la fecha base
del YPP se mantiene como meta, con 11 días de margen). Sensibilidad (base): mediana a la mitad → YPP ≈ julio 2027 (sigue dentro de
12 meses); mediana al doble → YPP ≈ enero 2027 con la regla vieja. Fórmula: `USD/mes = vistas_largos_mes ÷ 1000 × RPM`;
US$1.000/mes a RPM 1,8 ≈ 555 K vistas de largos/mes.

**Palancas en orden** (`estrategia-viva` §5): YPP → mid-rolls manuales en límites de capítulo desde el día 1 aprobado → doblaje
EN (ya activo) → patrocinios de educación financiera/fintech **sin** opinión ni recomendación impuesta (divulgados) → membresías
al nivel de 500 subs → canal gemelo EN si H4.

## 10. Criterio de cierre

Si al **2027-05-31** la **mediana de vistas por largo a 7 días es < 3.000** y la proyección **no da YPP antes del 2027-11-30**,
el canal se cierra: se archiva con 5 líneas de aprendizajes y la fábrica de gráficos pasa a Línea Punteada y Entender Chile.
Antes de eso, regla del día 30 (propuesta §5.4): si la mediana real cae bajo el escenario pesimista en 2 revisiones seguidas,
modo "salvar o cerrar" (`estrategia-viva` §4).

## 11. Revisión

Cada lunes y cada tanda de ≥ 5 videos: las 6 preguntas de `estrategia-viva` §3 con números en `salida/revisiones/<fecha>.md`,
ficha de `META-REFERENTE.md` re-medida, plan semanal rodado, cambios a `DECISIONES.md` + diff de este archivo + ≤ 10 líneas a
Santiago. Primera revisión con datos reales: **lun 2026-11-16**; recalibración del modelo: **lun 2026-12-07** (día 30).
