# En Números Rojos — Plan semanal (rodante)

> Actualizado **2026-11-05 23:45** (America/Santiago) por Claude (agente de documentación). Método: skill global `plan-semanal`.
> Regla: siempre hay plan de la semana en curso **y** de la siguiente. Cuando a la semana en curso le quedan < 3 ranuras futuras
> con guion, o termina, se hace el ritual de cierre y se arma la que viene. **Manda el bloque JSON del final** (lo leen
> `estado.mts` y el panel de Santiago); la tabla es su vista legible.

Calendario (`contenido/calendario.json`): **largo `tesis` lun/mié/vie 19:00** + **Short `grafico` diario 13:00** (tope 1/día hasta el
YPP). Lanzamiento: primer Short sáb 11-07, primer largo **dom 11-08 19:00 (excepción fuera de ranura)**, ranura normal desde el lun 11-09.
Los días anteriores al lanzamiento (11-02 → 11-06) no tienen ranuras: el canal no existe todavía.

**Estado al cierre de hoy: 0 de 13 ranuras con guion** (backlog vacío; los agentes de guion trabajan en paralelo). Ids que el plan
espera: `pendiente-tesis-chile-corea`, `pendiente-tesis-argentina`, `pendiente-tesis-uruguay` (el tercero) y los 4 Shorts del backlog
`pendiente-grafico-1` … `pendiente-grafico-4`. Cuando lleguen, cada ranura pasa a `guion` con su ruta en `guion`. ⚠ Con 0 ranuras
con guion, `estado.mts` debe avisar: es esperado esta noche, no el jueves 11-12 (meta: ≥ 50 % de la semana siguiente con guion).

## Semana en curso: lun 2026-11-02 → dom 2026-11-08 (parcial, desde el lanzamiento)

| Día | Hora | Plantilla | Tema (provisional) | Tipo | Contingencia (fuente) | Estado | Referente | Por qué entra |
|---|---|---|---|---|---|---|---|---|
| sáb 11-07 | 13:00 | `grafico` 9:16 | En 1960 Corea del Sur era más pobre que Chile | serie · _El país que fue rico_ | — | sin guion (idea) · ⚠ sin guion: espera contenido/backlog/grafico-*.json (id pendiente-grafico-1, Short derivado de chile-corea); canal sin crear: falta COPPA + NR_CANAL_ID + token (SANTIAGO.md §1) | Data Is Beautiful narrado (un gráfico que sorprende) | lanzamiento; Short derivado del primer largo (H5) |
| dom 11-08 | 13:00 | `grafico` 9:16 | Uruguay y Argentina eran igual de ricos en 1900: la línea se separa | evergreen · _El país que fue rico_ | — | sin guion (idea) · ⚠ sin guion: espera pendiente-grafico-2 (Maddison 2023 vía OWID) | Data Is Beautiful narrado (un gráfico que sorprende) | H1 (comparación entre 2 países); prepara el largo de Argentina del lunes |
| dom 11-08 | 19:00 | **largo** 16:9 `tesis` | ¿Por qué Corea del Sur era más pobre que Chile en 1960 y hoy no? | serie · _El país que fue rico_ | — | sin guion (idea) · ⚠ sin guion: espera contenido/backlog/tesis-chile-corea.json (id pendiente-tesis-chile-corea); revisor numérico obligatorio; render nocturno 16:9 sin probar | Los Ecomonos (largo 9–12 min, una pregunta) | primer largo (excepción: domingo); H1 comparación + H2 LatAm; contradicción medible con WDI |

## Semana siguiente: lun 2026-11-09 → dom 2026-11-15

