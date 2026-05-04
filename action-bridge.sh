#!/bin/bash
# Puente de Acción HARI-KING
# Uso: ./action-bridge.sh "mensaje de commit" "archivo" "contenido"

MESSAGE=$1
FILE=$2
CONTENT=$3

echo "$CONTENT" > "$FILE"
git add "$FILE"
git commit -m "HARI-AUTONOMOUS: $MESSAGE ✅"
git push origin main
echo "🚀 Acción ejecutada y desplegada por HARI-KING."
