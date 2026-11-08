# Lo único que necesita Santiago (En Números Rojos) — actualizado 2026-11-06 09:10

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

## 5. ⚠ NECESARIO: Studio lo pidió el 2026-11-06
**(f) Verificación por teléfono** — **2026-11-08: NO SE PUDO** ("This number is associated with too many accounts": el número de Santiago ya verificó 2 cuentas este año). Alternativas: otro número (familiar) o vivir con el tope diario de subidas (~10/día) y sin miniaturas personalizadas. Chile-Corea se resolvió sin subir: el v4 privado ya aprobado se programó para el 11-08 19:00 (`K5ma4A5VFj8`). Texto anterior: además de las miniaturas, el canal sin verificar tiene tope diario de subidas y hoy se agotó ("Daily upload limit reached"): sin verificación no se puede subir hoy la versión definitiva de Chile-Corea (v5) para reemplazar la de las 19:00. La pantalla ya está lista en http://localhost:8777/ver (youtube.com/verify: elegir SMS, poner el número, NEXT, código). Tras verificar, Claude sube v5 y reemplaza.  **Studio bloquea las miniaturas personalizadas de este canal** ("To add custom thumbnails, verify your phone number"): es por canal, no por cuenta. Ruta: en el piloto, Studio del canal → cualquier video → Thumbnail → Upload file → "Verify" (SMS a tu número). Hasta entonces los 3 largos programados van con el fotograma automático; las miniaturas listas están en `salida/bandeja/<id>-mini.png` y se suben con un clic en Studio después (o las sube Claude). Para el largo del dom 11-08 (Chile-Corea, `eTq0TBuEWIs`) la elegida es `salida/caratulas/chile-corea-2.png` (hecha con GPT). Texto original: para miniaturas personalizadas y videos > 15 min. La verificación de funciones avanzadas es
por cuenta (ya la hiciste para Bolita Lab/Línea Punteada), así que probablemente no haga falta; si Studio la pide en este canal,
es un SMS a tu número.
