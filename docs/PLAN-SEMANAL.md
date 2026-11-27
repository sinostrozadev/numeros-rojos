# En Números Rojos — Plan semanal (rodante)

> **2026-11-15 (agente de producción):** semana 16→22 producida y programada; ids verificados en YouTube/Studio según la tabla JSON. Revisor independiente aplicado a cada guion (veredictos en `salida/revisiones/guiones/`).

> Actualizado **2026-11-06 09:10** (America/Santiago) por Claude (agente de documentación). Método: skill global `plan-semanal`.
> **2026-11-18:** canal solo de largos desde el 23-11 (ver hito del jue 19-11 abajo). **REVERTIDO el 25-11: vuelve el Short diario 13:00 (hito del jue 26-11, arriba).**
> Regla: siempre hay plan de la semana en curso **y** de la siguiente. Cuando a la semana en curso le quedan < 3 ranuras futuras
> con guion, o termina, se hace el ritual de cierre y se arma la que viene. **Manda el bloque JSON del final** (lo leen
> `estado.mts` y el panel de Santiago); la tabla es su vista legible.

## 🔒 Hito del jue 2026-11-26 17:00 → semana 2026-11-30 (lun) → 2026-12-06 (dom) · preparado el 25-11 noche

> **2026-11-25: VUELVE EL SHORT DIARIO** (orden de Santiago: "todos los canales deben tener shorts para los suscriptores y largos para
> las horas"; `docs/ESTRATEGIA.md` §000). Semana tipo = **2 largos (lun y jue 19:00) + 7 Shorts (13:00)**: los días de largo el Short es
> su **TRÁILER** (`generar-guiones --derivar-de <largo> --tema "…"`, cierre que remite al largo, related video → largo; `GUION.md` §4c-A);
> los otros 5 días, **Short de DATO** de comparación entre países (gancho §4b, fórmula directa de LP, §4c-B). Nunca temas solo-Chile.
> Todo guion: `verificar-cifras` + `--revisar` + revisor independiente (promedio ≥ 4, ningún criterio < 3) antes de renderizar.

**Semana en curso 23→29 (Shorts agregados el 25-11):**

| Día | Hora | Formato | Título | Estado | Video |
|---|---|---|---|---|---|
| jue 26-11 | 13:00 | Short TRÁILER | Chile se acercó a Nueva Zelanda en 1928. ¿Qué pasó? | programado (publishAt 13:00 verificado por API) | `K1y43ptjkvs` |
| jue 26-11 | 19:00 | largo | ¿Por qué Nueva Zelanda se hizo rica y Chile no? | programado | `n8fV62smf04` |
| vie 27-11 | 13:00 | Short DATO | Un chileno vive más que un estadounidense. ¿Cómo? | programado (publishAt 13:00 verificado por API) | `AuMaUJ9CHy4` |
| sáb 28-11 | 13:00 | Short DATO | Argentina le sacaba 55 % a Chile en 1990. Hoy va detrás | programado (publishAt 13:00 verificado por API) | `_BbvmhwQ_9g` |
| dom 29-11 | 13:00 | Short DATO | Perú tuvo más de 7.000 % de inflación. Hoy, menos que Chile | programado (publishAt 13:00 verificado por API) | `FQp6ZZQJ-M0` |

**Cierre de la semana 23→29 (ritual del jue 26-11, terminado el vie 27-11 madrugada):** Irlanda (lun 23) y Nueva Zelanda
`n8fV62smf04` (jue 26) publicados; Shorts 27/28/29 programados y verificados. Métricas 26-11: 7 subs · 3.805 vistas (2.959 de Shorts).
Nueva Zelanda se mide a 7 días (CTR, impresiones, 30 s) en el control del lun 30-11.

**Semana 30-11 → 06-12 — ASEGURADA (guiones con revisor independiente; renders en la nube; Shorts programados y verificados por API):**

| Día | Hora | Formato | Pieza | Revisor | Render | Estado / video |
|---|---|---|---|---|---|---|
| lun 30-11 | 13:00 | Short TRÁILER | Haití (`EPyqg1wKfSc`, privado sin fecha) si Santiago aprueba Haití en NR; si no, tráiler del respaldo | (Haití: filtros del 26-11) | Haití ✓ | **reservado: decide Santiago** |
| lun 30-11 | 19:00 | largo | **Haití era más rico que República Dominicana. ¿Qué pasó?** (prototipo, carátula GPT `salida/caratulas/haiti-rd-a.png` llegó y está revisada) · respaldo: **¿Por qué Uruguay es más rico que Paraguay?** | Haití 4,14 · respaldo: r2 4,29 NO aprobado (Verdad 4 por una frase; corregida: necesita ronda 3 antes de producirse) | Haití ✓ · respaldo sin render (`contenido/reserva/respaldo-tesis-por-que-uruguay-se-hizo-rico-y-paraguay.json`) | **reservado: decide Santiago** |
| mar 01-12 | 13:00 | Short DATO | Argentina producía más que Uruguay. Desde 2014, al revés | ✓ 4,14 | ✓ nube | programado `3vTK9EZLDlY` |
| mié 02-12 | 13:00 | Short DATO | Un puertorriqueño produce más que un panameño. Y son menos | ✓ r2 4,29 | ✓ nube | programado `DzmImUcyySs` |
| jue 03-12 | 13:00 | Short TRÁILER | En 2024, Argentina 208 % y Perú 5 %. En 1990, al revés | ✓ r2 4,14 | ✓ nube | programado `Lhk4vEHPttE` |
| jue 03-12 | 19:00 | largo | **Perú tuvo peor inflación que Argentina. ¿Qué pasó?** (carátula GPT `salida/caratulas/peru-argentina.png`, revisada) | ✓ r2 4,43 | ✓ nube | programado `GPI5h-uw66M` (carátula GPT cargada; Studio lo dejó sin fecha → publishAt puesto por API) |
| vie 04-12 | 13:00 | Short DATO | Singapur y Chile iban casi parejos en 1960. ¿Qué pasó? | ✓ 4,29 | ✓ nube | programado `aLEBv-UO1JE` (Studio lo dejó sin fecha; publishAt puesto por API) |
| sáb 05-12 | 13:00 | Short DATO | Portugal producía 2,5 veces lo de Chile. Hoy, 1,4 | ✓ r2 4,29 | ✓ nube (re-render: Chile dorado en todo) | programado `zWQmrZk0pCY` |
| dom 06-12 | 13:00 | Short DATO | Costa Rica le ganaba a Panamá en 1990. ¿Qué pasó? | ✓ r2 4,29 | ✓ nube | programado `cICCR3RUX6c` |

Por qué cambió el plan tentativo del 25-11: el largo del jueves pasó de Uruguay–Paraguay a **Perú vs Argentina (inflación)**, tema con outlier
medido (Mapa y Dinero 158 K) y n.º 2 de la tabla de `/home/santiago/projects/yt/_propuestas/2026-11-26-viral-numeros-rojos.md` §2.1
(sugerencia 2: "el primer largo de cada semana, el tema de mayor demanda medida"); Uruguay–Paraguay quedó de respaldo del lunes. Potosí salió
(España ≠ LatAm, puntaje 16). Sáb 05-12: Chile vs Portugal (de la cola) en vez del "bolsillo" (no había par con paradoja limpia en el catálogo).
Ojo: dom 29-11 (Perú inflación) y jue 03-12 (tráiler Perú–Argentina) repiten tema en 5 días; se aceptó porque el del jueves empuja al largo.
Medición el lun 07-12: criterio (e) de Shorts (subs por 1.000 vistas ≥ 2, "se queda" ≥ 50 %) + clics de los tráileres al largo.

## 🔒 Hito del jue 2026-11-19 17:00 → semana 2026-11-23 (lun) → 2026-11-29 (dom) · preparado el 18-11 noche

> **Desde el lun 23-11 el canal es SOLO DE LARGOS** (lun y jue 19:00; `docs/ESTRATEGIA.md` §00, decisión 2026-11-18). No se
> escriben guiones de Shorts. Todo largo nuevo: título del molde (`GUION.md` §10b), arranque con escena (§3b, lo valida
> `generar-guiones`), carátula del molde (`docs/PEDIDO-CARATULA-MOLDE.md`) y tema de comparación entre países (nunca solo Chile:
> eso es de Entender Chile).

| Día | Hora | Largo | Estado | Modelado sobre (outlier, vistas) | Por qué |
|---|---|---|---|---|---|
| lun 23-11 | 13:00 | (Short Irlanda `8JBkI1LW1B4`, ya programado; último Short del canal) | programado | — | se queda |
| lun 23-11 | 19:00 | **¿Por qué Irlanda creció 25 % en un año y su gente no?** (`3m2VqXoQIO0`, retitulado el 18-11) | programado | — | ranura ocupada desde el rescate del 15-11 |
| jue 26-11 | 19:00 | **¿Por qué Nueva Zelanda se hizo rica y Chile no?** — escena de arranque candidata: un barco frigorífico zarpa de Port Chalmers (Dunedin) en febrero de 1882 con carne congelada hacia Londres (el "Dunedin", 15-02-1882; verificar), mientras Chile vive del salitre de Iquique y Antofagasta | **programado `n8fV62smf04`** (publishAt 2026-11-26T22:00Z verificado por API; carátula GPT puesta) | Fortune of Nations, "¿Por qué Australia se hizo rica y Argentina no?" 67 K, 202 comentarios ← https://www.youtube.com/watch?v=ij_ab_gDcyU | mismo molde y mismo dataset (Maddison/WDI); los dos son exportadores de materias primas del sur, lejos de todo; audiencia CL (70 %+) dentro |
| (jue 26-11 alternativa) | 19:00 | **GTA 6 en números** — SOLO si al jue 19-11 17:00 Take-Two publicó **cifras oficiales** de ventas (comunicado o reporte; nunca estimaciones de Sensor Tower como si fueran oficiales). Si entra, toma el jue 26 y Nueva Zelanda pasa al lun 30-11 | **descartado el jue 19-11 14:00**: sin cifras oficiales de Take-Two (solo "sin precedentes" de Zelnick sin unidades y estimaciones de analistas) | propuesta `/home/santiago/projects/yt/_propuestas/2026-11-18-gta6.md` §5B/§7 | la ola dura 1–2 semanas; sin imágenes del juego, tráilers, logos ni tipografía que lo imite; comparación con taquillas, giras y PIB de países LatAm |

**Ritual del jue 19-11 (sesión multicanal, regla "cerrar frentes"):** semana 23→29 = lun 23 Irlanda `3m2VqXoQIO0` y jue 26 Nueva
Zelanda (guion `contenido/backlog/tesis-por-que-nueva-zelanda-se-hizo-rica.json`, carátula GPT del molde `salida/caratulas/nueva-zelanda-chile.png`,
revisada). Los Shorts que siguen programados (Japón sáb 21, Colombia dom 22, Irlanda lun 23, Corea mar 24) se quedan. El guion suelto
`tesis-chile-era-mas-pobre-que-mexico-en-1994.json` NO se produce (repite tema y no pasa el validador).

**Esqueleto semana lun 30-11 → dom 06-12 (guiones el jue 26-11 17:00):** lun 30-11 19:00 y jue 03-12 19:00, dos largos de la cola de
abajo (sugerido: 1 = Potosí/España, 4 = Uruguay vs Paraguay). Si Take-Two publica ventas oficiales antes del jue 26, "GTA 6 en números"
toma el lun 30. Lectura del corte: lun 07-12 (ESTRATEGIA §00).

**Cola de largos (molde, sobre outliers del informe):**
1. ¿Por qué España no se hizo rica con la plata de Potosí? ← Curiosito 153 K https://www.youtube.com/watch?v=ZakfKXrgqJ4 (Bolivia/España).
2. ¿Por qué EE. UU. se hizo rico y Latinoamérica no? ← Fortune 160 K https://www.youtube.com/watch?v=iKXJVXbpnoA (usar con un par concreto: "¿Por qué Canadá se hizo rica y Argentina no?").
3. ¿Qué país de Latinoamérica será el próximo en hacerse rico? ← Fortune 109 K https://www.youtube.com/watch?v=FXfxW2dTW6M (cuidado: sin pronóstico como consejo; leer tendencias).
4. ¿Por qué Uruguay es más rico que Paraguay? / ¿Por qué Panamá se hizo rico y Costa Rica no? (rivalidad de vecinos, molde Borderline 201 K https://www.youtube.com/watch?v=zio__98MTL0).
Descartado por el reparto: "¿Por qué Santiago se hizo rico y Valparaíso no?" (tema solo chileno → Entender Chile).

## ⚠ Revisión de estrategia 2026-11-15 (agente de estrategia) — leer antes de planear la semana 23–29 (la parte de Shorts quedó derogada el 18-11)

- **Rescates del Draft** (Studio los dejó sin publicar el 11-09): largo Argentina `BQNaK5R-yrk` → **dom 15-11 19:00**; largo
  Irlanda `3m2VqXoQIO0` → **lun 23-11 19:00** (esa ranura ya está ocupada). Short Irlanda `8JBkI1LW1B4` PROGRAMADO lun 23-11 13:00 (2026-11-18, por API).
- **Desde el lun 23-11: largos lunes y jueves 19:00** (2/semana, `contenido/calendario.json`), Short diario 13:00.
  Semana 23–29: lun 23 = Irlanda (rescatado); jue 26 = largo nuevo con tema de la lista §4b.5 de GUION.md (bolsillo o
  rivalidad con Chile/Argentina; candidato: Chile vs Argentina, cuánto rinde la plata en cada uno (ingreso por persona en dólares
  vs corregido por precios, WDI); el título sale de la cifra que dé `verificar-cifras`, no al revés).
- Shorts nuevos: gancho §4b (sin "Según…", ≤ 14 palabras, 30–40 s). Los 6 del backlog 16–22 ya guionados se publican tal cual
  (llevan el cold open de la plantilla si se renderizan desde hoy). Resumen de 1 página: `/home/santiago/projects/yt/_propuestas/nr-estrategia-2026-11-15.md`.

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
  "actualizado": "2026-11-27T05:00:00Z",
  "semanas": [
    {
      "inicio": "2026-11-23",
      "fin": "2026-11-29",
      "rol": "en-curso"
    },
    {
      "inicio": "2026-11-30",
      "fin": "2026-12-06",
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
      "estado": "programado",
      "guion": "contenido/backlog/grafico-panama-paso-a-chile-en-2012-y-no-lo.json",
      "videoId": "KXbVulf_zZc",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "Short teaser del largo de Panamá (H5)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-16",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Panamá produce más que Chile. Su gente consume menos",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-panama-produce-mas-que-chile-su-gente.json",
      "videoId": "vRrVLHRROnA",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "carátula GPT puesta por el agente de carátulas; rescatado de Draft con BORRADOR=1"
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
      "estado": "programado",
      "guion": "contenido/backlog/grafico-venezuela-producia-en-2022-menos.json",
      "videoId": "3_oHrD018nY",
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
      "estado": "programado",
      "guion": "contenido/backlog/grafico-exportar-pesa-el-triple-en-mexico-su.json",
      "videoId": "6VVjuWsOVQE",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "H2 LatAm; WDI 2025",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-18",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "México era más rico que Chile. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-mexico-producia-29-mas-que-chile-en-1994.json",
      "videoId": "419I0beU4SA",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "carátula PROVISORIA (Remotion); pendiente GPT (largos-sin-caratula.md)"
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
      "estado": "programado",
      "guion": "contenido/backlog/grafico-noruega-y-venezuela-casi-empataban.json",
      "videoId": "l2WHrXxAxng",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "mismo petróleo, dos destinos",
      "bloqueo": null
    },
    {
      "tipo": "contingente",
      "serie": null,
      "contingencia": {
        "hecho": "Lanzamiento de GTA 6 (PS5 y Xbox Series)",
        "fecha": "2026-11-19",
        "url": "https://www.xbox.com/es-CL/games/store/grand-theft-auto-vi/9NL3WWNZLZZN"
      },
      "guion": "contenido/guiones/2026-11-19-grafico-gta6-horas-sueldo-minimo.json",
      "videoId": "AgGIMWE67oI",
      "referente": "propuesta 2026-11-18-gta6.md §5B",
      "porQue": "excepción puntual a 'solo largos' (sesión principal, 18-11): tema de demanda enorme; precios Xbox Store leídos el 18-11; sin imágenes del juego; render en GitHub Actions (run 44450277857), subido por Studio y publishAt verificado por API (2026-11-20T16:00Z)",
      "bloqueo": null,
      "fecha": "2026-11-20",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "¿Cuántas horas de sueldo mínimo cuesta GTA 6 en tu país?",
      "estado": "programado"
    },
    {
      "fecha": "2026-11-20",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Venezuela era más rica que España. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/tesis-venezuela-doblaba-a-espana-en-1960.json",
      "videoId": "PpkBOxDMuLg",
      "referente": "Los Ecomonos (largo 9–12 min, una pregunta)",
      "porQue": "largo pendiente: 3 intentos fallaron validadores (consejo financiero/enumeración/ritmo) y se cortó por límite de uso",
      "bloqueo": "carátula GPT puesta; rescatado de Draft"
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
      "estado": "programado",
      "guion": "contenido/backlog/grafico-japon-crecio-un-28-en-33-anos-corea-casi.json",
      "videoId": "Vp8sDNnlmUw",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "evergreen",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-22",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Colombia casi duplicó su ingreso. Chile casi lo triplicó",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-colombia-casi-duplico-su-ingreso-chile.json",
      "videoId": "4F169bS8QJA",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "cola: Perú inflación; Bolivia; China LatAm",
      "bloqueo": null
    },
    {
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "guion": null,
      "videoId": "8JBkI1LW1B4",
      "referente": null,
      "porQue": "último Short del canal (rescatado del Draft, programado por API el 18-11)",
      "bloqueo": null,
      "fecha": "2026-11-23",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Irlanda produce el doble que Alemania. Gasta lo mismo",
      "estado": "programado"
    },
    {
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "guion": "contenido/backlog/tesis-irlanda-pib-v2.json",
      "videoId": "3m2VqXoQIO0",
      "referente": null,
      "porQue": "rescatado del Draft; retitulado al molde el 18-11",
      "bloqueo": null,
      "fecha": "2026-11-23",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "¿Por qué Irlanda creció 25 % en un año y su gente no?",
      "estado": "programado"
    },
    {
      "fecha": "2026-11-24",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Corea gasta 12 veces más que Chile en investigar",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/backlog/grafico-corea-gasta-12-veces-mas-que-chile.json",
      "videoId": "7z5bMWnsmH0",
      "referente": "Data Is Beautiful narrado (un gráfico que sorprende)",
      "porQue": "serie El país que fue rico; corrido del vie 20 al mar 24-11 13:00 (18-11, por API) para la contingencia GTA 6",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-26",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Chile se acercó a Nueva Zelanda en 1928. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-25-grafico-chile-casi-alcanzo-a-nueva-zelanda.json",
      "videoId": "K1y43ptjkvs",
      "referente": null,
      "porQue": "tráiler del largo de las 19:00 (GUION §4c-A)",
      "bloqueo": null
    },
    {
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "guion": "contenido/backlog/tesis-por-que-nueva-zelanda-se-hizo-rica.json",
      "videoId": "n8fV62smf04",
      "referente": "Fortune of Nations ES, ¿Por qué Australia se hizo rica y Argentina no? (67 K) https://www.youtube.com/watch?v=ij_ab_gDcyU",
      "porQue": "molde de los canales nuevos (GUION §10b) + arranque con escena (§3b); si Take-Two publica ventas oficiales al jue 19 17:00, esta ranura es 'GTA 6 en números' y NZ pasa al lun 30 · GTA descartado el 19-11 (sin cifras oficiales de Take-Two)",
      "bloqueo": null,
      "fecha": "2026-11-26",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "¿Por qué Nueva Zelanda se hizo rica y Chile no?",
      "estado": "programado"
    },
    {
      "fecha": "2026-11-27",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Un chileno vive más que un estadounidense. ¿Cómo?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-25-grafico-un-chileno-vive-mas.json",
      "videoId": "AuMaUJ9CHy4",
      "referente": null,
      "porQue": "Short de dato (§4c-B): bolsillo/vida",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-28",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Argentina le sacaba 55 % a Chile en 1990. Hoy va detrás",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-25-grafico-argentina-le-sacaba-55-a-chile-en-1990.json",
      "videoId": "_BbvmhwQ_9g",
      "referente": "Chile-Corea 649 (cruce)",
      "porQue": "rivalidad de vecinos con cruce",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-29",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Perú tuvo más de 7.000 % de inflación. Hoy, menos que Chile",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-25-grafico-peru-tuvo-mas-de-7-000-de-inflacion-hoy.json",
      "videoId": "FQp6ZZQJ-M0",
      "referente": null,
      "porQue": "rivalidad + bolsillo (precios)",
      "bloqueo": null
    },
    {
      "fecha": "2026-11-30",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Tráiler de Haití (EPyqg1wKfSc) o del respaldo Uruguay–Paraguay",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "renderizado",
      "guion": "contenido/guiones/2026-11-26-grafico-haiti-iba-adelante-trailer.json",
      "videoId": null,
      "referente": null,
      "porQue": "tráiler §4c-A",
      "bloqueo": "decide Santiago: Haití en NR o en canal nuevo"
    },
    {
      "fecha": "2026-11-30",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Haití era más rico que República Dominicana. ¿Qué pasó? (respaldo: ¿Por qué Uruguay es más rico que Paraguay?)",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "renderizado",
      "guion": "contenido/guiones/2026-11-26-tesis-haiti-republica-dominicana.json",
      "videoId": null,
      "referente": "Mapas Mudos 1,62 M",
      "porQue": "tema de mayor demanda medida del nicho",
      "bloqueo": "decide Santiago (Haití); respaldo Uruguay–Paraguay en contenido/reserva, necesita ronda 3 del revisor"
    },
    {
      "fecha": "2026-12-01",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Argentina producía más que Uruguay. Desde 2014, al revés",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-26-grafico-argentina-producia-mas-que-uruguay-desde.json",
      "videoId": "3vTK9EZLDlY",
      "referente": "Chile-Corea cruce 649",
      "porQue": "rivalidad de vecinos",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-02",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Un puertorriqueño produce más que un panameño. Y son menos",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-26-grafico-un-puertorriqueno-produce-mas.json",
      "videoId": "DzmImUcyySs",
      "referente": "Curiosito 135 K",
      "porQue": "outlier de referente",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-03",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "En 2024, Argentina 208 % y Perú 5 %. En 1990, al revés (tráiler)",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-27-grafico-argentina-208-peru-5-en-1990-era-al.json",
      "videoId": "Lhk4vEHPttE",
      "referente": null,
      "porQue": "tráiler §4c-A",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-03",
      "hora": "19:00",
      "formato": "largo",
      "plantilla": "tesis",
      "tema": "Perú tuvo peor inflación que Argentina. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-27-tesis-peru-tuvo-peor-inflacion-que-argentina.json",
      "videoId": "GPI5h-uw66M",
      "referente": "Mapa y Dinero 158 K",
      "porQue": "demanda medida (viral §2.1 n.º 2)",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-04",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Singapur y Chile iban casi parejos en 1960. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-26-grafico-singapur-y-chile-iban-casi-parejos.json",
      "videoId": "aLEBv-UO1JE",
      "referente": "Fortune ES 313 K",
      "porQue": "outlier de referente",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-05",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Portugal producía 2,5 veces lo de Chile. Hoy, 1,4",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-26-grafico-portugal-producia-2-5-veces-lo-de-chile.json",
      "videoId": "zWQmrZk0pCY",
      "referente": null,
      "porQue": "cola de reemplazos (Chile vs país europeo)",
      "bloqueo": null
    },
    {
      "fecha": "2026-12-06",
      "hora": "13:00",
      "formato": "short",
      "plantilla": "grafico",
      "tema": "Costa Rica le ganaba a Panamá en 1990. ¿Qué pasó?",
      "tipo": "evergreen",
      "serie": null,
      "contingencia": null,
      "estado": "programado",
      "guion": "contenido/guiones/2026-11-26-grafico-costa-rica-le-ganaba-a-panama-en-1990.json",
      "videoId": "cICCR3RUX6c",
      "referente": "largo Panamá CTR 6,5 %",
      "porQue": "rivalidad de vecinos",
      "bloqueo": null
    }
  ]
}
```
