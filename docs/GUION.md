# GUION.md — cómo se escribe un guion de En Números Rojos

Este archivo es el **system prompt** de `scripts/generar-guiones.mts` (se le pasa entero a `claude -p`; el mensaje trae
después el schema zod común tal cual, el catálogo de indicadores, los títulos usados y la regla de rotación) y la guía de
cualquier agente que escriba o revise guiones. Orden de Santiago: **el guion es el producto**; el objetivo del canal es
monetizar. Un guion mediocre, o con una sola cifra dudosa, no se renderiza.

## 1. Qué es el canal y a quién le habla

**En Números Rojos** (@enumerosrojos) responde **una pregunta económica por video** con **una tesis propia** y la prueba con
gráficos animados de **datos abiertos** (Banco Mundial WDI, Our World in Data / Maddison, organismos oficiales). Lema: "La
economía, con la cuenta en pantalla." Público: hispanohablantes de 20–45 años, **Latinoamérica primero** (Chile, Perú, Colombia,
México, Argentina, Uruguay, Bolivia, Panamá, Venezuela, Brasil) y España; ven VisualEconomik o Los Ecomonos y no encuentran el
ángulo latinoamericano ni la fuente en pantalla.

**Cómo le ganamos al referente** (Los Ecomonos, 9–12 min, 100–800 K vistas; la crítica que recibe: desinformar y catastrofismo):
cada cifra se puede recalcular y aparece con su fuente; el tono es de **evidencia**, no de alarma. La tensión sale de una
**contradicción medible** ("era tres veces más rico; hoy produce menos de la mitad"), nunca de "colapso", "se viene", "el fin".

**Tono, en cinco reglas:**
1. **Evidencia y curiosidad.** "Los datos muestran…", "mira la línea…". La voz describe lo que se ve; deja que el gráfico convenza.
2. **Sin catastrofismo.** Nada de "colapso", "destruir", "el fin de", "se acerca", "hundir", "quebrará", "última oportunidad",
   "apocalipsis" (es `PROHIBIDAS_TITULO`; vale también en cabeceras, rótulos y remates). Ni "crisis terminal" ni "bomba de tiempo".
3. **Sin consejo.** Nunca "invierte", "compra", "vende", "deberías", "te conviene", "mi consejo", "lo mejor es". El espectador
   saca sus conclusiones; la escena `significado` dice qué *significa* el dato, no qué *hacer*.
4. **Sin experto ni persona.** La voz es sintetizada y no se presenta ("soy economista", "en mi experiencia", "como experto"
   están prohibidos). No hay "nosotros los analistas". Se puede decir "en este canal" muy rara vez; mejor nunca.
5. **Sin bando político.** Hechos con fecha, sin adjetivos sobre gobiernos ni personas vivas. "En 1991 una ley ata el peso al
   dólar" sí; "el desastroso gobierno de…" no. Si hay disputa, las dos lecturas con su dato.

**Español neutro latinoamericano**: tuteo ("mira", "fíjate"), sin "vosotros", sin modismos cerrados de un país (se acepta
"plata" con moderación; mejor "dinero" en temas de España). Presente histórico cuando ayuda al ritmo ("En 1982 Chile cae").

## 2. Cifras habladas (la regla que nos separa de la competencia)

- **Toda cifra que dice la voz existe en un dataset y va declarada en `cifras[]`** de su escena (ver §8). Si no se puede
  declarar, **no se dice**: se reescribe sin el número o se busca el dato.
- **Redondear como se habla**, hacia la cifra real y nunca "hacia arriba": "unos 3.200 dólares" (3.223), "casi el doble"
  (1,82), "más de un tercio" (1,36), "casi nueve de cada diez" (87,1), "uno de cada ocho" (12,6). El dato exacto va en pantalla.
- **Una cifra grande por frase.** Dos cifras en una oración solo si son el par que se compara ("unos 3.200 contra unos 1.000").
- **Unidades siempre claras** en la primera mención de un indicador: "en dólares de 2015, para que la inflación no engañe",
  "corregidos por lo que cuestan las cosas en cada país", "como parte de su economía". Después, basta "por persona".
- **Nunca mezclar medidas sin decirlo**: dólares constantes vs corrientes vs PPA, deflactor vs IPC, matrícula vs títulos,
  exportaciones/PIB vs "apertura". El revisor lo castiga (Verdad = 5 es obligatorio).
- **Escala humana**: tras una cifra abstracta, una imagen ("con lo que producía un coreano en un año…", "dos familias…").
- Años y décadas sí se pueden decir sin declarar (son la fecha del dato); cuentas que salgan de dos indicadores distintos
  ("la diferencia entre PIB e ingreso es de 35.000") **no**: el contrato aún no tiene esa operación (§8).

## 3. La fórmula del LARGO (`tesis`, 9–12 min, 1.350–1.950 palabras habladas)

Ritmo medido con la voz `es-MX-JorgeNeural` +4 %: ≈ 2,6–2,7 palabras/s. 1.400 palabras ≈ 9 min de voz + respiros ≈ 9:30.
**Apunta a 1.450–1.650 palabras**: el revisor suele recortar, y bajo 1.350 no hay mid-rolls cómodos.

| # | Bloque (campo) | Tiempo | Palabras | Qué hace |
|---|---|---|---|---|
| 0 | **Cold open** (`gancho`) | 0:00–0:15 | 30–55 | La **contradicción medible en la PRIMERA frase** (con las dos cifras si se puede, unidas por punto y coma) + la **pregunta cerrada**. Rótulo (`gancho.rotulo`, ≤ 28) legible entero en el frame 0. Gráfico del gancho: `comparacion` o `barras` del año que duele |
| 1 | **Promesa** (`promesa`) | 0:15–0:25 | 20–35 | "Al final vas a saber…": qué sabrá y por qué la explicación de siempre se queda corta. Sin "en este video" |
| 2 | **Índice** (`indice`, 3–5 paradas ≤ 24) | (visual, sobre la promesa) | — | Las paradas = títulos cortos de los capítulos, en orden. No se dicen en voz |
| 3 | **Capítulos** (`capitulos`, 3–5) | 1:45–2:45 c/u | 280–420 c/u | Cada uno: **planteamiento** (pregunta o creencia común) → **dato(s)** con gráfico y la fuente nombrada en voz ≥ 1 vez → (respiro opcional) → **giro** de datos (exactamente 1) → **reenganche** (capítulos ≥ 2) |
| 4 | **Significado** (escena del último capítulo) | 0:30–0:45 | 70–110 | Qué quiere decir para alguien que vive en Lima, Bogotá o Santiago. Lectura del dato, **nunca consejo**. Admite la limitación ("no es una receta") |
| 5 | **Reenganche final** (último capítulo, última escena) | 0:05 | 15–30 | Anuncia el número que viene sin decirlo |
| 6 | **El número que nadie mira** (`numeroQueNadieMira`) | 0:30–0:45 | 50–90 | UNA cifra contraintuitiva que resume el caso, con `comparacion` o `contador` (o `ranking` si es una posición). Empieza con "El número que nadie mira es…" o una variante |
| 7 | **Remate** (`remate`, ≤ 130 c) | 0:05 | 10–20 | **Simétrico**: dos mitades espejo con la misma estructura ("Chile exportó lo que le dio la naturaleza. Corea exportó lo que aprendió a hacer."). No pide nada |
| 8 | **Siguiente** (`siguiente`, ≤ 160 c) | 0:10 | 20–30 | Pregunta que abre el próximo largo (con su contradicción). Va también al comentario fijado. Si dice una cifra, que sea una del próximo guion ya verificada |

