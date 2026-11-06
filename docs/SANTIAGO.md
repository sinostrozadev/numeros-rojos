# Lo único que necesita Santiago (En Números Rojos) — actualizado 2026-11-06 02:40

Nada de esto cuesta dinero. Claude deja cada pantalla lista en el piloto (http://localhost:8777/ver) y te pide solo el clic.

## 1. Cuando se cree el canal (antes del primer Short, sáb 2026-11-07 13:00)
**(a) ✅ HECHO 2026-11-05 23:55 — Audiencia "no es para niños" (COPPA)**, lo marcó Santiago en el piloto (verificado).
- Studio del canal nuevo → **Settings → Channel → Advanced settings → Audience → "No, set this channel as not made for kids" → Save.**
- Sin esto el script de subida por Studio se niega a programar.

**(b) Id del canal y token** — para que la fábrica suba y lea métricas sola.
- ✅ Id anotado: `UC8uOwislkGbnnfoqsJ_FgAw` (`secrets/canal.env`, `scripts/cron.txt`). Canal creado el 2026-11-05 23:40 con banner, foto, descripción, país y keywords.
- Token OAuth del canal: `npx tsx scripts/subir.mts autorizar` → en el piloto eliges la cuenta de marca **En Números Rojos** y
  aceptas (misma app de Google Cloud **bolita-lab**; un token por canal). Caduca cada 7 días mientras la app no esté verificada:
  `estado.mts` avisa antes.

## 2. Cuando quieras que ande solo sin sesión de Claude
**(c) Cron:** `crontab -e` y **pega** (no reemplaces) las líneas de `scripts/cron.txt` de este repo (horas distintas a Bolita Lab
y Línea Punteada). No uses `crontab scripts/cron.txt`: borraría las de los otros canales.

## 3. Pendientes que ya existían
**(d) `.wslconfig memory=12GB`** (pendiente desde Bolita Lab): en Windows, `%UserProfile%\.wslconfig` con
```
[wsl2]
memory=12GB
```
y luego `wsl --shutdown` desde PowerShell. Ahora son 3 canales renderizando en la misma máquina: menos OOM en los largos.

## 4. Antes de los 1.000 suscriptores (estimado: febrero–marzo 2027)
**(e) AdSense vinculada** — Studio → **Earn** → paso de AdSense → usar la **misma cuenta AdSense** de tus otros canales (sirve
para todos). Hazlo con tiempo: la verificación puede pedir un PIN por correo postal y tardar semanas.

## 5. Solo si Studio lo pide
**(f) Verificación por teléfono** para miniaturas personalizadas y videos > 15 min. La verificación de funciones avanzadas es
por cuenta (ya la hiciste para Bolita Lab/Línea Punteada), así que probablemente no haga falta; si Studio la pide en este canal,
es un SMS a tu número.
