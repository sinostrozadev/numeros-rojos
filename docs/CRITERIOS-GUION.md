# Criterios de guion — En Números Rojos (BORRADOR INCOMPLETO, 2026-11-13)
> Quedó a medias porque se alcanzó el límite de uso. Base: `docs/GUION.md` §2, §3, §4, §6, §9, §11.

## 1. Bloqueantes
| # | Criterio | ¿Lo comprueba una máquina? |
|---|---|---|
| B1 | Valida `EnvoltorioTesis` / `EnvoltorioGrafico` (palabras, giros, reenganches, cifras ≥ 6) | sí: generador / `--revisar` |
| B2 | Toda cifra de la voz y del título cuadra con el dataset (tolerancia 5 %) | sí: `npx tsx scripts/verificar-cifras.mts <guion>` |
| B3 | Ritmo y visuales: espera ≤ 3 s, nada fijo > 12 s, 4–8 fotos, `dice` literal | sí: `npx tsx scripts/generar-guiones.mts --revisar <guion>` |
| B4 | Solo fuentes permitidas (WDI, OWID/Maddison, oficiales); nada del FMI ni de Numbeo | parcial: catálogo |
| B5 | Sin consejo, sin catastrofismo, sin bando político, sin "experto"; causalidad con matiz | parcial: lista negra; el resto, revisor |
| B6 | Duración: tesis 1.350–1.950 palabras (≥ 8 min reales); Short 85–120 palabras habladas (≤ 55 s) | sí: zod y `preparar-*` |
| B7 | Short derivado: texto 100 % nuevo + `enlaceLargo` | no: revisor |

## 2. Rúbrica 1–5
| Criterio | 1 | 3 | 5 |
|---|---|---|---|
| Gancho | contradicción en la 3.ª frase | en la 1.ª frase, sin cifras | contradicción medible en la 1.ª frase con las dos cifras; rótulo legible |
| Claridad | indicadores mal nombrados | unidades dichas a medias | unidad clara en la 1.ª mención; escala humana tras cada cifra abstracta |
| Verdad | — | — | 5 obligatorio (cualquier duda = bloqueante) |
| Ritmo / visual | foto fija, esperas | sin errores, pocas fotos | gráficos de ≥ 4 tipos, sellos, iconos en cada enumeración |
| Giro por capítulo | ausente | dato flojo | el dato que cambia la lectura, con cifra |
| Cierre | pide algo | remate sin espejo | número que nadie mira + remate espejo + `siguiente` con gancho |
| Parecido a Los Ecomonos | lejos | similar | iguala su enganche y gana en fuentes |

## 3. Umbral
Todos los bloqueantes, Verdad = 5, promedio ≥ 4,3 en el largo (≥ 4 en el Short) y ninguno < 3. En el largo, 2 rondas de revisor como mínimo; si a la 2.ª no pasa, el guion se descarta.

## 4. Veredicto
JSON común (`/home/santiago/projects/yt/_propuestas/revisor-de-guiones.md`), con `"canal":"numeros-rojos"`.

## 5. Ejemplos
- **Aprobaría:** `contenido/guiones/2026-11-08-tesis-argentina-rica-v3.json`: cifras ✓ y `--revisar` sin problemas.
- **No aprobaría:** `contenido/guiones/2026-11-07-tesis-chile-corea-v2.json`: cifras ✓, pero `--revisar` da 20 problemas de ritmo (8,7 s de espera antes de un gráfico, entre otros). Es el que Santiago criticó.
- Caso límite: `2026-11-07-tesis-chile-corea-v4.json`, aprobado por Santiago, hoy falla B3 por tener 3 fotos (la regla de 4–8 fotos es posterior). La v5 está en reserva.

## 6. Preferencias de Santiago
- v4 "está demasiado bueno"; pidió más fotos ("más imágenes, le dan un toque genial") y voz sin cambio de tono (11-08).
- Cifras con miles en palabras para la voz (es-MX lee "1.000" como decimal).
- Tarjetas sin fundido; viaje de mapa sin línea; el primer gráfico con un título claro.
- Miniatura: el sujeto debe leerse sin el título (11-08).