| Día | Hora | Plantilla | Tema (provisional) | Tipo | Contingencia (fuente) | Estado | Referente | Por qué entra |
|---|---|---|---|---|---|---|---|---|
| lun 11-09 | 13:00 | `grafico` 9:16 | Argentina fue de los países más ricos del mundo: el gráfico de 120 años | serie · _El país que fue rico_ | — | sin guion (idea) · ⚠ sin guion: espera pendiente-grafico-3 | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo de las 19:00 (H5) |
| lun 11-09 | 19:00 | **largo** 16:9 `tesis` | Argentina: el país que fue rico y dejó de serlo, en 5 gráficos | serie · _El país que fue rico_ | — | sin guion (idea) · ⚠ sin guion: espera contenido/backlog/tesis-argentina.json (id pendiente-tesis-argentina) | Los Ecomonos (largo 9–12 min, una pregunta) | primera ranura normal (lunes); H2 LatAm; Maddison CC BY |
| mar 11-10 | 13:00 | `grafico` 9:16 | Lo que valían $1.000 chilenos en 2010 y lo que valen hoy | contingente · _Cuánto rinde tu sueldo_ | INE Chile publica el IPC de octubre de 2026 (08:00) ([2026-11-06](https://www.ine.gob.cl/docs/default-source/prensa-y-comunicacion/calendario/calendario-de-publicaciones.pdf)) | sin guion (idea) · ⚠ sin guion: dato del INE incrustado a mano con URL oficial; verificar la cifra el 2026-11-06 | Data Is Beautiful narrado (un gráfico que sorprende) | contingencia de 4 días (IPC); audiencia CL; abre la serie del sueldo |
| mié 11-11 | 13:00 | `grafico` 9:16 | Uruguay cobra más caro que cualquier vecino: el índice de precios en un gráfico | serie · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: espera pendiente-grafico-4 | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo de las 19:00 (H5) |
| mié 11-11 | 19:00 | **largo** 16:9 `tesis` | ¿Por qué Uruguay es el país más caro de Sudamérica? | evergreen · _Cuánto rinde tu sueldo_ | — | sin guion (idea) · ⚠ sin guion: espera contenido/backlog/tesis-uruguay.json (id pendiente-tesis-uruguay, el tercer largo); estructura distinta a los 2 anteriores | Los Ecomonos (largo 9–12 min, una pregunta) | H2 LatAm; audiencia UY/AR que llega con Argentina; nivel de precios PPA del Banco Mundial (WDI) |
| jue 11-12 | 13:00 | `grafico` 9:16 | El número que nadie mira: cuántos años de sueldo cuesta una casa | evergreen · _El indicador que nadie mira_ | — | sin guion (idea) · ⚠ sin guion: falta elegir dataset con licencia (no Numbeo; OCDE no verificada) | Data Is Beautiful narrado (un gráfico que sorprende) | abre la serie del indicador; variedad de tipo de gráfico (contador) |
| vie 11-13 | 13:00 | `grafico` 9:16 | La inflación de octubre de Argentina en un gráfico de 30 años | contingente · _El país que fue rico_ | INDEC publica el IPC nacional de octubre de 2026 ([2026-11-12](https://www.indec.gob.ar/ftp/cuadros/publicaciones/calendario_2sem2026.pdf)) | sin guion (idea) · ⚠ esperar el dato (INDEC 2026-11-12, 16:00 ART); render la madrugada del 13; si no está a las 06:00 entra el reemplazo 1 | Data Is Beautiful narrado (un gráfico que sorprende) | contingencia de 1 día; audiencia AR ya captada por el largo del lunes; enlaza a ese largo |
| vie 11-13 | 19:00 | **largo** 16:9 `tesis` | ¿Por qué Irlanda parece más rica que Alemania? El truco del PIB | evergreen · _El indicador que nadie mira_ | — | sin guion (idea) · ⚠ sin guion: encargar a generar-guiones (cuarto largo, ninguno en backlog) | Los Ecomonos (largo 9–12 min, una pregunta) | H2: primer tema global (contraste con LatAm); 4.ª estructura; PIB vs INB en WDI |
| sáb 11-14 | 13:00 | `grafico` 9:16 | Irlanda: el país cuyo PIB salta 25 % en un año | serie · _El indicador que nadie mira_ | — | sin guion (idea) · ⚠ sin guion | Data Is Beautiful narrado (un gráfico que sorprende) | Short derivado del largo del viernes (H5) |
| dom 11-15 | 13:00 | `grafico` 9:16 | Panamá creció más que toda Latinoamérica en 20 años | evergreen | — | sin guion (idea) · ⚠ sin guion | Data Is Beautiful narrado (un gráfico que sorprende) | H2 LatAm; país sin cubrir (audiencia PA/CO); prepara un largo futuro |

Proporción: 2 contingentes de 10 ranuras (20 %); 3 largos con 3 estructuras distintas (2 LatAm, 1 global → H2); 4 Shorts derivados
de su largo (H5). Hay una sola plantilla por formato, así que la regla de variedad se mide por estructura argumental y tipo de gráfico.

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
1. `grafico` · México: la inflación de octubre en 25 años (INEGI, si se confirma la fecha 11-09) · 2. `grafico` · ¿Por qué Bolivia se
quedó sin dólares? (reservas, Banco Central de Bolivia con URL) · 3. `grafico` · Cuántas veces cabe el PIB de Uruguay en el de Brasil
(WDI) · 4. `tesis` · ¿Por qué Panamá crece más que toda Latinoamérica? (WDI; reemplazo de cualquier largo sin guion a 48 h).

## Plan (JSON)

```json
{
  "version": 1,
  "canal": "numeros-rojos",
  "zona": "America/Santiago",
  "actualizado": "2026-11-05T23:45:00-03:00",
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
      "tema": "En 1960 Corea del Sur era más pobre que Chile",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "lanzamiento; Short derivado del primer largo (H5)",
      "bloqueo": "sin guion: espera contenido/backlog/grafico-*.json (id pendiente-grafico-1, Short derivado de chile-corea); canal sin crear: falta COPPA + NR_CANAL_ID + token (SANTIAGO.md §1)"
    },
    {
      "fecha": "2026-11-08",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Uruguay y Argentina eran igual de ricos en 1900: la línea se separa",
      "tipo": "evergreen",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H1 (comparación entre 2 países); prepara el largo de Argentina del lunes",
      "bloqueo": "sin guion: espera pendiente-grafico-2 (Maddison 2023 vía OWID)"
    },
    {
      "fecha": "2026-11-08",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "¿Por qué Corea del Sur era más pobre que Chile en 1960 y hoy no?",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "primer largo (excepción: domingo); H1 comparación + H2 LatAm; contradicción medible con WDI",
      "bloqueo": "sin guion: espera contenido/backlog/tesis-chile-corea.json (id pendiente-tesis-chile-corea); revisor numérico obligatorio; render nocturno 16:9 sin probar"
    },
    {
      "fecha": "2026-11-09",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Argentina fue de los países más ricos del mundo: el gráfico de 120 años",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short derivado del largo de las 19:00 (H5)",
      "bloqueo": "sin guion: espera pendiente-grafico-3"
    },
    {
      "fecha": "2026-11-09",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Argentina: el país que fue rico y dejó de serlo, en 5 gráficos",
      "tipo": "serie",
      "serie": "El país que fue rico",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "primera ranura normal (lunes); H2 LatAm; Maddison CC BY",
      "bloqueo": "sin guion: espera contenido/backlog/tesis-argentina.json (id pendiente-tesis-argentina)"
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
      "bloqueo": "sin guion: dato del INE incrustado a mano con URL oficial; verificar la cifra el 2026-11-06"
    },
    {
      "fecha": "2026-11-11",
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
      "porQue": "Short derivado del largo de las 19:00 (H5)",
      "bloqueo": "sin guion: espera pendiente-grafico-4"
    },
    {
      "fecha": "2026-11-11",
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
      "porQue": "H2 LatAm; audiencia UY/AR que llega con Argentina; nivel de precios PPA del Banco Mundial (WDI)",
      "bloqueo": "sin guion: espera contenido/backlog/tesis-uruguay.json (id pendiente-tesis-uruguay, el tercer largo); estructura distinta a los 2 anteriores"
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
      "bloqueo": "esperar el dato (INDEC 2026-11-12, 16:00 ART); render la madrugada del 13; si no está a las 06:00 entra el reemplazo 1"
    },
    {
      "fecha": "2026-11-13",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "¿Por qué Irlanda parece más rica que Alemania? El truco del PIB",
      "tipo": "evergreen",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "H2: primer tema global (contraste con LatAm); 4.ª estructura; PIB vs INB en WDI",
      "bloqueo": "sin guion: encargar a generar-guiones (cuarto largo, ninguno en backlog)"
    },
    {
      "fecha": "2026-11-14",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Irlanda: el país cuyo PIB salta 25 % en un año",
      "tipo": "serie",
      "serie": "El indicador que nadie mira",
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short derivado del largo del viernes (H5)",
      "bloqueo": "sin guion"
    },
    {
      "fecha": "2026-11-15",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Panamá creció más que toda Latinoamérica en 20 años",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "idea",
      "guion": null,
      "videoId": null,
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; país sin cubrir (audiencia PA/CO); prepara un largo futuro",
      "bloqueo": "sin guion"
    }
  ]
}
```
