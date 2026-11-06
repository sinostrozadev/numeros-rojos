# Banco de ideas inicial — En Números Rojos

**Escrito:** 2026-11-05 (noche) por el agente de guiones. Cada cifra de este archivo se consultó esa noche contra la API del
Banco Mundial (`https://api.worldbank.org/v2/country/<ISO3>/indicator/<CÓDIGO>?format=json`, última actualización de WDI:
**2026-10-08**, que ya trae datos de 2025) o contra el CSV del grapher de Our World in Data
(`https://ourworldindata.org/grapher/<slug>.csv?v=1&csvType=full&useColumnShortNames=true`). Formato: `CÓDIGO · país año = valor`.
Sin FMI, sin Numbeo, sin OCDE. Las cifras se redondean al escribir el guion; las de aquí son las del dataset.

Atajos: **MAD** = OWID `gdp-per-capita-maddison-project-database` (US$ internacionales de 2011) · **PPA-KD** = WDI `NY.GDP.PCAP.PP.KD` (US$ internacionales de 2021) ·
**KD** = WDI `NY.GDP.PCAP.KD` (US$ de 2015) · **DEF** = WDI `NY.GDP.DEFL.KD.ZG` (inflación por deflactor, % anual).

Leyenda: ✅ = ya escrito en `contenido/backlog/` · 🔥 = **sirve esta semana** (dato recién publicado o contingente) ·
estructura según `src/plantillas/comun/guion.ts` (`comparacion`, `linea-de-tiempo`, `autopsia`, `cuanto-rinde`).
Rotación: en estas 20 hay 6 comparacion, 5 linea-de-tiempo, 5 autopsia y 4 cuanto-rinde (ninguna > 40 %).

**Correcciones que dejó la verificación** (no repetirlas): (1) "Corea gana el **triple** que Chile" es **falso** con cualquier
medida: KD 2024 = 2,5×, PPA-KD 2024 = 1,8×; lo que sí es el triple es **Chile sobre Corea en 1960** (KD 3,1×). (2) "Panamá, el más
rico de Latinoamérica" es falso: **Guyana** PPA-KD 2024 = 70.520 > Panamá 36.390. (3) Panamá **sí tiene cobre** (mina Cobre Panamá).
(4) Chile no pasó a Argentina "para siempre" en 1995: en MAD Argentina vuelve adelante en 2010–2011. (5) Los años de escolaridad de OWID (`mean-years-of-schooling-long-run`, Barro-Lee) **no son CC BY**: prohibidos. (6) WDI ya no publica
`PA.NUS.PPPC.RF` (nivel de precios): usar PIB nominal vs PPA (`NY.GDP.PCAP.CD` vs `NY.GDP.PCAP.PP.CD`) y nombrarlo así.

## A. 20 ideas de LARGO (`tesis`, 9–12 min)

