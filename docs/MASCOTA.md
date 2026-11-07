# Mascota de En Números Rojos (PROTOTIPO, pendiente del visto bueno de Santiago)

Referencia de formato: Los Ecomonos (monos que comentan economía), con identidad propia. Estado: prototipo; no entra a
producción hasta que Santiago apruebe la identidad (ver `docs/DECISIONES.md`, 2026-11-07).

## Quién es
Una **ardilla**: ahorra, guarda nueces (la plata que se guarda para construir), es ágil y simpática. Pelaje dorado `#F5C451`,
vientre crema `#FFF3D1`, orejas y cola por dentro en rojo `#FF4D4D`, ojos grandes (blanco + pupila grafito `#111418`) y una
**bufanda roja** `#FF4D4D` siempre puesta (detalle de marca, en las 6 poses). Acento azul `#4FA3F7` solo en destellos. Estilo plano
vectorial (flat, 2D), sin degradados ni sombras. Fondo de trabajo grafito `#111418`.

### Nombre (3 opciones)
1. **Nuez**: la nuez es el ahorro/capital que la ardilla guarda; corto, memorable y fácil en un bocadillo. (Recomendado)
2. **Pepa**: cálido y chileno ("la Pepa" = la pepa de fruta, también "pepa" = dinero guardado en el habla popular); cercano pero menos claro fuera de Chile.
3. **Cuenta**: eco del lema "la economía, con la cuenta en pantalla"; ingenioso, pero suena a objeto y no a personaje.

## Carácter
Curiosa. **Reacciona a los datos, nunca los explica** (la voz explica; la ardilla siente lo que el espectador debería sentir:
asombro, duda, susto, alegría). Sin voz propia; solo un bocadillo muy corto.

## Poses (orden fijo de la hoja: fila 1 / fila 2)
| Pose | Gesto | Cuándo |
|---|---|---|
| `saluda` | brazo en alto, sonrisa | entrada de una sección nueva o cierre ("nos vemos") |
| `senala` | brazo extendido a la derecha, mira allí | la voz apunta a una cifra o país del gráfico |
| `piensa` | mano en el mentón, "?" | la voz plantea una pregunta o un cabo suelto |
| `sorpresa` | ojos enormes, boca "O", brazos abiertos | cifra desproporcionada, giro ("3 veces más rico") |
| `tapa-ojos` | se cubre los ojos | caída, quiebra, crisis, inflación disparada |
| `celebra` | brazos arriba, confeti | el país que remonta, resultado positivo |

## Dónde aparece y reglas
- Esquina **inferior izquierda**, **≤ 260 px** de alto (largo 1920×1080), dentro de la zona segura.
- Bocadillo **≤ 40 caracteres** (`Mascota.bocadillo`), p. ej. "¿3 veces? ¡Uf!".
- **≤ 1 de cada 3 escenas**, máximo 1 por escena (el contrato está en `src/plantillas/comun/visual.ts`: `POSES_MASCOTA`).
- Solo en el largo `tesis`; en el Short, en caso de aparecer, respetar la zona segura inferior (340 px).

## Lo que NO hace
No presenta el video, no da consejo (el canal no es asesoría financiera), no aparece en el **gancho** ni sobre los **gráficos de
datos** (jamás tapa una cifra, eje o fuente), no repite la misma pose dos veces seguidas, no habla de política.

## Plan de producción
1. **Una sola imagen "hoja de poses"** 1536×1024 (o 1280×720 si el generador no da más), cuadrícula 3×2, fondo LISO `#111418`,
   separadores finos `#2A313B`, cada celda rotulada abajo con el nombre de la pose. Una sola imagen = un solo personaje: la
   consistencia entre poses es lo difícil con generadores, y así la da el propio generador.
2. Pedido: `salida/caratulas/pedidos/PEDIDO-numeros-rojos-mascota-poses.md` (y `-v2`, prompt simplificado por si sale inconsistente).
   Pedir entre 09:00 y 23:00 (skill `caratulas-con-gpt`); 1 pedido al día.
3. Esperar y verificar: `npx tsx scripts/mascota.mts esperar [v2]` (cada 60 s hasta 30 min, verifica IEND →
   `salida/caratulas/mascota-poses.png`).
4. Recortar: `npx tsx scripts/mascota.mts recortar salida/caratulas/mascota-poses.png` → `public/mascota/<pose>.png` (se quita el 12 %
   inferior del rótulo) + `public/mascota/hoja.png`. La composición `Mascota.tsx` lee `public/mascota/<pose>.png`.
5. Revisar los 6 PNG (rótulo fuera, mismo personaje, bufanda en todos). Si GPT devuelve fondo no liso, la hoja se corrige
   o se repide con el `-v2`. Fondo transparente: no lo da el generador; si hace falta, recortar con máscara por color `#111418` (pendiente).
6. Hasta que llegue la hoja: SVG de reserva en `public/mascota/reserva/<pose>.svg` (400×400), contacto en `salida/pruebas/mascota-reserva.png`.
   Los PNG finales se guardan junto a `<id>.prompt.txt` (el prompt exacto, para aprender qué funcionó).
