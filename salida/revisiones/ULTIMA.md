# Revisión 2026-11-25 — vuelve el Short diario (orden de Santiago)

## Detectado
- Santiago: "en números no tiene shorts, por eso paró el crecimiento de suscriptores. Todos los canales deben tener shorts para los
  suscriptores y largos para las horas." El último Short programado era el mar 24-11. Al 19-11 los Shorts eran el 79 % de las vistas
  (2.315 de 2.939) y el canal tenía 5 subs.
- El backlog que el panel contaba (~12 "sin asignar") era falso: 7 Shorts y 3 largos ya estaban publicados (16→22-11) y Nueva Zelanda
  ya estaba programado. El render en la nube nunca los sacó del backlog. Quedaba un solo guion real (`tesis-chile-era-mas-pobre-que-mexico-en-1994`,
  fuera por regla). Los 4 Shorts de la semana se escribieron nuevos.
- Revisor ronda 1: el tráiler de Nueva Zelanda copiaba frases del largo (B7) y "casi alcanzó" exageraba (Chile llegó al 68 % de NZ en
  1928) → rechazado. En Perú, el gráfico del cold open (1985–2025) mostraba el pico de 7.482 % mientras la voz decía "mira el final de
  cada línea".
- Render: en Chile-EE. UU. el giro destacaba a EE. UU. y los colores se invertían a mitad del Short (Chile pasaba a azul).
- Studio no deja poner como "Related video" un largo que aún es privado (buscador: 0 coincidencias) → el related video del tráiler se
  pone después de que salga el largo.

## Mejorado
- `contenido/calendario.json`: `shortsActivos: true`, `minimoBacklog: 6`; comentarios de `diario.mts`, `estado.mts` y `lib/operacion.mts` al día.
- `docs/GUION.md` §1 (formato) y §4c nueva: Short TRÁILER los días de largo y Short de DATO el resto (fórmula directa de LP).
- `docs/ESTRATEGIA.md` §000 y `docs/DECISIONES.md`: reversión con cita y datos; criterio (e) de Shorts para el corte del 07-12.
- Backlog limpio: los 11 guiones ya publicados o programados pasaron a `contenido/guiones/` con su fecha de render.
- Tráiler reescrito con un dato nuevo (1932: la brecha vuelve a más del doble, 2,34); Perú con cold open 2015→2025; Chile-EE. UU. con
  el giro destacando a Chile (re-render).

## Herramientas exploradas
- `generar-guiones.mts --derivar-de <largo> --tema "…"`: ahora el `--tema` también llega en modo derivar (pedido del tráiler).
- `npx remotion ffprobe` / `npx remotion ffmpeg` como sustitutos de ffprobe/ffmpeg (no están instalados en la máquina): duración del mp4
  y fotogramas sueltos para revisar el final de una animación.

## Agregado
- 4 Shorts nuevos (`verificar-cifras` ✓, `--revisar` ✓, revisor independiente Sonnet; veredictos en `salida/revisiones/guiones/`):
| Ranura | Título | Video | publishAt (API) | Revisor |
|---|---|---|---|---|
| jue 26-11 13:00 | Chile se acercó a Nueva Zelanda en 1928. ¿Qué pasó? (tráiler) | `K1y43ptjkvs` | 2026-11-26T16:00Z ✓ | ronda 1 rechazado (B7, Verdad 4) → ronda 2 aprobado 4,29 |
| vie 27-11 13:00 | Un chileno vive más que un estadounidense. ¿Cómo? | `AuMaUJ9CHy4` | 2026-11-27T16:00Z ✓ | aprobado 4,29 |
| sáb 28-11 13:00 | Argentina le sacaba 55 % a Chile en 1990. Hoy va detrás | `_BbvmhwQ_9g` | 2026-11-28T16:00Z ✓ | aprobado 4,29 (con 3 cambios menores aplicados) |
| dom 29-11 13:00 | Perú tuvo más de 7.000 % de inflación. Hoy, menos que Chile | `FQp6ZZQJ-M0` | 2026-11-29T16:00Z ✓ | aprobado 4,29 |

  Studio dejó sin fecha a 3 de los 4 (a Argentina, además, el subidor la cortó por timeout "esperando subida completa", aunque el video quedó entero y con metadatos): `publishAt` puesto con `reprogramar.mts --aplicar` y verificado por API.
- `docs/PLAN-SEMANAL.md`: hito del jue 26-11 con la semana 30-11 → 06-12 (2 largos + 2 tráileres + 5 Shorts de dato modelados sobre outliers).

## Pendiente
- **Related video del tráiler `K1y43ptjkvs` → largo `n8fV62smf04`** después del jue 26 19:00:
  `flock -w 1800 /tmp/piloto.lock node herramientas/navegador/related-video.mjs K1y43ptjkvs n8fV62smf04`.
- Ritual del jue 26 17:00: guiones de los 2 largos y los 7 Shorts de la semana 30-11 → 06-12 (ideas en el plan).
- `producir.yml`: el artifact trae el guion promovido con el nombre del json de bandeja; la bandeja se rehízo a mano (id, título,
  descripción, hashtags, duración, `estado: listo`). Arreglarlo en la próxima sesión de mejoras.
- Medir el 07-12: criterio (e) (subs por 1.000 vistas de Shorts ≥ 2, "se queda" ≥ 50 %) y clics de los tráileres al largo.
