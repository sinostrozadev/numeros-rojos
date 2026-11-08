#!/bin/bash
# Reemplaza en Studio un largo programado por su versión nueva (YouTube no deja cambiar el archivo):
#   1) renombra la versión vieja con "(versión anterior)" y la pasa a PRIVADA (no se borra);
#   2) sube la nueva con subir-studio.mjs a la misma fecha/hora.
# Uso: herramientas/navegador/reemplazar-largo.sh <videoId viejo> "<título viejo>" <id bandeja nuevo> <YYYY-MM-DD> <HH:MM>
# Requiere el piloto (8777) en el canal (subir-studio.mjs cambia de canal solo; este script lo asegura con studio.youtube.com/).
set -u
cd "$(dirname "$0")/../.."
source secrets/canal.env
VIEJO=$1; TITULO=$2; NUEVO=$3; FECHA=$4; HORA=$5
P=http://localhost:8777
ir() { curl -s -m 25 --get "$P/ir" --data-urlencode "url=$1" >/dev/null; sleep "${2:-8}"; }
clic() { curl -s -m 20 --get "$P/click" --data-urlencode "sel=$1" >/dev/null; sleep "${2:-2}"; }
texto() { curl -s -m 10 --get "$P/texto" --data-urlencode "max=${1:-300}" | tr '\n' ' '; }
# Canal correcto
ir "https://studio.youtube.com/channel/$NR_CANAL_ID/videos/upload" 6
if texto | grep -q "permission"; then
  curl -s -m 20 --get "$P/clicktexto" --data-urlencode "texto=Switch account" --data-urlencode "exacto=1" >/dev/null; sleep 6
  curl -s -m 20 --get "$P/clicktexto" --data-urlencode "texto=$NR_CANAL_NOMBRE" --data-urlencode "exacto=1" >/dev/null; sleep 8
  ir "https://studio.youtube.com/" 8
fi
texto 200 | grep -q "$NR_CANAL_NOMBRE" || { echo "✗ el piloto no está en $NR_CANAL_NOMBRE"; exit 1; }
# 1) viejo → título "(versión anterior)" + privado
ir "https://studio.youtube.com/video/$VIEJO/edit" 9
curl -s -m 20 --get "$P/escribir" --data-urlencode "sel=#title-textarea #textbox" --data-urlencode "texto=$TITULO (versión anterior)" >/dev/null; sleep 2
clic "ytcp-video-metadata-visibility" 3
curl -s -m 20 --get "$P/clicktexto" --data-urlencode "texto=Save or publish" --data-urlencode "exacto=1" >/dev/null; sleep 2
clic "ytcp-video-visibility-select tp-yt-paper-radio-button[name=PRIVATE]" 2
clic "#save-button" 2
clic "ytcp-button#save" 7
R=$(curl -s -m 10 --get "$P/eval" --data-urlencode "js=(()=>({vis:document.querySelector('#visibility-text')?.innerText, t:document.querySelector('#title-textarea #textbox')?.innerText}))()")
echo "viejo $VIEJO → $R"
echo "$R" | grep -q '"vis":"Private"' || { echo "✗ el viejo no quedó privado; no subo el nuevo"; exit 1; }
# 2) nuevo
NR_CANAL_ID=$NR_CANAL_ID timeout 2400 node herramientas/navegador/subir-studio.mjs "$NUEVO" "$FECHA" "$HORA"
