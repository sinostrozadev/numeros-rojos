# Monetización — cumplimiento de En Números Rojos (skill `monetizacion-youtube`) — 2026-11-05

Nicho **finanzas/economía = YMYL**: el escrutinio es mayor que en geografía o curiosidades. Las reglas de abajo son "pasa o no
sube". Políticas leídas: support.google.com/youtube/answer/72851 (requisitos YPP) y /answer/1311392 (monetización), 2026-11-05.
Próxima relectura: **2027-02-05** (cada 3 meses) y el 2027-02-01 por el cambio de umbrales.

## 0. Las reglas del juego que nos tocan

- **Desde el 2027-02-01:** entrar al YPP = 1.000 subs + **8.000 h** de largos en 365 d (o 20 M de vistas de Shorts en 90 d).
  Una postulación enviada antes del 2027-02-01 se juzga con 4.000 h / 10 M. **Los Shorts solo cobran reparto si el canal sostiene
  10 M de vistas de Shorts cada 90 días** → para nosotros los Shorts pagan ≈ 0: son embudo. El dinero son los largos.
- Aceptar los nuevos términos del YPP en Studio antes del 2027-01-31 si el canal ya estuviera dentro.
- Actividad mínima para no perder el YPP: 2 largos o 5 Shorts por 90 d (lo cumplimos de sobra).
- **Personajes IA en temas sensibles (aclaración 2026-07):** no es monetizable un canal que usa personas/personajes generados por
  IA para dar información de **finanzas**, salud, legal o política. → **Sin presentador, sin avatar, sin "experto", sin "yo".**

## 1. Lista por VIDEO (la valida el revisor + `scripts/verificar-cifras.mts`; si algo falla, no sube)

- [ ] **Idea distinta** a todo lo publicado y a la bandeja (título + gancho comparados; Jaccard < 0,8).
- [ ] **Tesis propia** y narrativa: gancho → pregunta + tesis → actos con giro → número que nadie mira → significado → cierre.
      No es lista de datos ni presentación de gráficos.
- [ ] **Sin consejo ni productos:** la voz nunca dice "invierte", "compra", "vende", "deberías", "te conviene"; no nombra
      brokers, bancos, criptomonedas ni fondos como opción. Se describe lo que muestran los datos.
- [ ] **Sin presentador / personaje IA / "experto"**; la voz no se presenta como persona ni dice "yo como economista".
- [ ] **Aviso "No es asesoría financiera."** en la pantalla final (`MARCA.aviso`) y en la descripción.
- [ ] **Cada cifra recalculada** contra su dataset (tolerancia 5 %); la que no pasa, no se dice.
- [ ] **Fuentes permitidas y citadas:** Banco Mundial WDI (CC BY 4.0), Our World in Data (CC BY 4.0, + proveedor original),
      Maddison Project 2023 (CC BY 4.0), organismos oficiales nacionales con URL (INE, INDEC, INEGI, DANE, bancos centrales, CEPAL, SEC).
      **Prohibido: FMI** (uso comercial exige permiso escrito), **Numbeo**, OCDE y Banco Central de Chile hasta verificar
      términos, cualquier dato "de memoria". "Fuente: …" bajo cada gráfico, en la voz ≥ 1 vez por capítulo, URL en la descripción.
- [ ] **≥ 2 tipos de gráfico** en el largo (líneas, barras, área, ranking, contador, comparación, mapa, tarjeta).
- [ ] **Sin catastrofismo** en título, miniatura, cabeceras y remates (`PROHIBIDAS_TITULO`); título y miniatura cumplen lo
      que prometen dentro del video.
- [ ] **Material propio:** gráficos por código, sin fotos de stock, sin clips de noticieros, sin logos de marcas, sin IA de imagen.
      Música y SFX sintetizados en Node.
- [ ] **Voz sintética declarada** en la descripción ("Voz sintetizada"). Gráficos animados + voz genérica no exigen la casilla
      "contenido alterado o sintético"; **si algún día se usa una imagen realista generada o una voz clonada, se marca.**
- [ ] **Largo ≥ 8:30** con capítulos con timestamps en la descripción; `reenganche` antes de cada límite de capítulo ≥ 2.
- [ ] **Mid-rolls manuales** en Studio en los límites de capítulo (nunca a mitad de frase), desde el primer día en el YPP.
- [ ] Short 35–50 s, gancho visible en el frame 0, zona segura, enlace al largo.
- [ ] Categoría **Educación (27)**; audiencia **no es para niños**; descripción distinta (no plantilla pegada).

## 2. Lista por TANDA / SEMANA (cada lunes; resultado en `salida/revisiones/<fecha>.md`, sección "Cumplimiento")

- [ ] **4 estructuras argumentales en rotación; ninguna > 40 %** de los largos de la semana (con 3 largos: las 3 distintas).
- [ ] Ningún gancho ni remate idéntico en la semana; ningún título con el mismo esqueleto 3 veces seguidas.
- [ ] De 10 videos seguidos: 10 ideas, ≥ 4 países protagonistas, ≥ 4 tipos de gráfico.
- [ ] Hoja de contacto semanal mirada: no parece "la misma plantilla con otros números".
- [ ] Descripciones distintas, con fuentes; aviso y "voz sintetizada" presentes.
- [ ] Shorts ≤ 1/día (tope hasta el YPP).
- [ ] Comentarios con preguntas respondidos; errores corregidos con comentario fijado.
- [ ] Cuenta: 2FA, teléfono verificado, sin strikes, **AdSense vinculada antes de los 1.000 subs** (`SANTIAGO.md`).

## 3. Día del YPP

Postular apenas se cumplan 1.000 subs + 4.000 h (si es antes del 2027-02-01) o 8.000 h. Mientras revisan (1–4 semanas): seguir
publicando igual, no cambiar formato. Aprobados: mid-rolls manuales en todos los largos ≥ 8 min, revisar ícono verde por video,
membresías cuando haya fans recurrentes, patrocinios solo si no imponen recomendar un producto (y siempre divulgados como
"promoción pagada" en Studio).

## Registro

| Fecha | Tanda | Resultado | Notas |
|---|---|---|---|
| 2026-11-05 | preparación | — | canal aún no creado; reglas fijadas en este documento |
