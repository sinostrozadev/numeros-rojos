# En Números Rojos — Plan semanal (rodante)

> Actualizado **2026-11-06 09:10** (America/Santiago) por Claude (agente de documentación). Método: skill global `plan-semanal`.
> Regla: siempre hay plan de la semana en curso **y** de la siguiente. Cuando a la semana en curso le quedan < 3 ranuras futuras
> con guion, o termina, se hace el ritual de cierre y se arma la que viene. **Manda el bloque JSON del final** (lo leen
> `estado.mts` y el panel de Santiago); la tabla es su vista legible.

## 🔒 Hito del mié 2026-11-11 → semana asegurada 2026-11-12 (jue) → 2026-11-18 (mié)

> Orden de Santiago (2026-11-08): el cupo del Max se renueva los **miércoles**. El miércoles en la noche quedan todos los guiones de
> la semana jue → mié escritos y dirigidos, arrancan los renders y el **jueves** todo está `programado` en Studio. Recién entonces el
> cupo sobrante va a mejoras. Regla completa: skill `plan-semanal` §5b · `operacion-diaria` §0 · `~/.claude/canales/calendario.json`.

| Ranuras jue 11-12 → mié 11-18 | Ya `programado` | Falta (al 2026-11-08 02:40) | Orden de producción el mié 11-11 |
|---|---|---|---|
| 7 Shorts (13:00) | 2 (11-12 y 11-15; sus v2 se suben el 11-09 con el lote diferido) | **5**: 11-13 (INDEC, contingente: dato sale el jue 11-12), 11-14 (Uruguay), 11-16, 11-17, 11-18 (sin ranura aún) | 1.º guiones (Opus, `verificar-cifras`) → render (~20 min c/u) → Studio en orden de fecha |
| 3 largos (vie 11-13, lun 11-16, mié 11-18, 19:00) | 0 | **3**: Uruguay (en revisión), 11-16 y 11-18 sin tema (cola: Panamá; banco de ideas) | guiones primero (son el producto) → render ≈ 2 h c/u, de noche, antes del jueves → Studio |

Tope diario de subidas del canal (sin verificar): si corta, el resto el viernes, en orden de fecha. Al cumplirse: anotar aquí
"✅ asegurada hasta el mié 11-18 (fecha/hora)" y en `salida/revisiones/<fecha>.md`. El plan debe extenderse hasta el 11-18 (hoy
termina el 11-15): agregar las ranuras 11-16 → 11-18 en el ritual del miércoles.

Calendario (`contenido/calendario.json`): **largo `tesis` lun/mié/vie 19:00** + **Short `grafico` diario 13:00** (tope 1/día hasta el
YPP). Lanzamiento: primer Short sáb 11-07, primer largo **dom 11-08 19:00 (excepción fuera de ranura)**, ranura normal desde el lun 11-09.
Canal creado (id `UC8uOwislkGbnnfoqsJ_FgAw`, COPPA hecho). Los días anteriores al lanzamiento (11-02 → 11-06) no tienen ranuras.

**Estado (2026-11-08 02:20): largo dom 11-08 19:00 = `K5ma4A5VFj8` (Chile-Corea v4 definitivo; `eTq0TBuEWIs` privado). Short mar 11-10 13:00 `BILBHyyu_h8`. Pendientes de subir el 11-09 tras el tope diario: Argentina v3 (reemplaza `b1F1JlfZwIw`), Irlanda v3 (reemplaza `m_Lp1dgEsvA`), Shorts Irlanda/México/Bolivia v2 (los viejos `yJV1sIgJJQ8`, `k8gTTX8R9Ao`, `fHVOchMTSE0` ya privados: ranuras mié 11-11, jue 11-12 y dom 11-15 13:00 VACÍAS hasta esa subida). Estado anterior (2026-11-07 09:20): 9 de 13 ranuras PROGRAMADAS en Studio** (añadidos el 11-07: Short jue 11-12 `k8gTTX8R9Ao`, Short dom 11-15 `fHVOchMTSE0`; largos Chile-Corea, Argentina e Irlanda reemplazados por su v2 visual: `eTq0TBuEWIs`, `b1F1JlfZwIw`, `m_Lp1dgEsvA`). Faltan: Short mar 11-10 (IPC Chile, contingente), Short vie 11-13 (INDEC, contingente), largo vie 11-13 (Uruguay, en revisión), Short sáb 11-14. Estado anterior (Short sáb 11-07 `LLiqQewooNI`, Short dom 11-08 `9SmuQH7bghE`, largo dom 11-08 `eTq0TBuEWIs`, Short lun 11-09 `mx9le_OLFx8`, largo lun 11-09 `b1F1JlfZwIw`, Short mié 11-11 `yJV1sIgJJQ8`, largo mié 11-11 `m_Lp1dgEsvA`); los largos sin miniatura propia hasta la verificación por teléfono (docs/SANTIAGO.md f). Antes: 7 de 13 con guion (7 del backlog validados por el revisor numérico: 3 largos + 4 Shorts, en `contenido/backlog/`). Sin guion: IPC Chile mar 11-10 (se genera el vie 11-06 con el dato del INE), casa jue 11-12, INDEC vie 11-13 (esperar dato del 11-12), largo nuevo vie 11-13 19:00 (Uruguay o Panamá: encargar a `generar-guiones`), Shorts sáb 11-14 y dom 11-15.