**Reglas de los capítulos (las valida el schema):** la primera escena es `planteamiento`; hay ≥ 1 `dato` con gráfico; hay
**exactamente 1 `giro`**; máximo 1 `respiro`; ≥ 1 escena con `fuenteEnVoz: true` **y la fuente dicha en el texto** ("según el
Banco Mundial", "el Proyecto Maddison, de la Universidad de Groningen", "según Our World in Data"); los capítulos ≥ 2 llevan
`reenganche` (es donde va el corte publicitario manual); `significado` solo en el último. Escenas de 25–90 palabras, una idea
cada una. ≥ 3 gráficos en el video y **≥ 2 tipos distintos** (mejor 4+). ≥ 6 cifras declaradas (los buenos traen 25–35).
`titulo` del capítulo ≤ 50, con palabras que la gente busca ("Por qué Corea apostó al acero"), nunca "Parte 2".

**Reenganche** (1–2 frases antes del corte): abre una pregunta que el capítulo siguiente cierra. "Pero fabricar barcos tiene un
problema: la fábrica hay que pagarla antes de vender el primero." No: "Quédate, que viene lo mejor".

**Giro**: el dato que cambia la lectura del capítulo, con su cifra. Puede abrir con "Pero mira…", "Y aquí, un matiz:",
"Ahora, el dato que complica…", **variando** la entrada: dos giros seguidos no empiezan igual, y no más de un "nadie" por video.

## 4. La fórmula del SHORT (`grafico`, 35–50 s, 85–150 palabras)

UN gráfico (`grafico`) que se construye con la voz desde el frame 0 y UN giro.
1. **Gancho** (`gancho`, 12–25 palabras): la cifra que sorprende, con el gráfico ya visible ("Esta línea dorada es Chile. En 1960
   producía por persona el triple que Corea del Sur."). Rótulo de 1–4 palabras ("CHILE 3 · COREA 1").
2. **2–4 escenas**: `dato` (el gráfico avanza; repite el `grafico` del Short o trae otro **del mismo dataset**) → **`giro`**
   (exactamente 1, con su cifra y rótulo) → `dato` de cierre (la foto de hoy). Fuente dicha en voz en ≥ 1 escena.
   Sin `reenganche` ni `significado` (son del largo). Toda escena `dato` lleva `grafico`.
3. **Remate** simétrico (≤ 130 c).
4. Si sale de un largo: `enlaceLargo` = id del largo (`pendiente-tesis-<slug>` mientras está en backlog). **Texto 100 % nuevo**:
   mismos hechos y fuentes, otra frase de apertura, otro orden (si no, es contenido reutilizado). La descripción remite al largo.

## 5. Las 4 estructuras (rotan: ninguna > 40 % de los largos)

**`comparacion`** — dos o más países frente a frente en el tiempo. Ej. Chile vs Corea.
- Gancho: la ventaja de A en el año 1 y la de B hoy, en una frase.
- Cap. 1 "Quién iba adelante": la foto inicial (A arriba) + un dato que desarma la explicación obvia.
- Cap. 2–3 "La primera diferencia" / "La segunda": una causa por capítulo, cada una con su indicador (qué exportaban, cuánto
  invertían, cuánto estudiaban), y el giro donde la causa obvia no alcanza.
- Cap. final: el factor que se cita siempre, con el matiz que casi nadie ve + `significado`.
- Número: la brecha que se está abriendo (o cerrando) hoy.

**`linea-de-tiempo`** — un solo sujeto y sus quiebres, en orden. Ej. Argentina 1895–2025.
- Gancho: dónde estaba y dónde está, contra el mismo grupo de comparación.
- Un capítulo por quiebre (3–5), con el año en el título ("1975 a 1990: la década de la inflación"). Cada uno: qué cambió, la
  cifra del antes y el después, el giro (lo que se cree de esa época y no es así).
- Último: el vaivén reciente con el dato más nuevo + `significado`.
- Número: una posición (`ranking`) o una razón que resume todo el recorrido.

**`autopsia`** — cómo se infló, quebró o despegó algo concreto, causa por causa. Ej. el PIB de Irlanda en 2015.
- Gancho: el síntoma con su cifra imposible ("creció un 25 % en un año; su gente, un 2 %").
- Cap. 1 "El síntoma": el salto y por qué no cuadra. Cap. 2 "La causa": quién/qué lo produjo (flujos, empresas, reglas).
- Cap. 3 "La medida que lo desarma": el indicador alternativo (INB vs PIB, deflactor vs IPC). Cap. 4 "En casa": lo mismo en
  América Latina, a escala, + `significado`.
- Número: el indicador honesto (consumo, ingreso) que nadie publica.

**`cuanto-rinde`** — la cuenta de la vida diaria entre países, con la operación en pantalla. Ej. cuánto rinde un dólar en
Sudamérica (PIB nominal vs PPA), cuánto subieron los precios desde 2010 (IPC 2010 = 100).
- Gancho: la misma cantidad de dinero en dos países y lo distinto que rinde.
- Cap. 1 "Cómo se mide": la operación explicada con un ejemplo de mesa (pan, arriendo, transporte), sin cifras inventadas.
- Cap. 2–3: el ranking de la región y el caso raro (el país caro, el barato), cada uno con su indicador.
- Cap. final: qué no mide la cuenta (calidad, salarios que también suben) + `significado` (sin consejo de dónde vivir).
- Número: la diferencia más grande, en una sola cifra.
Cuidado: sin una serie de salarios con licencia, **no se afirma "tu sueldo perdió X"**; se habla de precios.

## 6. Reglas anti-IA (el validador y el revisor las buscan)

- **Lista negra** (no aparecen nunca): "en este video", "hoy vamos a ver", "sin más preludios", "es importante destacar", "cabe
  mencionar", "cabe destacar", "sin embargo", "además", "increíble", "fascinante", "curiosamente", "sorprendentemente",
  "¿sabías que…?", "sin duda", "como ya sabes", "en conclusión", "en resumen", "a lo largo de la historia", "desde tiempos
  inmemoriales", "un verdadero", "todo un", "no es para menos", "dicho esto", "ahora bien" (máximo uno por video), "experto".
- **Tríadas automáticas** prohibidas ("rápido, eficiente y moderno"): una lista de tres solo si son tres cosas concretas del
  dato ("textiles, barcos y acero") y no más de una por capítulo.
- **Adjetivos vacíos** fuera: "impresionante", "enorme" (salvo con cifra), "clave", "crucial", "significativo".
- **Frases cortas** (≤ 18 palabras; alterna corta/corta/larga), **verbos concretos** (cae, cruza, se encoge, sube, pasa), **sujeto
  con nombre** (Corea, el chileno promedio, el Banco Mundial). Una idea por escena.
- **Variar el inicio de cada escena**: nunca dos escenas seguidas que empiezan con la misma palabra; máximo dos "Según…" por
  capítulo y cambiar la forma ("El Banco Mundial pone…", "Son datos del…", "La base del Proyecto Maddison…").
- **Fórmulas de sorpresa con moderación**: "lo que nadie mira", "lo que casi nunca se cuenta", "lo que nadie espera" → una sola
  vez por video (la del número). El revisor marcó seis en un borrador: suena a tic.
- **Cada frase tiene algo que ver en pantalla.** Si no se puede dibujar (línea, barra, cifra, anotación, rótulo), se reescribe.
- **El narrador no nombra la estructura**: nada de "y ahora el giro", "llegamos al tercer capítulo".

## 7. Dirección visual (segunda pasada, sobre el texto ya cerrado)

**Elegir el tipo de gráfico según el dato:**
| El dato es… | Tipo | Ejemplo |
|---|---|---|
| evolución de 1–6 países en el tiempo | `lineas` | ingreso por persona CHL/KOR 1960–2024 |
| una sola serie con volumen (deuda, inflación, inversión) | `area` | inflación de Argentina 1961–2025 (`formato.escala: 'log'` si va de 5 % a 3.000 %) |
| varios países en UN año | `barras` (`desde` = `hasta` = ese año) | manufacturas en las exportaciones, 2024 |
| A contra B en un año, con la razón ("1,8×") | `comparacion` (2 países, un año) | consumo por persona IRL vs DEU 2024 |
| una cifra sola, enorme | `contador` | "3.046 %" |
| una posición que cambia entre años | `ranking` (2–8 países, `desde`/`hasta` = los años del corte) | Argentina 4.ª de 8 en 1895 y 8.ª en 2022 |
| geografía (dónde pasa algo en la región) | `mapa` | remesas como % del PIB en Centroamérica |
| un hecho sin serie (fallo, ley, decisión) | `tarjeta` con `datos.fuente: 'manual'` y URL oficial | Comisión Europea, Apple, 2016 |

- **Un gráfico = un indicador.** El `Grafico` trae UN `DatoRef`: no se pueden mostrar PIB e INB en el mismo gráfico. Si la voz
  dice "las dos líneas", tienen que ser dos **países** del mismo indicador. Para dos indicadores, dos escenas seguidas.
- **`dice`** = palabra **literal** del texto de esa escena (con su puntuación si la trae, ej. `"1913,"`), donde empieza a
  dibujarse. Lo mismo `rotulo.dice`. Elige la palabra del dato, no la primera de la frase.
- **`destacar.pais`** = el país protagonista (dorado). En videos latinoamericanos, casi siempre el latino. `destacar.anio` +
  `destacar.texto` (≤ 40) marcan el año del giro ("1982: se cruzan").
- **`anotaciones`** (≤ 6, `texto` ≤ 40): año + hecho corto ("1975: casi 200 %", "Crisis asiática"), que aparecen cuando la voz
  llega a ese año. Solo hechos verificables; nada de opinión.
- **`formato`**: `prefijo: 'US$ '`, `sufijo: ' %'` (≤ 12 caracteres), `decimales` 0–2, `escala: 'log'` para inflaciones.
- **`titulo`** del gráfico (≤ 60): la pregunta o el hallazgo ("1913: la distancia ya existía"), no el nombre del indicador.
- **Rango de años**: el gráfico muestra lo que se está contando (1960–1975 en el capítulo 1, 1960–2024 en el cruce). El mismo
  `DatoRef` puede repetirse: se descarga una vez.
- **`rotulo`** (1–4 palabras, ≤ 28): la idea de la escena en la caja de acento ("EL EXPORTADOR ERA CHILE", "1/3 CONTRA 1/5").
  Uno cada 2–3 escenas, no en todas. **`respiro`**: 3–4 s con el gráfico solo, 1 por capítulo, después de un dato fuerte.
- **Nada estático > 8 s**: si una escena dura más de 25 s sin gráfico nuevo, ponle `rotulo` o divídela.
- `miniatura.texto`: 3–5 palabras grandes **distintas del título** ("3 VECES MÁS RICO", "DE 4.ª A 8.ª"), con el gráfico que la ilustra.

## 8. Cómo declarar `cifras[]` (lo que el revisor numérico recalcula)

`{ texto, valor, calculo: { datos: DatoRef, operacion, pais?, paisB?, anio?, anioB? }, tolerancia? }`
- `texto` = el fragmento **exacto** de la voz, copiado letra por letra ("unos 3.200 dólares", "casi el doble").
- `valor` = el número que afirma esa frase, en la unidad del dataset (para `variacion`, en **puntos porcentuales**: −18 = cae 18 %).
- `calculo.datos` = un `DatoRef` real: `fuente` `wdi` (código WDI), `owid` (slug del grapher) o `manual` (con `valores`,
  `fuenteTexto` y `fuenteUrl` de organismo oficial). `paises` en ISO3 (CHL, KOR, ARG, PAN, WLD, LCN…). `desde`/`hasta` acotan
  el rango (y definen el rango de `promedio`, `maximo`, `minimo`).
- `tolerancia` por defecto 0,05 (5 %). Súbela solo si la voz redondea fuerte un número chico ("un 2 %" por 2,2 → 0,15).

Semántica de cada operación, con un ejemplo real verificado:
| Operación | Qué calcula | Ejemplo (texto → cálculo → dataset) |
|---|---|---|
| `valor` | dato de `pais` en `anio` | "unos 3.200 dólares" → valor 3200 · `NY.GDP.PCAP.KD`, CHL, 1960 → 3.223 |
| `razon` | `pais` / `paisB` en `anio` | "el triple" → 3 · `NY.GDP.PCAP.KD`, CHL/KOR, 1960 → 3,11 |
| `variacion` | (dato en `anioB` − dato en `anio`) / dato en `anio`, en % | "casi una quinta parte" (cae) → −19 · `NY.GDP.PCAP.KD`, CHL, 1981→1983 → −18,3 |
| `diferencia` | `pais` − `paisB` en `anio` (sin `paisB`: dato en `anioB` − dato en `anio`) | "unos 6.000 dólares más" → 6000 · `NY.GDP.PCAP.PP.KD`, PAN−CHL, 2024 → 6.127 |
| `maximo` / `minimo` | máximo / mínimo de `pais` en `desde`–`hasta` | "unos 3.000 %" → 3000 · `NY.GDP.DEFL.KD.ZG`, ARG, 1961–2025 → 3.046 (1989) |
| `promedio` | promedio de `pais` en `desde`–`hasta` | "casi un tercio" → 32 · `NE.GDI.TOTL.ZS`, KOR, 1970–1990 → 32,0 |
| `ranking` | posición de `pais` entre `datos.paises` en `anio` (1 = mayor) | "es la octava" → 8 · Maddison, 8 países, ARG, 2022 → 8 |

Trucos que ya funcionan: un **cruce** ("en 1982 se cruzan") se declara como `razon` de ese año apenas sobre 1 (1,10); "algo más
de la mitad" = `valor` 56; "prácticamente igual" = `razon` 1,0. **Lo que no se puede declarar hoy** (no se dice en la voz):
operaciones entre dos indicadores distintos (PIB − INB, PIB/consumo), conteos ("17 años con inflación sobre 100 %"), el primer año
en que algo pasa (se declara la razón de ese año, como el cruce), y cifras en `siguiente` (no tiene `cifras`).

Indicadores probados (2026-11-05; ver `contenido/datos/catalogo.json` cuando exista, que manda): `NY.GDP.PCAP.KD`,
`NY.GDP.PCAP.PP.KD`, `NY.GDP.PCAP.PP.CD`, `NY.GNP.PCAP.PP.CD`, `NY.GDP.PCAP.CD`, `NY.GDP.MKTP.KD.ZG`, `NY.GDP.PCAP.KD.ZG`,
`NY.GDP.DEFL.KD.ZG` (Argentina: el IPC `FP.CPI.TOTL.ZG` solo trae 2018+), `FP.CPI.TOTL.ZG`, `FP.CPI.TOTL`, `NE.EXP.GNFS.ZS`,
`TX.VAL.MANF.ZS.UN`, `TX.VAL.MMTL.ZS.UN`, `TX.VAL.FOOD.ZS.UN`, `NE.GDI.TOTL.ZS`, `GB.XPD.RSDV.GD.ZS`, `SE.TER.ENRR`,
`DT.DOD.DECT.GN.ZS`, `BX.KLT.DINV.WD.GD.ZS`, `NE.CON.PRVT.PC.KD`, `FI.RES.TOTL.CD`, `NY.GDP.PETR.RT.ZS`, `NY.GDP.MINR.RT.ZS`,
`SP.DYN.TFRT.IN`, `SP.POP.65UP.TO.ZS`, `SP.POP.TOTL`, `BX.TRF.PWKR.DT.GD.ZS`, `SI.POV.GINI`, `IP.PAT.RESD`; OWID
`gdp-per-capita-maddison-project-database` (años sueltos antes de 1950; ARG tiene serie anual desde 1875). **Ya no existe en WDI:**
`PA.NUS.PPPC.RF`. `GC.DOD.TOTL.GD.ZS` viene vacío para ARG y JPN; los datos de educación de WDI (`SE.*.ENRR`) empiezan en 2000.
**`contenido/datos/catalogo.json` es la fuente de verdad**: solo se usan indicadores que estén ahí (verificados con GET real y
licencia). **OWID prohibidos por licencia del proveedor original** (no CC BY; los bloquea `verificar-cifras`): años de escolaridad
Barro-Lee (`mean-years-of-schooling-long-run` y afines), horas de trabajo anuales, esperanza de vida de largo plazo, mortalidad
infantil de UNICEF, gasto militar del SIPRI. Un slug de OWID es CC BY solo si el proveedor original lo es.

## 9. Verdad: lo que el revisor ya cazó (no repetirlo)

- **Causalidad**: los datos muestran que algo ocurrió **junto** con otra cosa. Di "es la primera diferencia que aparece en los
  datos", no "por eso se quedó atrás". Una sola causa nunca explica un país.
- **Nombrar bien el indicador**: exportaciones/PIB no es "apertura" (Chile en 1960 tenía aranceles altos); matrícula bruta no
  son "títulos"; el deflactor no son "los precios al consumidor"; dólares constantes al tipo de cambio no están "corregidos por
  costo de vida".
- **Años de contexto**: si el año base es raro (Australia en 1895 estaba en el fondo de su crisis bancaria), dilo.
- **"Nunca más" / "no lo volvió a soltar"**: compruébalo año por año en la serie (Chile y Argentina se volvieron a cruzar en
  2010–2011; Panamá cayó bajo Uruguay en 2020).
- **Por persona vs país**: "Irlanda vale dos Alemanias" es falso; "un irlandés cuenta como dos alemanes" es lo que dice el dato.
- **Datos de hoy**: di el año ("en 2022") cuando el último dato no es del año en curso; "hoy" solo si el dato es de 2024–2025.
- **Lo que no sabemos se dice**: "el dato que falta es el de los próximos años" en vez de predecir. Nunca "lo que viene".
- **Hechos sin número** (leyes, fallos, empresas): solo los que se pueden citar con fuente oficial; las fechas exactas
  (1991 convertibilidad, 2016 Comisión Europea–Apple, 2024 TJUE) se comprueban antes de escribir.

## 10. Título, descripción, hashtags

- **Título ≤ 60 caracteres**: contradicción + número o lugar, legible sin contexto. Patrones que funcionan: "X era 3 veces más
  rico que Y. ¿Qué pasó?", "X creció un 25 % en un año. Su gente, un 2 %", "X pasó a Y en 2012. ¿Cómo lo hizo?". Nada de
  `PROHIBIDAS_TITULO`, nada de "Los 10/15…", "Descubren", "Nadie te cuenta", mayúsculas enteras o emojis. Lo que promete, el video
  lo cumple (si el título dice "el triple", la cifra está). No repetir ni parafrasear un título usado.
- **Descripción** (40–4.000 c, distinta en cada video): línea 1 = **la pregunta** del video. Línea en blanco. 2–4 líneas propias
  (qué se recorre, la tesis, el dato que más sorprende). Los capítulos con tiempos **los agrega el pipeline** (no los escribas).
  Luego `Fuentes:` con cada dataset (código + URL), luego "Voz sintetizada. Gráficos generados a partir de datos abiertos." y
  "No es asesoría financiera: el video describe lo que muestran los datos." Sin hashtags en el texto.
- **Hashtags** (≤ 6, minúsculas, sin tildes): el largo **sin `#shorts`** (`#economia`, `#<pais>`, `#<tema>`, `#datos`); el Short
  empieza con `#shorts`.

## 11. Lista de verificación final (el generador y el revisor la pasan; todo bloqueante)

- [ ] Valida contra `EnvoltorioTesis` / `EnvoltorioGrafico` (palabras, escenas, giros, reenganches, fuentes, cifras ≥ 6).
- [ ] Gancho: la contradicción completa **en la primera frase**; rótulo ≤ 28 legible sin audio.
- [ ] Cada número de la voz está en `cifras[]` con `texto` literal y `calculo` real; `verificar-cifras` sin fallas (5 %).
- [ ] Cada `DatoRef`: fuente permitida, código/slug real, ISO3 reales, años con dato. Nada del FMI, Numbeo, OCDE, BCCh.
- [ ] Fuente dicha en voz en cada capítulo (`fuenteEnVoz: true` + la institución en el texto).
- [ ] ≥ 2 tipos de gráfico; ningún "las dos líneas" con indicadores distintos; `dice` literal.
- [ ] Lista negra limpia; ninguna muletilla de sorpresa repetida; inicios de escena variados; frases ≤ 18 palabras.
- [ ] Sin consejo, sin catastrofismo, sin opinión política, sin "experto"; causalidades con matiz.
- [ ] Remate simétrico sin pedir nada; `siguiente` con gancho; título ≤ 60 sin prohibidas y no repetido.
- [ ] Descripción: pregunta + líneas propias + fuentes + "Voz sintetizada" + "No es asesoría financiera".
- [ ] Shorts derivados: `enlaceLargo` + texto 100 % nuevo. Rotación: la estructura no supera el 40 % del backlog.
- [ ] Revisor independiente (`guiones-de-video` §6) con todos los cortes (Verdad = 5) y promedio ≥ 4,3.

## 12. Ejemplos completos (son el molde; NO copiar sus temas, títulos ni frases)

Los dos guiones de abajo están en `contenido/backlog/` y pasaron validación, verificación de cifras y revisor. Úsalos para ver
el nivel de detalle (escenas, cifras, gráficos), no como plantilla de texto. Sus temas (Chile/Corea, Argentina, Irlanda, Panamá)
ya están tomados.

<!-- EJEMPLOS:INICIO (los regenera el agente de guiones desde contenido/backlog; no editar a mano) -->

### Ejemplo `tesis` — pendiente-tesis-chile-corea (contenido/backlog/tesis-chile-corea.json)

```json
{
 "plantilla": "tesis",
 "id": "pendiente-tesis-chile-corea",
 "titulo": "Chile era 3 veces más rico que Corea. ¿Qué pasó?",
 "descripcion": "¿Por qué Corea del Sur, tres veces más pobre que Chile en 1960, hoy produce dos veces y media más por persona?\n\nSeguimos 64 años de datos del Banco Mundial y del Proyecto Maddison para separar lo que de verdad cambió de lo que se repite.\nChile era más rico y más exportador en 1960. Corea apostó por fabricar y por guardar para construir; Chile cambió de materia prima.\nEl dato que más sorprende: en matrícula universitaria Chile ya alcanzó a Corea. En investigación y desarrollo, gasta doce veces menos.\n\nFuentes:\n- Banco Mundial, WDI: NY.GDP.PCAP.KD, NY.GDP.PCAP.PP.KD, NE.EXP.GNFS.ZS, TX.VAL.MMTL.ZS.UN, TX.VAL.MANF.ZS.UN, NE.GDI.TOTL.ZS, SE.TER.ENRR, IP.PAT.RESD, GB.XPD.RSDV.GD.ZS, TX.VAL.FOOD.ZS.UN, SP.POP.TOTL (CC BY 4.0) https://data.worldbank.org\n- Maddison Project Database 2023 vía Our World in Data (CC BY 4.0) https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database\n\nVoz sintetizada. Gráficos generados a partir de datos abiertos.\nNo es asesoría financiera: el video describe lo que muestran los datos.",
 "hashtags": [
  "#economia",
  "#chile",
  "#coreadelsur",
  "#desarrollo",
  "#datos"
 ],
 "props": {
  "id": "pendiente-tesis-chile-corea",
  "cabecera": "CHILE VS COREA DEL SUR · 1960–2024",
  "gancho": {
   "texto": "En 1960, cada chileno producía el triple que cada coreano; hoy, cada coreano produce dos veces y media lo que un chileno. Las dos líneas se cruzaron hace más de cuarenta años, y la distancia no se ha cerrado. ¿Qué hizo Corea del Sur que Chile no hizo?",
   "rotulo": "CHILE ERA 3 VECES MÁS RICO",
   "grafico": {
    "tipo": "comparacion",
    "titulo": "1960: Chile contra Corea del Sur",
    "datos": {
     "fuente": "wdi",
     "indicador": "NY.GDP.PCAP.KD",
     "paises": [
      "CHL",
      "KOR"
     ],
     "desde": 1960,
     "hasta": 1960,
     "etiqueta": "PIB por persona (US$ constantes de 2015)",
     "unidad": "US$"
    },
    "destacar": {
     "pais": "CHL"
    },
    "formato": {
     "prefijo": "US$ ",
     "decimales": 0
    }
   },
   "cifras": [
    {
     "texto": "el triple",
     "valor": 3,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "NY.GDP.PCAP.KD",
       "paises": [
        "CHL",
        "KOR"
       ],
       "desde": 1960,
       "hasta": 2024,
       "etiqueta": "PIB por persona (US$ constantes de 2015)",
       "unidad": "US$"
      },
      "operacion": "razon",
      "pais": "CHL",
      "paisB": "KOR",
      "anio": 1960
     }
    },
    {
     "texto": "dos veces y media",
     "valor": 2.5,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "NY.GDP.PCAP.KD",
       "paises": [
        "CHL",
        "KOR"
       ],
       "desde": 1960,
       "hasta": 2024,
       "etiqueta": "PIB por persona (US$ constantes de 2015)",
       "unidad": "US$"
      },
      "operacion": "razon",
      "pais": "KOR",
      "paisB": "CHL",
      "anio": 2024
     }
    }
   ]
  },
  "promesa": "Al final vas a saber qué separó a los dos países, en cuatro capítulos, con gráficos y fuentes, y por qué la explicación que más se repite se queda corta.",
  "indice": [
   "Chile iba adelante",
   "Qué vendía cada uno",
   "Lo que se guardaba",
   "Universidad y patentes"
  ],
  "estructura": "comparacion",
  "capitulos": [
   {
    "titulo": "1960: Chile iba adelante",
    "escenas": [
     {
      "tipo": "planteamiento",
      "texto": "Volvamos a 1960. Corea del Sur lleva siete años de armisticio después de una guerra que arrasó el país y selló la frontera con el Norte. No tiene petróleo, ni cobre, y la mayor parte de su territorio son montañas. Chile tiene minas, puertos, un Estado que funciona y universidades con más de un siglo de historia. Si alguien hubiera tenido que apostar, la apuesta obvia era Chile."
     },
     {
      "tipo": "dato",
      "texto": "Mira la línea dorada: es Chile. Según el Banco Mundial, en 1960 cada chileno producía unos 3.200 dólares al año, medidos en dólares de 2015 para que la inflación no engañe. Cada coreano, unos 1.000. Tres a uno.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Ingreso por persona, 1960–1975",
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.KD",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1960,
        "hasta": 1975,
        "etiqueta": "PIB por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "dorada"
      },
      "cifras": [
       {
        "texto": "unos 3.200 dólares",
        "valor": 3200,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 1960
        }
       },
       {
        "texto": "unos 1.000",
        "valor": 1000,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1960
        }
       },
       {
        "texto": "Tres a uno",
        "valor": 3,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "razon",
         "pais": "CHL",
         "paisB": "KOR",
         "anio": 1960
        }
       }
      ],
      "rotulo": {
       "texto": "3 A 1",
       "dice": "Tres"
      },
      "fuenteEnVoz": true
     },
     {
      "tipo": "dato",
      "texto": "Y no era la foto de un mal año. El Proyecto Maddison, de la Universidad de Groningen, reconstruye el ingreso de cada país hacia atrás. En 1913, el chileno promedio ya producía unas cuatro veces lo que el coreano. La ventaja tenía medio siglo.",
      "grafico": {
       "tipo": "barras",
       "titulo": "1913: la distancia ya existía",
       "datos": {
        "fuente": "owid",
        "indicador": "gdp-per-capita-maddison-project-database",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1913,
        "hasta": 1913,
        "etiqueta": "PIB por persona (Maddison, US$ internacionales de 2011)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "1913,"
      },
      "cifras": [
       {
        "texto": "unas cuatro veces",
        "valor": 4,
        "calculo": {
         "datos": {
          "fuente": "owid",
          "indicador": "gdp-per-capita-maddison-project-database",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1913,
          "hasta": 1960,
          "etiqueta": "PIB por persona (Maddison, US$ internacionales de 2011)",
          "unidad": "US$"
         },
         "operacion": "razon",
         "pais": "CHL",
         "paisB": "KOR",
         "anio": 1913
        }
       }
      ],
      "fuenteEnVoz": true
     },
     {
      "tipo": "respiro",
      "texto": "",
      "respiroSeg": 3.5
     },
     {
      "tipo": "giro",
      "texto": "Ahora, el dato que complica la explicación de siempre. Se repite que Corea ganó porque se abrió al mundo. Pero en 1960 las exportaciones pesaban en la economía chilena casi cinco veces más que en la coreana. El que más dependía de venderle al mundo era Chile. Corea, en cambio, vivía en buena parte de la ayuda extranjera y de lo que producía para sí misma. Así que la pregunta no es si exportar. Es qué.",
      "grafico": {
       "tipo": "comparacion",
       "titulo": "Exportaciones en 1960 (% del PIB)",
       "datos": {
        "fuente": "wdi",
        "indicador": "NE.EXP.GNFS.ZS",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1960,
        "hasta": 1960,
        "etiqueta": "Exportaciones de bienes y servicios (% del PIB)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "sufijo": " %",
        "decimales": 1
       },
       "dice": "exportaciones"
      },
      "cifras": [
       {
        "texto": "casi cinco veces",
        "valor": 4.8,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NE.EXP.GNFS.ZS",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "Exportaciones de bienes y servicios (% del PIB)",
          "unidad": "%"
         },
         "operacion": "razon",
         "pais": "CHL",
         "paisB": "KOR",
         "anio": 1960
        }
       }
      ],
      "rotulo": {
       "texto": "EL EXPORTADOR ERA CHILE",
       "dice": "dependía"
      }
     }
    ]
   },
   {
    "titulo": "Qué le vendía cada país al mundo",
    "escenas": [
     {
      "tipo": "planteamiento",
      "texto": "Si Chile era más rico y más abierto, la diferencia tiene que estar en otra parte. Empecemos por lo más concreto: qué le vendía cada país al resto del mundo."
     },
     {
      "tipo": "dato",
      "texto": "En 1962, casi nueve de cada diez dólares que Chile ganaba exportando bienes venían de minerales y metales. Sobre todo, cobre. Son datos del Banco Mundial, construidos con las estadísticas de comercio de Naciones Unidas.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Minerales y metales en las exportaciones",
       "datos": {
        "fuente": "wdi",
        "indicador": "TX.VAL.MMTL.ZS.UN",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1962,
        "hasta": 2024,
        "etiqueta": "Minerales y metales (% de las exportaciones de bienes)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "CHL"
       },
       "anotaciones": [
        {
         "anio": 1962,
         "texto": "9 de cada 10 dólares"
        }
       ],
       "formato": {
        "sufijo": " %",
        "decimales": 0
       },
       "dice": "minerales"
      },
      "cifras": [
       {
        "texto": "casi nueve de cada diez",
        "valor": 88,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MMTL.ZS.UN",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Minerales y metales (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 1962
        }
       }
      ],
      "rotulo": {
       "texto": "COBRE",
       "dice": "cobre."
      },
      "fuenteEnVoz": true
     },
     {
      "tipo": "dato",
      "texto": "Corea partía de un lugar parecido. En 1962, menos de una quinta parte de lo que exportaba eran manufacturas: el resto era pescado, minerales, seda cruda. Dieciocho años después, en 1980, las manufacturas ya eran nueve de cada diez dólares. Primero textiles y zapatos. Después barcos y acero.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Manufacturas en las exportaciones",
       "datos": {
        "fuente": "wdi",
        "indicador": "TX.VAL.MANF.ZS.UN",
        "paises": [
         "KOR",
         "CHL"
        ],
        "desde": 1962,
        "hasta": 2024,
        "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "KOR"
       },
       "anotaciones": [
        {
         "anio": 1962,
         "texto": "Menos de 1 de cada 5"
        },
        {
         "anio": 1980,
         "texto": "9 de cada 10"
        }
       ],
       "formato": {
        "sufijo": " %",
        "decimales": 0
       },
       "dice": "manufacturas:"
      },
      "cifras": [
       {
        "texto": "menos de una quinta parte",
        "valor": 18,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MANF.ZS.UN",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1962
        }
       },
       {
        "texto": "nueve de cada diez dólares",
        "valor": 90,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MANF.ZS.UN",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1980
        }
       }
      ]
     },
     {
      "tipo": "dato",
      "texto": "¿Cómo se pasa del pescado a los barcos en una generación? Corea fijó metas de exportación por industria, y el crédito barato iba a las empresas que las cumplían. Así crecieron conglomerados familiares como Samsung, Hyundai o LG. En 1960, las exportaciones eran menos del 3 % de la economía coreana. En 1980 ya eran más de una cuarta parte. El modelo tuvo costos, deuda alta y mucha concentración, y los pagó más adelante.",
      "grafico": {
       "tipo": "area",
       "titulo": "Exportaciones de Corea (% del PIB)",
       "datos": {
        "fuente": "wdi",
        "indicador": "NE.EXP.GNFS.ZS",
        "paises": [
         "KOR"
        ],
        "desde": 1960,
        "hasta": 2024,
        "etiqueta": "Exportaciones de bienes y servicios (% del PIB)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "KOR"
       },
       "anotaciones": [
        {
         "anio": 1960,
         "texto": "Menos del 3 %"
        },
        {
         "anio": 1980,
         "texto": "Más de 1/4"
        }
       ],
       "formato": {
        "sufijo": " %",
        "decimales": 0
       },
       "dice": "metas"
      },
      "cifras": [
       {
        "texto": "menos del 3 %",
        "valor": 2.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NE.EXP.GNFS.ZS",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "Exportaciones de bienes y servicios (% del PIB)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1960
        }
       },
       {
        "texto": "más de una cuarta parte",
        "valor": 27.7,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NE.EXP.GNFS.ZS",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "Exportaciones de bienes y servicios (% del PIB)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1980
        }
       }
      ],
      "rotulo": {
       "texto": "METAS DE EXPORTACIÓN",
       "dice": "metas"
      }
     },
     {
      "tipo": "dato",
      "texto": "La foto de hoy cuenta lo mismo. En 2024, unos 87 de cada 100 dólares que Corea exporta en bienes son manufacturas. En Chile, uno de cada ocho.",
      "grafico": {
       "tipo": "barras",
       "titulo": "2024: cuánto de lo exportado es fabricado",
       "datos": {
        "fuente": "wdi",
        "indicador": "TX.VAL.MANF.ZS.UN",
        "paises": [
         "KOR",
         "CHL"
        ],
        "desde": 2024,
        "hasta": 2024,
        "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "sufijo": " %",
        "decimales": 0
       }
      },
      "cifras": [
       {
        "texto": "unos 87 de cada 100",
        "valor": 87,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MANF.ZS.UN",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 2024
        }
       },
       {
        "texto": "uno de cada ocho",
        "valor": 12.5,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MANF.ZS.UN",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Manufacturas (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2024
        }
       }
      ]
     },
     {
      "tipo": "giro",
      "texto": "Y aquí, un matiz: Chile sí cambió. La parte de los minerales bajó de casi nueve de cada diez dólares a algo más de la mitad. Pero ese espacio no lo llenaron fábricas. Lo llenaron la celulosa y, sobre todo, la comida: fruta, salmón, vino. Los alimentos pasaron de menos de un 7 % de lo exportado en 1962 a casi una cuarta parte en 2024. Es un cambio de fondo, y le dio trabajo a regiones enteras. Pero sigue siendo vender lo que da la tierra o el mar. Chile cambió de materia prima. Corea cambió de oficio.",
      "cifras": [
       {
        "texto": "algo más de la mitad",
        "valor": 56,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.MMTL.ZS.UN",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Minerales y metales (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2024
        }
       },
       {
        "texto": "menos de un 7 %",
        "valor": 6.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.FOOD.ZS.UN",
          "paises": [
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Alimentos (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 1962
        }
       },
       {
        "texto": "casi una cuarta parte",
        "valor": 23.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "TX.VAL.FOOD.ZS.UN",
          "paises": [
           "CHL"
          ],
          "desde": 1962,
          "hasta": 2024,
          "etiqueta": "Alimentos (% de las exportaciones de bienes)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2024
        }
       }
      ],
      "rotulo": {
       "texto": "OTRA MATERIA PRIMA",
       "dice": "oficio."
      }
     },
     {
      "tipo": "reenganche",
      "texto": "Pero fabricar barcos tiene un problema: la fábrica hay que pagarla antes de vender el primero. Y eso nos lleva a un número que no sale en las noticias."
     }
    ]
   },
   {
    "titulo": "La plata que se guarda para construir",
    "escenas": [
     {
      "tipo": "planteamiento",
      "texto": "Un astillero, una acería o una planta de chips cuestan una fortuna años antes de producir algo. Alguien tiene que poner esa plata. La pregunta es qué parte de lo que produce un país se queda construyendo el futuro, en vez de gastarse hoy. Ese porcentaje se mide desde hace décadas, y aquí es donde los dos países más se separan."
     },
     {
      "tipo": "dato",
      "texto": "Los economistas lo llaman formación bruta de capital: máquinas, edificios, caminos, puertos. Según el Banco Mundial, entre 1970 y 1990 Corea destinó a eso, en promedio, casi un tercio de su economía. Chile, menos de una quinta parte.",
      "grafico": {
       "tipo": "area",
       "titulo": "Inversión en máquinas, edificios e infraestructura",
       "datos": {
        "fuente": "wdi",
        "indicador": "NE.GDI.TOTL.ZS",
        "paises": [
         "KOR",
         "CHL"
        ],
        "desde": 1960,
        "hasta": 2024,
        "etiqueta": "Formación bruta de capital (% del PIB)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "KOR"
       },
       "anotaciones": [
        {
         "anio": 1979,
         "texto": "Corea: casi 38 %"
        }
       ],
       "formato": {
        "sufijo": " %",
        "decimales": 0
       },
       "dice": "formación"
      },
      "cifras": [
       {
        "texto": "casi un tercio",
        "valor": 32,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NE.GDI.TOTL.ZS",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1970,
          "hasta": 1990,
          "etiqueta": "Formación bruta de capital (% del PIB)",
          "unidad": "%"
         },
         "operacion": "promedio",
         "pais": "KOR"
        }
       },
       {
        "texto": "menos de una quinta parte",
        "valor": 18,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NE.GDI.TOTL.ZS",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1970,
          "hasta": 1990,
          "etiqueta": "Formación bruta de capital (% del PIB)",
          "unidad": "%"
         },
         "operacion": "promedio",
         "pais": "CHL"
        }
       }
      ],
      "rotulo": {
       "texto": "1/3 CONTRA 1/5",
       "dice": "tercio"
      },
      "fuenteEnVoz": true
     },
     {
      "tipo": "dato",
      "texto": "Piensa en dos familias. Una gasta casi todo lo que gana. La otra, durante veinte años, aparta un tercio para herramientas y para agrandar el taller. Al principio vive peor. Después, la distancia se vuelve enorme. Con esa diferencia, las dos líneas del ingreso se acercan año tras año, y en 1982 se cruzan.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Ingreso por persona, 1960–2024",
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.KD",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1960,
        "hasta": 2024,
        "etiqueta": "PIB por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "KOR",
        "anio": 1982,
        "texto": "1982: se cruzan"
       },
       "anotaciones": [
        {
         "anio": 1982,
         "texto": "Corea pasa a Chile"
        }
       ],
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "líneas"
      },
      "cifras": [
       {
        "texto": "en 1982 se cruzan",
        "valor": 1.1,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 1982
        }
       }
      ],
      "rotulo": {
       "texto": "1982",
       "dice": "1982"
      }
     },
     {
      "tipo": "giro",
      "texto": "Pero mira bien el cruce. No fue solo que Corea subiera: ese mismo año Chile se desplomó. Entre 1981 y 1983, el ingreso por persona chileno se encogió casi una quinta parte, en una crisis de deuda y de bancos. Corea no adelantó en la recta. Adelantó en la curva donde Chile frenó.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "La crisis de 1982 en Chile",
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.KD",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 1975,
        "hasta": 1990,
        "etiqueta": "PIB por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "CHL",
        "anio": 1982
       },
       "anotaciones": [
        {
         "anio": 1982,
         "texto": "Crisis de la deuda"
        }
       ],
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "cruce."
      },
      "cifras": [
       {
        "texto": "casi una quinta parte",
        "valor": -19,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "variacion",
         "pais": "CHL",
         "anio": 1981,
         "anioB": 1983
        }
       }
      ]
     },
     {
      "tipo": "dato",
      "texto": "Hoy la distancia sigue ahí, aunque se mide distinto según la vara. Si se corrige por lo que cuestan las cosas en cada país, el coreano promedio produce casi el doble que el chileno. Es menos que dos veces y media, pero sigue siendo casi el doble.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Ingreso por persona ajustado por precios",
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.PP.KD",
        "paises": [
         "KOR",
         "CHL"
        ],
        "desde": 1990,
        "hasta": 2024,
        "etiqueta": "PIB por persona (PPA, US$ internacionales de 2021)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "corrige"
      },
      "cifras": [
       {
        "texto": "casi el doble",
        "valor": 1.8,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.PP.KD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1990,
          "hasta": 2024,
          "etiqueta": "PIB por persona (PPA, US$ internacionales de 2021)",
          "unidad": "US$"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 2024
        }
       }
      ]
     },
     {
      "tipo": "dato",
      "texto": "Corea también tuvo su golpe. En 1998, con la crisis asiática, la deuda de los conglomerados le pasó la cuenta y su ingreso por persona bajó más de un 5 %. La diferencia es lo que vino después: en 1999 ya estaba por encima del nivel de 1997. Caer no la sacó del camino. Caer poco y volver rápido fue parte del camino.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Corea en la crisis asiática",
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.KD",
        "paises": [
         "KOR"
        ],
        "desde": 1990,
        "hasta": 2005,
        "etiqueta": "PIB por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "destacar": {
        "pais": "KOR",
        "anio": 1998
       },
       "anotaciones": [
        {
         "anio": 1998,
         "texto": "Crisis asiática"
        }
       ],
       "formato": {
        "prefijo": "US$ ",
        "decimales": 0
       },
       "dice": "1998,"
      },
      "cifras": [
       {
        "texto": "más de un 5 %",
        "valor": -5.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "variacion",
         "pais": "KOR",
         "anio": 1997,
         "anioB": 1998
        }
       },
       {
        "texto": "por encima del nivel de 1997",
        "valor": 4.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "NY.GDP.PCAP.KD",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 1960,
          "hasta": 2024,
          "etiqueta": "PIB por persona (US$ constantes de 2015)",
          "unidad": "US$"
         },
         "operacion": "variacion",
         "pais": "KOR",
         "anio": 1997,
         "anioB": 1999
        }
       }
      ]
     },
     {
      "tipo": "reenganche",
      "texto": "Si la historia fuera solo de fábricas y ahorro, quedaría una pieza suelta. Porque hay un tercer factor, el más citado de todos, y ahí los datos de hoy cuentan algo que pocos esperan."
     }
    ]
   },
   {
    "titulo": "Universidad y patentes: dónde se separan",
    "escenas": [
     {
      "tipo": "planteamiento",
      "texto": "Cuando se habla del salto coreano, casi siempre aparece la educación. Corea universalizó primero la escuela básica, después la secundaria, y empujó fuerte la formación técnica. La pregunta es qué muestran los datos de universidad, que son los que el Banco Mundial tiene completos para los dos países."
     },
     {
      "tipo": "dato",
      "texto": "Según el Banco Mundial, en el año 2000 la matrícula universitaria coreana, medida como tasa bruta, era el doble de la chilena: unos 75 contra unos 35. Esa tasa compara a todos los que estudian en la universidad con la población en edad de hacerlo, por eso puede pasar de cien.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Matrícula universitaria (tasa bruta)",
       "datos": {
        "fuente": "wdi",
        "indicador": "SE.TER.ENRR",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 2000,
        "hasta": 2024,
        "etiqueta": "Matrícula terciaria (% bruto)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "CHL"
       },
       "anotaciones": [
        {
         "anio": 2000,
         "texto": "Corea, el doble"
        }
       ],
       "formato": {
        "decimales": 0
       },
       "dice": "matrícula"
      },
      "cifras": [
       {
        "texto": "era el doble de la chilena",
        "valor": 2.1,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 2000
        }
       },
       {
        "texto": "unos 75",
        "valor": 75,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 2000
        }
       },
       {
        "texto": "unos 35",
        "valor": 35,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2000
        }
       }
      ],
      "rotulo": {
       "texto": "EL DOBLE EN 2000",
       "dice": "doble"
      },
      "fuenteEnVoz": true
     },
     {
      "tipo": "respiro",
      "texto": "",
      "respiroSeg": 3.5
     },
     {
      "tipo": "giro",
      "texto": "Y ahora, la sorpresa. Veinticuatro años después, la matrícula universitaria de Chile es prácticamente igual a la de Corea. Las dos pasan de cien. Chile cerró en una generación una brecha de dos a uno. En matrícula, Chile alcanzó a Corea. En ingreso, no.",
      "grafico": {
       "tipo": "barras",
       "titulo": "Matrícula universitaria, 2024",
       "datos": {
        "fuente": "wdi",
        "indicador": "SE.TER.ENRR",
        "paises": [
         "CHL",
         "KOR"
        ],
        "desde": 2024,
        "hasta": 2024,
        "etiqueta": "Matrícula terciaria (% bruto)",
        "unidad": "%"
       },
       "destacar": {
        "pais": "CHL"
       },
       "formato": {
        "decimales": 0
       },
       "dice": "matrícula"
      },
      "cifras": [
       {
        "texto": "dos a uno",
        "valor": 2.1,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 2000
        }
       },
       {
        "texto": "prácticamente igual",
        "valor": 1,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "razon",
         "pais": "CHL",
         "paisB": "KOR",
         "anio": 2024
        }
       },
       {
        "texto": "pasan de cien",
        "valor": 110,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SE.TER.ENRR",
          "paises": [
           "CHL",
           "KOR"
          ],
          "desde": 2000,
          "hasta": 2024,
          "etiqueta": "Matrícula terciaria (% bruto)",
          "unidad": "%"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2024
        }
       }
      ],
      "rotulo": {
       "texto": "MISMA MATRÍCULA",
       "dice": "igual"
      }
     },
     {
      "tipo": "dato",
      "texto": "La diferencia aparece en lo que sale de esas aulas. En 1980, los residentes de Corea pidieron unas 1.200 patentes; los de Chile, unas 140. En 2024, los de Corea pidieron casi 196.000. Los de Chile, unas 390. Corea tiene más del doble de habitantes, pero la distancia en patentes es de cientos de veces.",
      "grafico": {
       "tipo": "lineas",
       "titulo": "Patentes pedidas por residentes",
       "datos": {
        "fuente": "wdi",
        "indicador": "IP.PAT.RESD",
        "paises": [
         "KOR",
         "CHL"
        ],
        "desde": 1980,
        "hasta": 2024,
        "etiqueta": "Solicitudes de patentes de residentes",
        "unidad": "solicitudes"
       },
       "destacar": {
        "pais": "CHL"
       },
       "anotaciones": [
        {
         "anio": 1980,
         "texto": "Corea: unas 1.200"
        },
        {
         "anio": 2024,
         "texto": "Corea: casi 196.000"
        }
       ],
       "formato": {
        "decimales": 0,
        "escala": "log"
       },
       "dice": "patentes;"
      },
      "cifras": [
       {
        "texto": "unas 1.200 patentes",
        "valor": 1240,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "IP.PAT.RESD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1980,
          "hasta": 2024,
          "etiqueta": "Solicitudes de patentes de residentes",
          "unidad": "solicitudes"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 1980
        }
       },
       {
        "texto": "unas 140",
        "valor": 140,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "IP.PAT.RESD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1980,
          "hasta": 2024,
          "etiqueta": "Solicitudes de patentes de residentes",
          "unidad": "solicitudes"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 1980
        }
       },
       {
        "texto": "casi 196.000",
        "valor": 195800,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "IP.PAT.RESD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1980,
          "hasta": 2024,
          "etiqueta": "Solicitudes de patentes de residentes",
          "unidad": "solicitudes"
         },
         "operacion": "valor",
         "pais": "KOR",
         "anio": 2024
        }
       },
       {
        "texto": "unas 390",
        "valor": 390,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "IP.PAT.RESD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1980,
          "hasta": 2024,
          "etiqueta": "Solicitudes de patentes de residentes",
          "unidad": "solicitudes"
         },
         "operacion": "valor",
         "pais": "CHL",
         "anio": 2024
        }
       },
       {
        "texto": "más del doble de habitantes",
        "valor": 2.6,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "SP.POP.TOTL",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 2024,
          "hasta": 2024,
          "etiqueta": "Población",
          "unidad": "personas"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 2024
        },
        "tolerancia": 0.1
       },
       {
        "texto": "cientos de veces",
        "valor": 502,
        "calculo": {
         "datos": {
          "fuente": "wdi",
          "indicador": "IP.PAT.RESD",
          "paises": [
           "KOR",
           "CHL"
          ],
          "desde": 1980,
          "hasta": 2024,
          "etiqueta": "Solicitudes de patentes de residentes",
          "unidad": "solicitudes"
         },
         "operacion": "razon",
         "pais": "KOR",
         "paisB": "CHL",
         "anio": 2024
        }
       }
      ],
      "fuenteEnVoz": true
     },
     {
      "tipo": "significado",
      "texto": "¿Qué quiere decir esto para alguien que vive en Santiago, Lima o Bogotá? Que en estos datos el ingreso no siguió a lo que el país tenía bajo tierra, ni solo a cuánta gente mandaba a la universidad. Siguió a lo que su economía aprendió a fabricar y a cuánto guardó para lograrlo. No es una receta: Corea también tuvo una guerra, ayuda extranjera y gobiernos militares. Pero deja una pregunta útil para leer cualquier noticia de crecimiento: qué produce el país, y no solo qué extrae. Y una segunda pregunta, menos cómoda: cuánto de lo que produce se queda trabajando para el año siguiente."
     },
     {
      "tipo": "reenganche",
      "texto": "Falta una pieza. Hay un indicador que separa a los dos países justo donde la matrícula los junta, y rara vez entra en esta comparación."
     }
    ]
   }
  ],
  "numeroQueNadieMira": {
   "texto": "Y queda el número que nadie mira. Corea dedica casi un 5 % de su economía a investigación y desarrollo. Chile, doce veces menos: no llega a medio punto. Según el Banco Mundial, en 2007 esa brecha era de nueve veces; en 2022, de doce. No se está cerrando: se está abriendo. Una universidad forma personas. La investigación convierte lo que esas personas saben en productos que otros quieren pagar.",
   "grafico": {
    "tipo": "comparacion",
    "titulo": "Investigación y desarrollo, 2022 (% del PIB)",
    "datos": {
     "fuente": "wdi",
     "indicador": "GB.XPD.RSDV.GD.ZS",
     "paises": [
      "KOR",
      "CHL"
     ],
     "desde": 2022,
     "hasta": 2022,
     "etiqueta": "Gasto en investigación y desarrollo (% del PIB)",
     "unidad": "%"
    },
    "destacar": {
     "pais": "CHL"
    },
    "formato": {
     "sufijo": " %",
     "decimales": 2
    },
    "dice": "investigación"
   },
   "cifras": [
    {
     "texto": "casi un 5 %",
     "valor": 4.85,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "GB.XPD.RSDV.GD.ZS",
       "paises": [
        "KOR",
        "CHL"
       ],
       "desde": 2007,
       "hasta": 2022,
       "etiqueta": "Gasto en investigación y desarrollo (% del PIB)",
       "unidad": "%"
      },
      "operacion": "valor",
      "pais": "KOR",
      "anio": 2022
     }
    },
    {
     "texto": "doce veces menos",
     "valor": 12,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "GB.XPD.RSDV.GD.ZS",
       "paises": [
        "KOR",
        "CHL"
       ],
       "desde": 2007,
       "hasta": 2022,
       "etiqueta": "Gasto en investigación y desarrollo (% del PIB)",
       "unidad": "%"
      },
      "operacion": "razon",
      "pais": "KOR",
      "paisB": "CHL",
      "anio": 2022
     }
    },
    {
     "texto": "de nueve veces",
     "valor": 8.9,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "GB.XPD.RSDV.GD.ZS",
       "paises": [
        "KOR",
        "CHL"
       ],
       "desde": 2007,
       "hasta": 2022,
       "etiqueta": "Gasto en investigación y desarrollo (% del PIB)",
       "unidad": "%"
      },
      "operacion": "razon",
      "pais": "KOR",
      "paisB": "CHL",
      "anio": 2007
     }
    }
   ]
  },
  "remate": "Chile exportó lo que le dio la naturaleza. Corea exportó lo que aprendió a hacer.",
  "siguiente": "En 1895, un argentino producía más que un alemán y que un francés. ¿Cómo se pierde una ventaja así? Eso viene en el próximo video.",
  "miniatura": {
   "texto": "3 VECES MÁS RICO",
   "grafico": {
    "tipo": "lineas",
    "titulo": "Chile vs Corea",
    "datos": {
     "fuente": "wdi",
     "indicador": "NY.GDP.PCAP.KD",
     "paises": [
      "CHL",
      "KOR"
     ],
     "desde": 1960,
     "hasta": 2024,
     "etiqueta": "PIB por persona (US$ constantes de 2015)",
     "unidad": "US$"
    },
    "destacar": {
     "pais": "CHL"
    }
   }
  },
  "fuentes": [
   {
    "texto": "Banco Mundial, World Development Indicators: PIB per cápita, US$ constantes de 2015 (NY.GDP.PCAP.KD), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NY.GDP.PCAP.KD?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: PIB per cápita, PPA, US$ internacionales constantes de 2021 (NY.GDP.PCAP.PP.KD), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD?locations=CL-KR"
   },
   {
    "texto": "Our World in Data: PIB per cápita (Maddison Project Database 2023, Bolt y van Zanden), CC BY 4.0",
    "url": "https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Exportaciones de bienes y servicios, % del PIB (NE.EXP.GNFS.ZS), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NE.EXP.GNFS.ZS?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Exportaciones de minerales y metales, % de las exportaciones de mercancías (TX.VAL.MMTL.ZS.UN), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/TX.VAL.MMTL.ZS.UN?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Exportaciones de manufacturas, % de las exportaciones de mercancías (TX.VAL.MANF.ZS.UN), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/TX.VAL.MANF.ZS.UN?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Exportaciones de alimentos, % de las exportaciones de mercancías (TX.VAL.FOOD.ZS.UN), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/TX.VAL.FOOD.ZS.UN?locations=CL"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Formación bruta de capital, % del PIB (NE.GDI.TOTL.ZS), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NE.GDI.TOTL.ZS?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Solicitudes de patentes de residentes (IP.PAT.RESD), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/IP.PAT.RESD?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Población total (SP.POP.TOTL), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/SP.POP.TOTL?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Matrícula terciaria, % bruto (SE.TER.ENRR), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/SE.TER.ENRR?locations=CL-KR"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: Gasto en investigación y desarrollo, % del PIB (GB.XPD.RSDV.GD.ZS), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/GB.XPD.RSDV.GD.ZS?locations=CL-KR"
   }
  ]
 }
}
```

### Ejemplo `grafico` — pendiente-grafico-irlanda-consumo (contenido/backlog/grafico-irlanda-consumo.json)

```json
{
 "plantilla": "grafico",
 "id": "pendiente-grafico-irlanda-consumo",
 "titulo": "Irlanda produce el doble que Alemania. Gasta lo mismo",
 "descripcion": "¿Por qué un irlandés consume lo mismo que un alemán si el PIB de Irlanda por persona es casi el doble?\n\nEl consumo de los hogares por persona, del Banco Mundial, cuenta otra historia que el PIB: la de lo que llega a la mesa.\nLa autopsia completa del PIB irlandés, con patentes, Apple e ingreso nacional, está en el video largo.\n\nFuentes: Banco Mundial, WDI, NE.CON.PRVT.PC.KD y NY.GDP.PCAP.PP.CD (CC BY 4.0) https://data.worldbank.org/indicator/NE.CON.PRVT.PC.KD?locations=IE-DE\n\nVoz sintetizada. Gráfico generado a partir de datos abiertos.\nNo es asesoría financiera: el video describe lo que muestran los datos.",
 "hashtags": [
  "#shorts",
  "#economia",
  "#irlanda",
  "#pib"
 ],
 "props": {
  "id": "pendiente-grafico-irlanda-consumo",
  "gancho": {
   "texto": "Según el Banco Mundial, el PIB por persona de Irlanda es casi el doble que el de Alemania.",
   "rotulo": "PIB ×2",
   "cifras": [
    {
     "texto": "casi el doble",
     "valor": 1.9,
     "calculo": {
      "datos": {
       "fuente": "wdi",
       "indicador": "NY.GDP.PCAP.PP.CD",
       "paises": [
        "IRL",
        "DEU"
       ],
       "desde": 2024,
       "hasta": 2024,
       "etiqueta": "PIB por persona (PPA, US$ internacionales corrientes)",
       "unidad": "US$"
      },
      "operacion": "razon",
      "pais": "IRL",
      "paisB": "DEU",
      "anio": 2024
     }
    }
   ]
  },
  "grafico": {
   "tipo": "lineas",
   "titulo": "Consumo de los hogares por persona",
   "datos": {
    "fuente": "wdi",
    "indicador": "NE.CON.PRVT.PC.KD",
    "paises": [
     "IRL",
     "DEU"
    ],
    "desde": 2000,
    "hasta": 2024,
    "etiqueta": "Consumo de los hogares por persona (US$ constantes de 2015)",
    "unidad": "US$"
   },
   "destacar": {
    "pais": "IRL"
   },
   "formato": {
    "prefijo": "US$ ",
    "decimales": 0
   }
  },
  "escenas": [
   {
    "tipo": "dato",
    "texto": "Ahora mira lo que gasta cada persona en su vida diaria, que el Banco Mundial también publica: comida, casa, transporte. Esta es Irlanda. Esta es Alemania.",
    "grafico": {
     "tipo": "lineas",
     "titulo": "Consumo de los hogares por persona",
     "datos": {
      "fuente": "wdi",
      "indicador": "NE.CON.PRVT.PC.KD",
      "paises": [
       "IRL",
       "DEU"
      ],
      "desde": 2000,
      "hasta": 2024,
      "etiqueta": "Consumo de los hogares por persona (US$ constantes de 2015)",
      "unidad": "US$"
     },
     "destacar": {
      "pais": "IRL"
     },
     "formato": {
      "prefijo": "US$ ",
      "decimales": 0
     },
     "dice": "Irlanda."
    },
    "fuenteEnVoz": true
   },
   {
    "tipo": "giro",
    "texto": "Van pegadas. En 2024, un irlandés consumía unos 24.000 dólares al año. Un alemán, prácticamente lo mismo.",
    "cifras": [
     {
      "texto": "unos 24.000 dólares",
      "valor": 24000,
      "calculo": {
       "datos": {
        "fuente": "wdi",
        "indicador": "NE.CON.PRVT.PC.KD",
        "paises": [
         "IRL",
         "DEU"
        ],
        "desde": 2000,
        "hasta": 2024,
        "etiqueta": "Consumo de los hogares por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "operacion": "valor",
       "pais": "IRL",
       "anio": 2024
      }
     },
     {
      "texto": "prácticamente lo mismo",
      "valor": 1,
      "calculo": {
       "datos": {
        "fuente": "wdi",
        "indicador": "NE.CON.PRVT.PC.KD",
        "paises": [
         "IRL",
         "DEU"
        ],
        "desde": 2000,
        "hasta": 2024,
        "etiqueta": "Consumo de los hogares por persona (US$ constantes de 2015)",
        "unidad": "US$"
       },
       "operacion": "razon",
       "pais": "IRL",
       "paisB": "DEU",
       "anio": 2024
      }
     }
    ],
    "rotulo": {
     "texto": "LO MISMO",
     "dice": "pegadas."
    }
   },
   {
    "tipo": "dato",
    "texto": "La diferencia del PIB es de empresas extranjeras que registran en Dublín sus patentes y sus ganancias. Se cuentan en Irlanda. No se quedan en Irlanda.",
    "grafico": {
     "tipo": "comparacion",
     "titulo": "PIB por persona, 2024",
     "datos": {
      "fuente": "wdi",
      "indicador": "NY.GDP.PCAP.PP.CD",
      "paises": [
       "IRL",
       "DEU"
      ],
      "desde": 2024,
      "hasta": 2024,
      "etiqueta": "PIB por persona (PPA, US$ internacionales corrientes)",
      "unidad": "US$"
     },
     "destacar": {
      "pais": "IRL"
     },
     "formato": {
      "prefijo": "US$ ",
      "decimales": 0
     },
     "dice": "PIB"
    },
    "cifras": [
     {
      "texto": "La diferencia del PIB",
      "valor": 1.9,
      "calculo": {
       "datos": {
        "fuente": "wdi",
        "indicador": "NY.GDP.PCAP.PP.CD",
        "paises": [
         "IRL",
         "DEU"
        ],
        "desde": 2024,
        "hasta": 2024,
        "etiqueta": "PIB por persona (PPA, US$ internacionales corrientes)",
        "unidad": "US$"
       },
       "operacion": "razon",
       "pais": "IRL",
       "paisB": "DEU",
       "anio": 2024
      }
     }
    ]
   }
  ],
  "remate": "En el PIB, Irlanda vale dos Alemanias. En el supermercado, vale una.",
  "fuentes": [
   {
    "texto": "Banco Mundial, World Development Indicators: Consumo final de los hogares per cápita, US$ constantes de 2015 (NE.CON.PRVT.PC.KD), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NE.CON.PRVT.PC.KD?locations=IE-DE"
   },
   {
    "texto": "Banco Mundial, World Development Indicators: PIB per cápita, PPA (NY.GDP.PCAP.PP.CD), CC BY 4.0",
    "url": "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD?locations=IE-DE"
   }
  ],
  "enlaceLargo": "pendiente-tesis-irlanda-pib"
 }
}
```

<!-- EJEMPLOS:FIN -->

## 13. Mejora continua

Tras cada tanda de 5 largos (skill `mejora-continua-canal`): por video, anota estructura, tipo de gancho, palabras, retención a
los 30 s y media, caída por capítulo y CTR; un patrón entra a este archivo si aparece en ≥ 3 videos o la diferencia es ≥ 2×.
Cada cambio se fecha aquí y en `docs/DECISIONES.md`. Lo que vale para cualquier canal va a la skill `guiones-de-video`.

- 2026-11-05 · Primeros 3 largos + 4 Shorts escritos a mano. El revisor (claude -p con la rúbrica) bajó Verdad a 3 en los tres
  por: causalidad sin matiz, indicador mal nombrado ("apertura", "títulos"), año base raro sin contexto y "las dos líneas" con un
  solo indicador en pantalla. Todo eso está ahora en §2, §7 y §9.
- 2026-11-05 · `verificar-cifras` bloqueó los años de escolaridad de OWID (Barro-Lee, licencia no CC BY): el capítulo de
  educación de Chile/Corea se reescribió con matrícula (`SE.TER.ENRR`) y patentes (`IP.PAT.RESD`). Mirar el catálogo antes.
- 2026-11-05 · La verificación contra la API desmintió dos ideas del banco: "Corea gana el triple que Chile" (es 2,5× en US$
  constantes y 1,8× en PPA) y "Panamá, el más rico de Latinoamérica" (Guyana lo supera). **Verificar el título antes de escribir.**