| # | Título (≤ 60) | Estructura | Pregunta | Tesis en una frase | 3 datos clave verificados |
|---|---|---|---|---|---|
| 1 ✅ | Chile era 3 veces más rico que Corea. ¿Qué pasó? | comparacion | ¿Qué hizo Corea que Chile no hizo? | El ingreso siguió a lo que cada país aprendió a fabricar y a cuánto guardó para construir, no a la educación ni a la apertura, donde Chile partió ganando | KD 1960: CHL 3.223 / KOR 1.038 (3,1×) · KD 2024: KOR 37.050 / CHL 14.620 (2,5×) · `GB.XPD.RSDV.GD.ZS` 2022: KOR 4,85 / CHL 0,39 (12×) |
| 2 ✅ | Argentina era más rica que Alemania. ¿Qué pasó después? | linea-de-tiempo | ¿En qué año se dio vuelta la cuenta? | No hubo un año: Argentina creció más lento 60 años y después perdió en cada crisis parte de lo ganado | MAD 1895: ARG 5.384 / DEU 4.281 (1,26×), 4.ª de 8 · MAD 2022: ESP 34.123 / ARG 18.292 (1,87×), 8.ª de 8 · DEF ARG 1989 = 3.046 % |
| 3 ✅🔥 | Irlanda creció un 25 % en un año. Su gente, un 2 % | autopsia | ¿Dónde quedó el crecimiento? | El PIB irlandés mide ganancias de multinacionales que pasan por Dublín; el consumo de su gente es el de Alemania | `NY.GDP.MKTP.KD.ZG` IRL 2015 = 24,6 % (y **2025 = 12,3 %**, dato nuevo) · `NY.GNP.PCAP.PP.CD` IRL 2024 = 105.770 vs PIB 140.779 · `NE.CON.PRVT.PC.KD` 2024: IRL 24.180 / DEU 23.730 |
| 4 | Panamá pasó a Chile en 2012. ¿Cómo lo hizo? (ángulo: el Canal y los servicios; Panamá sí tiene cobre) | autopsia | ¿Crecimiento real o un caso Irlanda? | Panamá creció por servicios (Canal, logística, banca) y, a diferencia de Irlanda, casi todo se queda | PPA-KD 1990: PAN 10.264 < CHL 10.955 · PPA-KD 2024: PAN 36.395 / CHL 30.268 (1,20×) · `NY.GNP.PCAP.PP.CD` / `NY.GDP.PCAP.PP.CD` PAN 2024 = 39.210 / 41.430 |
| 5 | Venezuela tenía el doble que España en 1960. Hoy, un sexto | linea-de-tiempo | ¿Cómo se pierde más de la mitad del ingreso con petróleo? | El petróleo financió el ingreso sin diversificarlo; cuando bajó la renta, no quedó otra pata | MAD 1960: VEN 12.116 / ESP 5.032 (2,4×) · MAD 2022: VEN 5.267 (−57 % desde 1960) · `NY.GDP.PETR.RT.ZS` VEN 1974 = 33,3 % del PIB |
| 6 | Noruega y Venezuela: el mismo petróleo, dos destinos | comparacion | ¿Por qué el petróleo enriqueció a uno y no al otro? | Noruega ahorró la renta fuera de su economía; Venezuela la gastó dentro | MAD 1960: VEN 12.116 > NOR 11.483 · MAD 2022: NOR 88.366 / VEN 5.267 (17×) · `NY.GDP.PETR.RT.ZS` 1980: VEN 33,6 % / NOR 5,7 % |
| 7 | Uruguay era más pobre que Argentina. Hoy le gana | comparacion | ¿Qué hizo el vecino chico? | Uruguay creció menos en los años buenos pero retrocedió menos en los malos | MAD 1960: URY 7.643 < ARG 8.861 · MAD 2022: URY 20.182 > ARG 18.292 · PPA-KD 2024: URY 32.149 / ARG 26.770 (1,20×) |
| 8 | Bolivia tenía 15.000 millones en reservas. Le quedan 2.000 | autopsia | ¿Cómo se queda un país sin dólares? | El gas pagó un tipo de cambio fijo; cuando cayó la producción, las reservas lo sostuvieron hasta agotarse | `FI.RES.TOTL.CD` BOL 2014 = 15.130 M US$ · BOL 2023 = 1.800 M US$ (−88 %) · BOL 2024 = 1.977 M US$ |
| 9 🔥 | México firmó el TLCAN en 1994 y creció un 19 % en 30 años | autopsia | ¿Por qué exportar más no subió el ingreso? | México multiplicó sus exportaciones ensamblando lo que otros diseñan; el ingreso por persona casi no se movió | `NE.EXP.GNFS.ZS` MEX 1993 = 11,6 % → 2024 = 37,3 % · PPA-KD MEX 1994 = 18.420 → 2024 = 21.970 (+19 %) · PPA-KD CHL 1994→2024 = +118 % · **`NY.GDP.MKTP.KD.ZG` MEX 2025 = 0,56 %** (dato nuevo) |
| 10 | Perú tuvo 6.000 % de inflación. Hoy tiene la más baja | linea-de-tiempo | ¿Cómo se pasa de la hiperinflación a la estabilidad? | La estabilidad peruana se construyó en una década y resistió crisis políticas | DEF PER 1990 = 6.261 % · DEF PER 2024 = 5,4 % · `FP.CPI.TOTL.ZG` PER 2025 = 1,5 % (la más baja entre CHL/COL/MEX/BRA; dato nuevo) 🔥 |
| 11 | Cuánto rinde un dólar en cada país de Sudamérica | cuanto-rinde | ¿Dónde alcanza más lo que se gana? | El PIB en dólares engaña: corregido por precios, Bolivia o Colombia "valen" casi el triple | `NY.GDP.PCAP.PP.CD` / `NY.GDP.PCAP.CD` 2024: BOL 12.896 / 4.421 (2,9×) · COL 22.439 / 7.951 (2,8×) · URY 36.597 / 24.308 (1,5×) |
| 12 | ¿Por qué Uruguay es el país más caro de Sudamérica? | cuanto-rinde | ¿Por qué el mismo sueldo rinde menos en Montevideo? | Uruguay es rico y caro a la vez: su PPA apenas supera su PIB nominal | (mismo par de indicadores) URY 1,51× vs CHL 2,17×, ARG 2,18×, PER 2,10× (2024) · PPA-KD URY 2024 = 32.149 |
| 13 | Japón lleva 30 años sin crecer. Los datos dicen otra cosa | linea-de-tiempo | ¿Japón está estancado? | Por persona y descontando su población que envejece, Japón creció poco, pero no cero | KD JPN 1991 = 29.780 → 2024 = 37.980 (+28 %) · KD KOR 1991 = 10.620 → 2024 = 37.050 (Corea ya casi lo iguala) · `SP.POP.65UP.TO.ZS` JPN 2024 = 29,8 % |
| 14 | Corea tiene 0,7 hijos por mujer. Chile ya está en 1,1 | comparacion | ¿Qué pasa con una economía cuando no nacen niños? | Chile va por el camino de Corea más rápido de lo que se cree, y con menos ingreso | `SP.DYN.TFRT.IN` KOR 2023 = 0,72 · CHL 2024 = 1,14 (bajo Japón: 1,15) · `SP.POP.65UP.TO.ZS` CHL 1990 = 6,0 % → 2024 = 14,1 % |
| 15 | El país donde una de cada cuatro monedas viene de afuera | autopsia | ¿Qué pasa cuando una economía vive de remesas? | En Centroamérica, las remesas ya pesan como una industria entera, y amortiguan pero no construyen | `BX.TRF.PWKR.DT.GD.ZS` 2024: NIC 26,6 % · HND 25,7 % · SLV 24,3 % (GTM 19,1 %; MEX 3,7 %) |
| 16 | Desde 2010, los precios en Chile subieron un 85 % | cuanto-rinde | ¿Cuánto subieron los precios en 15 años? | La inflación "baja" de la región acumulada en 15 años casi duplica los precios (ojo: no decir que "el sueldo perdió X": los sueldos también subieron; sin serie de salarios con licencia, no se afirma) | `FP.CPI.TOTL` (2010 = 100) 2025: BRA 234,4 · COL 206,4 · MEX 191,5 · CHL 185,5 · PER 165,5 |
| 17 | En 1990 China era 7 veces más pobre que América Latina | comparacion | ¿Cómo se adelanta en 30 años? | China invirtió y fabricó como Corea, pero a escala continental | PPA-KD 1990: CHN 1.667 / LCN 12.430 (7,5×) · PPA-KD 2024: CHN 23.840 > LCN 19.950 · KD sirve como control |
| 18 | Colombia es más desigual que Brasil. ¿Cómo se mide eso? | cuanto-rinde | ¿Qué dice el índice de Gini y qué no? | El Gini resume la desigualdad de ingreso en un número; Colombia y Brasil encabezan la región, Uruguay y Perú la cierran | `SI.POV.GINI` 2024: COL 54,4 · BRA 50,3 · URY 40,0 · PER 40,1 |
| 19 | Ecuador se dolarizó con 96 % de inflación. Hoy tiene 1,5 % | linea-de-tiempo | ¿Qué hizo el dólar en Ecuador? | Dolarizar mató la inflación de golpe, a costa de perder la política monetaria | `FP.CPI.TOTL.ZG` ECU 2000 = 96,1 % · ECU 2024 = 1,5 % · PAN (dolarizado desde 1904) 2024 = 0,7 % |
| 20 | El cobre es una sexta parte de la economía chilena | autopsia | ¿Cuánto depende Chile de la minería? | La renta minera pesa como pocas en el mundo y explica los ciclos de Chile mejor que cualquier gobierno | `NY.GDP.MINR.RT.ZS` CHL 1990 = 9,5 % · CHL 2006 = 16,9 % · CHL 2021 = 16,2 % · `TX.VAL.MMTL.ZS.UN` CHL 2024 = 55,7 % |