**Nota 2026-11-07 · los tres largos pasan a dirección visual v2** (fotos de Commons, mapas, iconos, ilustraciones y mascota; docs/GUION.md §7b): `contenido/backlog/tesis-chile-corea-v2.json`, `tesis-argentina-rica-v2.json` y `tesis-irlanda-pib-v2.json` (mismo texto y cifras verificadas; solo cambia lo visual). Se re-renderizan en ese orden (dom 11-08, lun 11-09, mié 11-11) para las **mismas ranuras** de la tabla (no se cambian ranuras ni ids en este plan; cómo se sustituye en Studio el video ya programado lo resuelve la sesión principal: YouTube no permite cambiar el archivo de un video subido).

## Semana en curso: lun 2026-11-02 → dom 2026-11-08 (parcial, desde el lanzamiento)

| Día | Hora | Plantilla | Tema | Tipo | Contingencia (fuente) | Estado | Referente | Por qué entra |
|---|---|---|---|---|---|---|---|---|
| sáb 11-07 | 13:00 | `grafico` 9:16 | Chile le ganaba 3 a 1 a Corea. En 1982 se dio vuelta | serie · _El país que fue rico_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-grafico-chile-corea-cruce.json` | Data Is Beautiful narrado (un gráfico que sorprende) | lanzamiento; teaser del largo Chile-Corea del domingo (H5) |
| dom 11-08 | 13:00 | `grafico` 9:16 | Panamá estaba bajo Chile en 1990. Hoy le saca un 20 % | evergreen | — | **programado** (Studio) · `contenido/guiones/2026-11-06-grafico-panama-chile.json` | Data Is Beautiful narrado (un gráfico que sorprende) | H2 LatAm; país sin cubrir (audiencia PA/CO); Short suelto antes del largo |
| dom 11-08 | 19:00 | **largo** 16:9 `tesis` | Chile era 3 veces más rico que Corea. ¿Qué pasó? | serie · _El país que fue rico_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-tesis-chile-corea.json` | Los Ecomonos (largo 9–12 min, una pregunta) | primer largo (excepción: domingo); H1 comparación + H2 LatAm; contradicción medible con WDI |

## Semana siguiente: lun 2026-11-09 → dom 2026-11-15

