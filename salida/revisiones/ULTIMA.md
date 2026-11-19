# Revisión 2026-11-19 — ritual del jueves (semana asegurada 23→29), regla "cerrar frentes"

## Detectado
- **GTA 6: sin cifras oficiales de ventas** al jue 19-11 14:00 (lanzamiento hoy). Take-Two solo habló de preventas "sin precedentes" sin
  unidades; lo que circula (18–20 M en 24 h, US$ 3.300–5.200 M) son estimaciones o rumores. Regla de contingencia → el largo del jue 26 es Nueva Zelanda.
- Programados verificados por API: Short GTA `AgGIMWE67oI` vie 20 13:00, Venezuela `PpkBOxDMuLg` vie 20 19:00, Irlanda `3m2VqXoQIO0` lun 23 19:00.
- La carátula molde de Argentina (pedido del 18-11 23:41) no llegó; no se re-despertó (orden de la sesión principal).
- El generador falló 2 intentos por: "el fin de" en un título de capítulo ("fin del mundo" cae en la lista de catastrofismo), "invierte"
  en la voz (lista de consejo financiero), enumeraciones sin iconos y `dice` de mapa tardío (6,5 s). Con esos errores en el `--tema`, el 3.er intento pasó.

## Mejorado
- Nada nuevo (regla del dueño del 19-11: cerrar frentes).

## Herramientas exploradas
- Ninguna nueva.

## Agregado
- Guion `contenido/backlog/tesis-por-que-nueva-zelanda-se-hizo-rica.json` (escena de arranque: velero Dunedin, Port Chalmers, 15-02-1882).
  `verificar-cifras` ✓, `--revisar` sin problemas, revisor independiente (Sonnet): ronda 1 Verdad 4 (4 correcciones: "desde 1850" falso,
  "medio siglo", la guerra aún en curso en 1882, crisis del petróleo), ronda 2 **aprobado 4,57** (Verdad 5).
- Carátula GPT del molde (dos mapas + ¿POR QUÉ?), llegó en 4 min, revisada a ojo: `salida/caratulas/nueva-zelanda-chile.png` (+ `.prompt.txt`).
- Render en la nube (run 44581244730, 12 min, 10:31) y subida por Studio bajo `piloto.lock`: **`n8fV62smf04`, publishAt 2026-11-26T22:00Z** (Studio lo dejó sin fecha; puesto y verificado por API). Carátula también por API (`miniatura.mts`).
- `docs/PLAN-SEMANAL.md`: semana 23→29 cerrada, GTA descartado y esqueleto 30-11 → 06-12.

## Pendiente
- `producir.yml`: el artifact pisa el json de bandeja con el guion promovido (mismo nombre); hoy se rehízo local con `preparar-tesis`. Arreglar en la próxima sesión de mejoras (copiar el guion con otro nombre).
- Pausas publicitarias (4:41, 6:45, 9:33) y pantalla final de Nueva Zelanda: a mano en Studio.
- Carátula Argentina molde (`BQNaK5R-yrk`): sin llegar.
- Medir el 25-11 el CTR de los 5 retitulados y, desde el 03-12, el de Nueva Zelanda (meta CTR ≥ 4,5 %).
- Comentario fijado de cada largo el día que sale (la API da 403 en privados).