Notas por idea: #4 se cruza con el `siguiente` de #3 (Irlanda → Panamá): es el próximo largo natural. #5 y #6 comparten datos: no
publicarlos en la misma semana. #8: verificar Banco Central de Bolivia solo con cita (licencia sin revisar). #9 y #10 llevan dato 2025
recién publicado (contingencia de esta semana). #11–#12 y #16 son la serie "Cuánto rinde tu sueldo".

## B. 20 ideas de SHORT (`grafico`, 35–50 s: una cifra, un gráfico)

| # | Gancho (rótulo) | Gráfico | Cifra verificada | Largo al que enlaza |
|---|---|---|---|---|
| 1 ✅ | Chile le ganaba 3 a 1 a Corea (CHILE 3 · COREA 1) | lineas KD CHL/KOR 1960–2024 | KD 1960 3,1× → cruce 1982 (KOR/CHL 1,10) | #1 |
| 2 ✅ | España tenía la mitad que Argentina (ARGENTINA ×2) | lineas MAD ARG/ESP 1895–2022 | MAD 1895 2,08× → 1976 España pasa → 2022 1,87× | #2 |
| 3 ✅ | Irlanda produce el doble que Alemania, gasta lo mismo (PIB ×2) | lineas `NE.CON.PRVT.PC.KD` IRL/DEU | 2024: 24.180 vs 23.730 | #3 |
| 4 ✅ | Panamá pasó a Chile en 2012 (PANAMÁ, ÚLTIMO EN 1990) | lineas PPA-KD PAN/CHL/URY | 2024 PAN/CHL 1,20× | #4 |
| 5 | Argentina: 3.000 % de inflación en un año (3.000 %) | area DEF ARG 1961–2025 | DEF 1989 = 3.046 % · 2025 = 39 % 🔥 | #2 |
| 6 | Corea gasta 12 veces más en investigar (×12) | comparacion `GB.XPD.RSDV.GD.ZS` 2022 | KOR 4,85 % / CHL 0,39 % | #1 |
| 7 | Corea pide 500 veces más patentes que Chile (×500) | lineas `IP.PAT.RESD` KOR/CHL 1980–2024 (log) | 2024: KOR 195.800 / CHL 390 (1980: 1.241 / 140) | #1 |
| 8 | Irlanda: +25 %, −2,5 %, +12 % (¿FÁBRICAS?) | barras `NY.GDP.MKTP.KD.ZG` IRL 2014–2025 | 2015 24,6 · 2023 −2,5 · 2025 12,3 🔥 | #3 |
| 9 | Venezuela perdió más de la mitad desde 1960 (−57 %) | lineas MAD VEN 1950–2022 | 1960 12.116 → 2022 5.267 | #5 |
| 10 | Noruega y Venezuela partieron iguales (×17) | comparacion MAD 2022 NOR/VEN | 88.366 / 5.267 | #6 |
| 11 | Bolivia: de 15.000 a 2.000 millones (−88 %) | area `FI.RES.TOTL.CD` BOL 2005–2024 | 2014 15.130 M → 2023 1.800 M | #8 |
| 12 | México exporta 3 veces más que en 1993 (×3) | lineas `NE.EXP.GNFS.ZS` MEX | 11,6 % → 37,3 % del PIB | #9 |
| 13 | Perú: de 6.261 % a 1,5 % (6.261 %) | area DEF PER 1980–2024 | DEF 1990 = 6.261 % · IPC 2025 = 1,5 % 🔥 | #10 |
| 14 | Con el mismo dólar, Bolivia rinde el doble que Uruguay (×2) | barras PPA/nominal 2024 | BOL 2,9× · URY 1,5× | #11 |
| 15 | Japón: 33 años, +28 % (+28 %) | lineas KD JPN/KOR 1991–2024 | JPN 29.780 → 37.980 | #13 |
| 16 | Corea: 0,72 hijos por mujer (0,72) | lineas `SP.DYN.TFRT.IN` KOR/CHL 1960–2024 | KOR 1960 6,0 → 2023 0,72 | #14 |
| 17 | Uno de cada cuatro dólares de Nicaragua llega de afuera (26 %) | barras `BX.TRF.PWKR.DT.GD.ZS` 2024 | NIC 26,6 · HND 25,7 · SLV 24,3 | #15 |
| 18 | Chile: precios +85 % desde 2010 (+85 %) | lineas `FP.CPI.TOTL` CHL/PER/COL/MEX/BRA | CHL 2025 = 185,5 (2010 = 100) | #16 |
| 19 | China pasó a toda América Latina (×14) | lineas PPA-KD CHN/LCN 1990–2024 | CHN 1.667 → 23.840 | #17 |
| 20 | Ecuador: de 96 % a 1,5 % (96 %) | lineas `FP.CPI.TOTL.ZG` ECU/PAN 1995–2024 | 2000 96,1 → 2024 1,5 | #19 |

## C. Contingencia de esta semana (2026-11-06 → 2026-11-13)

- **Dato nuevo:** la actualización de WDI del 2026-10-08 ya trae **2025**. Ganchos que nadie ha usado: Irlanda volvió a crecer
  **12,3 %** en 2025 (Short #8, refuerza el largo #3); la inflación argentina por deflactor bajó de **207,6 % (2024) a 39,1 % (2025)**
  (Short #5); México creció **0,56 %** en 2025 frente al **2,3 %** de América Latina y el Caribe (`LCN`) (largo #9); Perú cerró 2025
  con **1,5 %** de inflación al consumidor (Short #13).
- **Calendario oficial a confirmar** (no verificado esta noche; mirarlo con búsqueda web antes de usarlo): IPC de octubre del INE de
  Chile y del INDEC de Argentina (mediados de noviembre). Si salen, sirven como gancho de un Short `grafico` con fuente `manual` y URL
  del organismo, nunca como largo.
