# En Números Rojos — Plan semanal (rodante)

> Actualizado **2026-11-06 09:10** (America/Santiago) por Claude (agente de documentación). Método: skill global `plan-semanal`.
> Regla: siempre hay plan de la semana en curso **y** de la siguiente. Cuando a la semana en curso le quedan < 3 ranuras futuras
> con guion, o termina, se hace el ritual de cierre y se arma la que viene. **Manda el bloque JSON del final** (lo leen
> `estado.mts` y el panel de Santiago); la tabla es su vista legible.

Calendario (`contenido/calendario.json`): **largo `tesis` lun/mié/vie 19:00** + **Short `grafico` diario 13:00** (tope 1/día hasta el
YPP). Lanzamiento: primer Short sáb 11-07, primer largo **dom 11-08 19:00 (excepción fuera de ranura)**, ranura normal desde el lun 11-09.
Canal creado (id `UC8uOwislkGbnnfoqsJ_FgAw`, COPPA hecho). Los días anteriores al lanzamiento (11-02 → 11-06) no tienen ranuras.

**Estado (2026-11-06 09:10): 7 de 13 ranuras PROGRAMADAS en Studio** (Short sáb 11-07 `LLiqQewooNI`, Short dom 11-08 `9SmuQH7bghE`, largo dom 11-08 `vQT5ObEGz5U`, Short lun 11-09 `mx9le_OLFx8`, largo lun 11-09 `a3akU1RoM6M`, Short mié 11-11 `yJV1sIgJJQ8`, largo mié 11-11 `2mGAJicF93o`); los largos sin miniatura propia hasta la verificación por teléfono (docs/SANTIAGO.md f). Antes: 7 de 13 con guion (7 del backlog validados por el revisor numérico: 3 largos + 4 Shorts, en `contenido/backlog/`). Sin guion: IPC Chile mar 11-10 (se genera el vie 11-06 con el dato del INE), casa jue 11-12, INDEC vie 11-13 (esperar dato del 11-12), largo nuevo vie 11-13 19:00 (Uruguay o Panamá: encargar a `generar-guiones`), Shorts sáb 11-14 y dom 11-15.

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
| jue 11-12 | 13:00 | `grafico` 9:16 | El número que nadie mira: cuántos años de sueldo cuesta una casa | evergreen · _El indicador que nadie mira_ | — | sin guion (idea) · ⚠ sin guion: falta elegir dataset con licencia (no Numbeo; OCDE no verificada) | Data Is Beautiful narrado (un gráfico que sorprende) | abre la serie del indicador; variedad de tipo de gráfico (contador) |
| vie 11-13 | 13:00 | `grafico` 9:16 | La inflación de octubre de Argentina en un gráfico de 30 años | contingente · _El país que fue rico_ | INDEC publica el IPC nacional de octubre de 2026 ([2026-11-12](https://www.indec.gob.ar/ftp/cuadros/publicaciones/calendario_2sem2026.pdf)) | sin guion (idea) · ⚠ sin guion: esperar el dato (INDEC 2026-11-12, 16:00 ART); render la madrugada del 13; si no está a las 06:00 entra el reemplazo 1 | Data Is Beautiful narrado (un gráfico que sorprende) | contingencia de 1 día; audiencia AR ya captada por el largo del lunes; enlaza a ese largo |
| vie 11-13 | 19:00 | **largo** 16:9 `tesis` | ¿Por qué Uruguay es el país más caro de Sudamérica? | evergreen · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: encargar a generar-guiones (largo nuevo; Uruguay o Panamá) | Los Ecomonos (largo 9–12 min, una pregunta) | H2 LatAm; audiencia UY/AR que llega con Argentina; nivel de precios PPA (WDI); alternativa: Panamá |
| sáb 11-14 | 13:00 | `grafico` 9:16 | Uruguay cobra más caro que cualquier vecino: el índice de precios en un gráfico | serie · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: depende del largo de Uruguay | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo del viernes (H5) |
| dom 11-15 | 13:00 | `grafico` 9:16 | ¿Por qué Bolivia se quedó sin dólares? Las reservas en un gráfico | evergreen | — | sin guion (idea) · ⚠ sin guion: reservas del Banco Central de Bolivia con URL | Data Is Beautiful narrado (un gráfico que sorprende) | H2 LatAm; país sin cubrir; sale de la cola de reemplazos |

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
1. `grafico` · México: la inflación de octubre en 25 años (INEGI, si se confirma la fecha 11-09) · 2. `grafico` · Cuántas veces cabe el PIB de Uruguay en el de Brasil (WDI) · 3. `tesis` · ¿Por qué Panamá crece más que toda Latinoamérica? (WDI; reemplazo de cualquier largo sin guion a 48 h). (Bolivia pasó a dom 11-15.)

## Plan (JSON)

```json
{
  "version": 1,
  "canal": "numeros-rojos",
  "zona": "America/Santiago",
  "actualizado": "2026-11-06T09:10:00-03:00",
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
      "videoId": "vQT5ObEGz5U",
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
      "videoId": "a3akU1RoM6M",
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
      "videoId": "2mGAJicF93o",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "H2: primer tema global (contraste con LatAm); PIB vs INB en WDI; reemplaza al de Uruguay",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-12",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "El número que nadie mira: cuántos años de sueldo cuesta una casa",
      "tipo": "evergreen",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "abre la serie del indicador; variedad de tipo de gráfico (contador)",
      "bloqueo": "sin guion: falta elegir dataset con licencia (no Numbeo; OCDE no verificada)"
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
      "tema": "¿Por qué Bolivia se quedó sin dólares? Las reservas en un gráfico",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; país sin cubrir; sale de la cola de reemplazos",
      "bloqueo": "sin guion: reservas del Banco Central de Bolivia con URL"
    }
  ]
}
```