| Día | Hora | Plantilla | Tema | Tipo | Contingencia (fuente) | Estado | Referente | Por qué entra |
|---|---|---|---|---|---|---|---|---|
| lun 11-09 | 13:00 | `grafico` 9:16 | España tenía la mitad que Argentina. Hoy tiene el doble | serie · _El país que fue rico_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-grafico-argentina-espana.json` | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo de las 19:00 (H5) |
| lun 11-09 | 19:00 | **largo** 16:9 `tesis` | Argentina era más rica que Alemania. ¿Qué pasó después? | serie · _El país que fue rico_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-tesis-argentina-rica.json` | Los Ecomonos (largo 9–12 min, una pregunta) | primera ranura normal (lunes); H2 LatAm; Maddison CC BY |
| mar 11-10 | 13:00 | `grafico` 9:16 | Lo que valían $1.000 chilenos en 2010 y lo que valen hoy | contingente · _Cuánto rinde tu sueldo_ | INE Chile publica el IPC de octubre de 2026 (08:00) ([2026-11-06](https://www.ine.gob.cl/docs/default-source/prensa-y-comunicacion/calendario/calendario-de-publicaciones.pdf)) | sin guion (idea) · ⚠ sin guion: se genera el vie 11-06 con el dato del INE (URL oficial); verificar la cifra el 2026-11-06 | Data Is Beautiful narrado (un gráfico que sorprende) | contingencia de 4 días (IPC); audiencia CL; abre la serie del sueldo |
| mié 11-11 | 13:00 | `grafico` 9:16 | Irlanda produce el doble que Alemania. Gasta lo mismo | serie · _El indicador que nadie mira_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-grafico-irlanda-consumo.json` | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo de las 19:00 (H5) |
| mié 11-11 | 19:00 | **largo** 16:9 `tesis` | Irlanda creció un 25 % en un año. Su gente, un 2 % | evergreen · _El indicador que nadie mira_ | — | **programado** (Studio) · `contenido/guiones/2026-11-06-tesis-irlanda-pib.json` | Los Ecomonos (largo 9–12 min, una pregunta) | H2: primer tema global (contraste con LatAm); PIB vs INB en WDI; reemplaza al de Uruguay |
| jue 11-12 | 13:00 | `grafico` 9:16 | México gastaba el doble que Chile. En 2025, gasta menos | evergreen · _El indicador que nadie mira_ | — | **programado** (Studio) `k8gTTX8R9Ao` · `contenido/guiones/2026-11-07-grafico-mexico-gastaba-el-doble-que-chile.json` | Data Is Beautiful narrado (un gráfico que sorprende) | abre la serie del indicador (consumo de los hogares por persona, WDI); la idea de la casa pasa a la cola: no hay dataset con licencia |
| vie 11-13 | 13:00 | `grafico` 9:16 | La inflación de octubre de Argentina en un gráfico de 30 años | contingente · _El país que fue rico_ | INDEC publica el IPC nacional de octubre de 2026 ([2026-11-12](https://www.indec.gob.ar/ftp/cuadros/publicaciones/calendario_2sem2026.pdf)) | sin guion (idea) · ⚠ sin guion: esperar el dato (INDEC 2026-11-12, 16:00 ART); render la madrugada del 13; si no está a las 06:00 entra el reemplazo 1 | Data Is Beautiful narrado (un gráfico que sorprende) | contingencia de 1 día; audiencia AR ya captada por el largo del lunes; enlaza a ese largo |
| vie 11-13 | 19:00 | **largo** 16:9 `tesis` | ¿Por qué Uruguay es el país más caro de Sudamérica? | evergreen · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: encargar a generar-guiones (largo nuevo; Uruguay o Panamá) | Los Ecomonos (largo 9–12 min, una pregunta) | H2 LatAm; audiencia UY/AR que llega con Argentina; nivel de precios PPA (WDI); alternativa: Panamá |
| sáb 11-14 | 13:00 | `grafico` 9:16 | Uruguay cobra más caro que cualquier vecino: el índice de precios en un gráfico | serie · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: depende del largo de Uruguay | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo del viernes (H5) |
| dom 11-15 | 13:00 | `grafico` 9:16 | Bolivia tenía 15.000 millones en reservas. En 2024, 2.000 | evergreen | — | **programado** (Studio) `fHVOchMTSE0` · `contenido/guiones/2026-11-07-grafico-bolivia-tenia-15-000-millones.json` (WDI FI.RES.TOTL.CD) | Data Is Beautiful narrado (un gráfico que sorprende) | H2 LatAm; país sin cubrir; sale de la cola de reemplazos |

Proporción: 2 contingentes de 13 ranuras (15 %); 4 largos (Chile-Corea, Argentina, Irlanda, + 1 nuevo por generar); 4 Shorts derivados de su largo (H5: Chile-Corea, Argentina, Irlanda, Uruguay) + Panamá suelto. Una sola plantilla por formato: la variedad se mide por estructura argumental y tipo de gráfico.

## Contingencias revisadas (2026-11-05, WebSearch + calendarios oficiales)

| Hecho | Fecha | Fuente | Decisión |
|---|---|---|---|
| INE Chile publica el IPC de octubre de 2026 (08:00) | 2026-11-06 | [Calendario de publicaciones INE 2026](https://www.ine.gob.cl/docs/default-source/prensa-y-comunicacion/calendario/calendario-de-publicaciones.pdf) (columna NOV = 6, período oct-26; leído en el PDF) | **Entra** mar 11-10 13:00 (Short, serie del sueldo) |
| INE Chile: índices de remuneraciones y costos laborales de septiembre | 2026-11-05 | mismo PDF (IR-ICL, NOV = 5) | **Candidata** para la serie "Cuánto rinde tu sueldo" (salario real = remuneraciones ÷ IPC) en la semana del 16 |
| INDEC Argentina publica el IPC nacional de octubre de 2026 | **jue 2026-11-12** | [Calendario INDEC 2.º semestre 2026](https://www.indec.gob.ar/ftp/cuadros/publicaciones/calendario_2sem2026.pdf) (leído en el PDF: "12 JU · Índice de precios al consumidor (IPC). Cobertura nacional. Octubre de 2026") | **Entra** vie 11-13 13:00 (Short con el dato fresco; enlaza al largo de Argentina del lunes) |
| INDEC: índice de salarios de septiembre | 2026-11-13 | mismo PDF | candidata (serie del sueldo, AR) |
| INEGI México publica el INPC de octubre de 2026 | 2026-11-09 (según el buscador, anunciada en un boletín del INEGI; **no leída** en el calendario oficial) | [boletines INPC 2026 del INEGI](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/inpc/inpc_1q2026_10.pdf) (vía buscador) | **No entra** esta semana: ya hay 2 Shorts de inflación; reemplazo 2 si se cae uno. Verificar fecha en el calendario del INEGI |
| Banxico: decisión de política monetaria de noviembre | 2026-11-05 (según agenda BBVA Research; sin confirmar en Banxico) | [Agenda económica 2026, BBVA Research](https://www.bbvaresearch.com/wp-content/uploads/2026/03/AgendaEconomica_2026.pdf) | **No entra**: noticia del día (roce con lo "contingente diario"); tasas sin tesis estructural |
| Banco Central de Chile: RPM 15-12 e IPoM 16-12 | 2026-12-15/16 | [Calendario de política monetaria BCCh](https://www.bcentral.cl/web/banco-central/noticias-y-publicaciones/prensa/calendario-de-politica-monetaria-y-financiera) (vía buscador) | Fuera de ventana; además datos del BCCh **no se usan** hasta verificar sus términos |
| EE. UU.: IPC de octubre | 2026-11-10 | calendario económico (buscador) | **No entra**: no es LatAm; sin ángulo propio |

## Cola de reemplazos (si una ranura se cae)
1. `grafico` · México: la inflación de octubre en 25 años (INEGI, si se confirma la fecha 11-09) · 0. `grafico` · Cuántos años de sueldo cuesta una casa (idea en espera: falta dataset con licencia; no Numbeo) · 2. `grafico` · Cuántas veces cabe el PIB de Uruguay en el de Brasil (WDI) · 3. `tesis` · ¿Por qué Panamá crece más que toda Latinoamérica? (WDI; reemplazo de cualquier largo sin guion a 48 h). (Bolivia pasó a dom 11-15.)


## Semana 2026-11-16 → 2026-11-22 (agregada 2026-11-13 04:00 por el agente de guiones)

**6 de 10 con guion** (6 Shorts `grafico` en `contenido/backlog/`, `verificar-cifras` exit 0). **Faltan los 3 largos `tesis`** (lun 16, mié 18, vie 20 19:00) y el Short del dom 22. Los largos fallaron los validadores de `generar-guiones`: palabras 'compra/vende' en la voz, enumeraciones sin iconos/versus, esperas > 3 s antes de un gráfico; reintentar con la ayuda de reglas en `--tema` (ver nrchain2). Orden sugerido: Panamá (lun), México TLCAN (mié), Venezuela (vie).

| Día | Hora | Formato | Tema | Estado | Guion |
|---|---|---|---|---|---|
| 11-16 | 13:00 | short grafico | Panamá pasó a Chile en 2012 y no lo volvió a soltar | guion | contenido/backlog/grafico-panama-paso-a-chile-en-2012-y-no-lo.json |
| 11-16 | 19:00 | largo tesis | Panamá pasó a Chile en 2012. ¿Cómo lo hizo? | idea · ⚠ falta guion | — |
| 11-17 | 13:00 | short grafico | Venezuela producía en 2022 menos de la mitad que en 1960 | guion | contenido/backlog/grafico-venezuela-producia-en-2022-menos.json |
| 11-18 | 13:00 | short grafico | Exportar pesa el triple en México. Su ingreso subió 22 % | guion | contenido/backlog/grafico-exportar-pesa-el-triple-en-mexico-su.json |
| 11-18 | 19:00 | largo tesis | México firmó el TLCAN y creció un 19 % en 30 años | idea · ⚠ falta guion | — |
| 11-19 | 13:00 | short grafico | Noruega y Venezuela casi empataban en 1970. En 2022, 17 a 1 | guion | contenido/backlog/grafico-noruega-y-venezuela-casi-empataban.json |
| 11-20 | 13:00 | short grafico | Corea gasta 12 veces más que Chile en investigar | guion | contenido/backlog/grafico-corea-gasta-12-veces-mas-que-chile.json |
| 11-20 | 19:00 | largo tesis | Venezuela tenía el doble que España en 1960. Hoy, un sexto | idea · ⚠ falta guion | — |
| 11-21 | 13:00 | short grafico | Japón creció un 28 % en 33 años. Corea casi lo alcanza | guion | contenido/backlog/grafico-japon-crecio-un-28-en-33-anos-corea-casi.json |
| 11-22 | 13:00 | short grafico | (vacío: Perú 6.261 % descartado, no cuadró verificar-cifras) | idea · ⚠ falta guion | — |

## Plan (JSON)

```json
{
  "version": 1,
  "canal": "numeros-rojos",
  "zona": "America/Santiago",
  "actualizado": "2026-11-13T04:00:00-03:00",
  "semanas": [
    {
      "inicio": "2026-11-02",
      "fin": "2026-11-08",
      "rol": "en-curso"
    },
    {
      "inicio": "2026-11-09",
      "fin": "2026-11-15",
      "rol": "siguiente"
    },
    {
      "inicio": "2026-11-16",
      "fin": "2026-11-22",
      "rol": "siguiente"
    }
  ],
  "ranuras": [
    {
      "fecha": "2026-11-07",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Chile le ganaba 3 a 1 a Corea. En 1982 se dio vuelta",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-chile-corea-cruce.json",
      "videoId": "LLiqQewooNI",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "lanzamiento; teaser del largo Chile-Corea del domingo (H5)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-08",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Panamá estaba bajo Chile en 1990. Hoy le saca un 20 %",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-panama-chile.json",
      "videoId": "9SmuQH7bghE",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; país sin cubrir (audiencia PA/CO); Short suelto antes del largo",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-08",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Chile era 3 veces más rico que Corea. ¿Qué pasó?",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-chile-corea.json",
      "videoId": "eTq0TBuEWIs",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "primer largo (excepción: domingo); H1 comparación + H2 LatAm; contradicción medible con WDI",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-09",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "España tenía la mitad que Argentina. Hoy tiene el doble",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-argentina-espana.json",
      "videoId": "mx9le_OLFx8",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short derivado del largo de las 19:00 (H5)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-09",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Argentina era más rica que Alemania. ¿Qué pasó después?",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-argentina-rica.json",
      "videoId": "b1F1JlfZwIw",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "primera ranura normal (lunes); H2 LatAm; Maddison CC BY",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-10",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Lo que valían $1.000 chilenos en 2010 y lo que valen hoy",
      "tipo": "contingente",
      "serie": "Cuánto rinde tu sueldo",
      "contingencia": {
        "hecho": "INE Chile publica el IPC de octubre de 2026 (08:00)",
        "fecha": "2026-11-06",
        "url": "https://www.ine.gob.cl/docs/default-source/prensa-y-comunicacion/calendario/calendario-de-publicaciones.pdf"
      },
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "contingencia de 4 días (IPC); audiencia CL; abre la serie del sueldo",
      "bloqueo": "sin guion: se genera el vie 11-06 con el dato del INE (URL oficial); verificar la cifra el 2026-11-06"
    },
    {
      "fecha": "2026-11-11",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Irlanda produce el doble que Alemania. Gasta lo mismo",
      "tipo": "serie",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-irlanda-consumo.json",
      "videoId": "yJV1sIgJJQ8",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short derivado del largo de las 19:00 (H5)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-11",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Irlanda creció un 25 % en un año. Su gente, un 2 %",
      "tipo": "evergreen",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-irlanda-pib.json",
      "videoId": "m_Lp1dgEsvA",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "H2: primer tema global (contraste con LatAm); PIB vs INB en WDI; reemplaza al de Uruguay",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-12",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "México gastaba el doble que Chile. En 2025, gasta menos",
      "tipo": "evergreen",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-07-grafico-mexico-gastaba-el-doble-que-chile.json",
      "videoId": "k8gTTX8R9Ao",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "abre la serie del indicador (consumo de los hogares por persona, WDI); la idea de la casa queda en la cola sin dataset con licencia",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-13",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "La inflación de octubre de Argentina en un gráfico de 30 años",
      "tipo": "contingente",
      "serie": "El país que fue rico",
      "contingencia": {
        "hecho": "INDEC publica el IPC nacional de octubre de 2026",
        "fecha": "2026-11-12",
        "url": "https://www.indec.gob.ar/ftp/cuadros/publicaciones/calendario_2sem2026.pdf"
      },
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "contingencia de 1 día; audiencia AR ya captada por el largo del lunes; enlaza a ese largo",
      "bloqueo": "sin guion: esperar el dato (INDEC 2026-11-12, 16:00 ART); render la madrugada del 13; si no está a las 06:00 entra el reemplazo 1"
    },
    {
      "fecha": "2026-11-13",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "¿Por qué Uruguay es el país más caro de Sudamérica?",
      "tipo": "evergreen",
      "serie": "Cuánto rinde tu sueldo",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "H2 LatAm; audiencia UY/AR que llega con Argentina; nivel de precios PPA (WDI); alternativa: Panamá",
      "bloqueo": "sin guion: encargar a generar-guiones (largo nuevo; Uruguay o Panamá)"
    },
    {
      "fecha": "2026-11-14",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Uruguay cobra más caro que cualquier vecino: el índice de precios en un gráfico",
      "tipo": "serie",
      "serie": "Cuánto rinde tu sueldo",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short derivado del largo del viernes (H5)",
      "bloqueo": "sin guion: depende del largo de Uruguay"
    },
    {
      "fecha": "2026-11-15",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Bolivia tenía 15.000 millones en reservas. En 2024, 2.000",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-07-grafico-bolivia-tenia-15-000-millones.json",
      "videoId": "fHVOchMTSE0",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; país sin cubrir; sale de la cola de reemplazos",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-16",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Panamá pasó a Chile en 2012 y no lo volvió a soltar",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-panama-paso-a-chile-en-2012-y-no-lo.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short teaser del largo de Panamá (H5)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-16",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Panamá pasó a Chile en 2012. ¿Cómo lo hizo?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "falta guion"
    },
    {
      "fecha": "2026-11-17",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Venezuela producía en 2022 menos de la mitad que en 1960",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-venezuela-producia-en-2022-menos.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; sin opinión política",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-18",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Exportar pesa el triple en México. Su ingreso subió 22 %",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-exportar-pesa-el-triple-en-mexico-su.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; WDI 2025",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-18",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "México firmó el TLCAN y creció un 19 % en 30 años",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "falta guion"
    },
    {
      "fecha": "2026-11-19",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Noruega y Venezuela casi empataban en 1970. En 2022, 17 a 1",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-noruega-y-venezuela-casi-empataban.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "mismo petróleo, dos destinos",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-20",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Corea gasta 12 veces más que Chile en investigar",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-corea-gasta-12-veces-mas-que-chile.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "serie El país que fue rico",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-20",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Venezuela tenía el doble que España en 1960. Hoy, un sexto",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "falta guion"
    },
    {
      "fecha": "2026-11-21",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Japón creció un 28 % en 33 años. Corea casi lo alcanza",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "guion",
      "guion": "contenido/backlog/grafico-japon-crecio-un-28-en-33-anos-corea-casi.json",
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "evergreen",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-22",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "(vacío: Perú 6.261 % descartado, no cuadró verificar-cifras)",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "cola: Perú inflación; Bolivia; China LatAm",
      "bloqueo": "falta guion"
    }
  ]
}
```
