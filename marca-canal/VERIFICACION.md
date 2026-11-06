# Verificación de la marca (revisión visual con Read, 2026-11-05 noche)

Generados con `node marca-canal/capturar.mjs` (Playwright/Chromium del navegador de bolita-lab; no se instaló nada).

- **avatar.png (800×800):** isotipo centrado (~60 % del lado): línea verde gruesa que sube en zigzag, cae en rojo hasta un punto
  rojo grande, línea base gris debajo. Primera versión quedaba baja y a la izquierda y el aro grafito del punto mordía la base:
  corregido (viewBox recentrado, punto sin aro, base separada). Dentro del recorte circular de YouTube no se corta nada.
- **Prueba a 48/96/32 px (`prueba48.png`, recorte circular):** a 48 px se lee "sube verde, cae rojo" sin ambigüedad; a 32 px
  todavía se distingue el pico y el punto rojo. La base gris casi desaparece a 32 px (decorativa, esperado).
- **banner.png (2560×1440) + banner-guia.png:** isotipo + "En Números **Rojos**" (rojo), lema en dorado y "3 videos a la semana ·
  datos con fuente" caben dentro de la zona segura 1546×423 (recuadro discontinuo en la guía) con ~130 px de holgura lateral.
  Fondo: rejilla tenue, líneas de gráfico y barras fuera de la zona segura; el punto rojo de la línea izquierda queda a ~40 px
  sobre el borde superior de la zona segura sin entrar en ella. Las etiquetas "PIB PER CÁPITA 1960 → 2024" e "IPC · INFLACIÓN"
  solo se ven en la vista TV (decoración, no información).
- **marca-de-agua.png (400×120):** transparente (PNG RGBA), isotipo sin base + "En Números Rojos" en una línea, blanco 92 %
  con sombra. Probada a 200 px de ancho y 65 % de opacidad sobre un fotograma de gráfico (`marca-sobre-fotograma.png`):
  discreta y legible, no compite con la serie verde.
- **logo.svg / logo-horizontal.svg:** mismo dibujo que el avatar. El horizontal usa fuentes por nombre (cae a Arial Black si
  falta Bricolage).

## Pendiente / qué corregiría
- `src/marca/Logo.tsx` todavía dibuja el isotipo de Línea Punteada (heredado al clonar): debe pasar a este dibujo
  (territorio del agente de plantillas; `logo.svg` es la referencia).
- Convertir el texto de `logo-horizontal.svg` a trazos para no depender de fuentes instaladas.
- Ver el banner en la vista previa móvil de Studio al subirlo (el renglón de 34 px es lo más chico).
