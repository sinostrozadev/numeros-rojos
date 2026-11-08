#!/bin/bash
# Tanda diferida del 2026-11-09: espera a que vuelva el cupo diario de subidas (se agotó el 11-08 ~01:35) y sube/reemplaza
# en Studio lo que quedó pendiente. Se detiene al primer "tope diario" (subir-studio sale con código 3).
# Lanzado el 11-08 ~02:30 con: setsid nohup bash herramientas/navegador/lote-2026-11-09.sh >> salida/logs/lote-2026-11-09.log 2>&1 &
set -u
cd "$(dirname "$0")/../.."
set -a; source secrets/canal.env; set +a
OBJ=$(date -d "2026-11-09 01:50" +%s); AHORA=$(date +%s)
[ "$AHORA" -lt "$OBJ" ] && { echo "[$(date '+%F %T')] esperando $((OBJ-AHORA)) s hasta las 01:50"; sleep $((OBJ-AHORA)); }
echo "[$(date '+%F %T')] empieza la tanda"
curl -s -m 10 http://127.0.0.1:8777/url >/dev/null || { echo "piloto caído: lo lanzo"; (cd /home/santiago/projects/yt/bolita-lab/herramientas/navegador && setsid nohup node piloto.mjs >> piloto.log 2>&1 &); sleep 10; }
paso() { echo "== $1 =="; shift; "$@"; local c=$?; echo "   → código $c"; [ $c -eq 3 ] && { echo "TOPE DIARIO: me detengo"; exit 3; }; return 0; }
# 1) Shorts con la voz corregida (los viejos ya están privados). Van PRIMERO: si el tope sigue, se detiene antes de
#    poner en privado un largo programado (el reemplazo privatiza el viejo antes de subir el nuevo).
paso "Short Irlanda mié 11-11" node herramientas/navegador/subir-studio.mjs 2026-11-08-grafico-irlanda-consumo-v2 2026-11-11 13:00
paso "Short México jue 11-12" node herramientas/navegador/subir-studio.mjs 2026-11-08-grafico-mexico-gastaba-el-doble-que-chile-v2 2026-11-12 13:00
paso "Short Bolivia dom 11-15" node herramientas/navegador/subir-studio.mjs 2026-11-08-grafico-bolivia-tenia-15-000-millones-v2 2026-11-15 13:00
# 2) Argentina lun 11-09 19:00 (solo si el render terminó)
if [ -f salida/bandeja/2026-11-08-tesis-argentina-rica-v3.mp4 ]; then
  paso "Argentina v3 → reemplaza b1F1JlfZwIw" bash herramientas/navegador/reemplazar-largo.sh b1F1JlfZwIw "Argentina era más rica que Alemania. ¿Qué pasó después?" 2026-11-08-tesis-argentina-rica-v3 2026-11-09 19:00
else echo "Argentina v3 sin mp4: no se toca b1F1JlfZwIw"; fi
# 3) Irlanda mié 11-11 19:00
if [ -f salida/bandeja/2026-11-08-tesis-irlanda-pib-v3.mp4 ]; then
  paso "Irlanda v3 → reemplaza m_Lp1dgEsvA" bash herramientas/navegador/reemplazar-largo.sh m_Lp1dgEsvA "Irlanda creció un 25 % en un año. Su gente, un 2 %" 2026-11-08-tesis-irlanda-pib-v3 2026-11-11 19:00
else echo "Irlanda v3 sin mp4: no se toca m_Lp1dgEsvA"; fi
echo "[$(date '+%F %T')] fin de la tanda"
