# Revisión 2026-11-07 — En Números Rojos (sesión de madrugada, v2 visual)

## Detectado
- Santiago, al ver los primeros largos (Chile-Corea, Argentina, Irlanda): "no estás aprovechando todas las herramientas"; los temas hablan de lugares e historias y solo había gráficos. Medido en las hojas de contacto: 0 fotos, 0 mapas, 0 iconos en 10 min de video; solo gráficos y citas.
- En la primera subida real de largos (11-06): el piloto quedaba en otro canal de la cuenta (métricas de Línea Punteada) y Studio mostraba "no tienes permiso" con nuestro id en la URL; la miniatura personalizada no se aplica porque el canal no tiene verificación por teléfono.
- Hojas v2: lista de iconos en pantalla completa deja la mitad derecha vacía 30–40 s; título del gráfico cortado con "…" en disposición dividida; bocadillo de la mascota poco legible en un fotograma de Argentina.

## Mejorado
- Contrato de guion v2 (`src/plantillas/comun/visual.ts`): cada escena puede llevar foto de Commons (licencia PD/CC0/CC BY/CC BY-SA, crédito en pantalla y descripción), mapa (Natural Earth, países destacados, flechas), lista de iconos, ilustración plana por GPT y mascota con bocadillo; regla: ≥ 5 visuales de ≥ 2 tipos por largo, datos siempre en gráfico.
- Plantilla `tesis` v2 con disposición completo/dividido; fotos resueltas y descargadas por `scripts/lib/imagenes.mts` (port de Línea Punteada); créditos automáticos en la descripción.
- Tres largos redirigidos a v2 con 15 fotos de Commons verificadas, mapas e iconos; Chile-Corea v2 (dom 19:00, `eTq0TBuEWIs`) y Argentina v2 (lun 19:00, `b1F1JlfZwIw`) ya reemplazan a las v1 en Studio (v1 en privado); Irlanda v2 se renderiza a las 07:20 y se reemplaza a las 09:35.
- `subir-studio.mjs`: cambia de canal solo ante "no tienes permiso", verifica por nombre del canal, fallback de descripción; `reemplazar-largo.sh` para sustituir un largo programado.
- Miniatura de Remotion remaquetada (4 marcas en el eje X, 180 px para etiquetas, sin leyenda en ranking).

## Herramientas exploradas
- Wikimedia Commons por API (adoptada; la búsqueda es literal: términos concretos en inglés + época, 2 alternativas por foto).
- d3-geo + world-atlas (ya instalados) para el mapa de países con flechas de comercio (adoptado; sin raster ni calles).
- GPT por el canal de pedidos de Entender Chile: carátula del largo en 4 min (adoptada; variante 2 elegida) y hoja de poses de la mascota (pedido a las 09:00; 1 pedido/día).
- Generador `claude -p --model opus`: un largo v2 válido a la primera en 7 min 18 s (adoptado como modelo por defecto).

## Agregado
- Skills: `navegador-piloto` (cambio de canal, reemplazo de video programado, miniatura y teléfono), `videos-largos` (modelo vivo de subida de largos y v2 visual), `herramientas-disponibles` §1d (visuales del largo de datos), `incidentes-canal` §6.
- Docs: `docs/GUION.md` §7b dirección visual, `docs/MASCOTA.md`, `docs/CONVENCIONES.md` (licencias de fotos), `src/plantillas/tesis/README.md`.
- Scripts: `scripts/lib/imagenes.mts`, `scripts/mascota.mts` (pedir/esperar/recortar), `herramientas/navegador/reemplazar-largo.sh`.
- Guion nuevo generado para el vie 11-13: "Uruguay produce 46 % más que Chile. Con precios, empatan" (pendiente de revisor independiente).

## Pendiente
- Verificación por teléfono del canal (Santiago) para poner las miniaturas (Remotion o GPT) a los 3 largos.
- Mascota: aprobación de identidad por Santiago; poses de GPT (pedido 09:00) → `scripts/mascota.mts recortar`; decidir nombre (Nuez recomendado).
- Ilustraciones planas por GPT para las escenas que hoy caen al gráfico previo (1 pedido/día).
- Pulido en curso: iconos centrados en pantalla completa, título del gráfico en 2 líneas en dividido, bocadillo legible.
- Backlog: generar Shorts y largos del jue 11-12 al dom 11-15 (contingentes IPC Chile e INDEC); el Short `grafico` aún no usa visuales.
