#!/bin/bash
# Respaldo automático de la base de datos de MathGo.
# Corre dentro del contenedor "mathgo-backup": hace un respaldo al arrancar y
# luego uno cada BACKUP_INTERVALO_HORAS horas, conservando solo los últimos BACKUP_MAXIMO.
set -u

HOST="${MYSQL_HOST:-mysql}"
USUARIO="${MYSQL_USER:-root}"
BASE="${MYSQL_DATABASE:-mathgo_db}"
INTERVALO=$(( ${BACKUP_INTERVALO_HORAS:-24} * 3600 ))
MAXIMO="${BACKUP_MAXIMO:-14}"
DESTINO="/backups"

export MYSQL_PWD="${MYSQL_PASSWORD:-}"
mkdir -p "$DESTINO"

limpiar_viejos() {
  # Deja solo los $MAXIMO respaldos más recientes
  ls -1t "$DESTINO"/mathgo_*.sql 2>/dev/null | tail -n +$((MAXIMO + 1)) | while read -r viejo; do
    rm -f "$viejo"
    echo "[backup] borrado respaldo antiguo: $(basename "$viejo")"
  done
}

hacer_respaldo() {
  local archivo="$DESTINO/mathgo_$(date +%Y-%m-%d_%H-%M-%S).sql"
  if mysqldump -h "$HOST" -u "$USUARIO" --single-transaction --routines --triggers \
       --no-tablespaces "$BASE" > "$archivo.tmp" 2> "$DESTINO/ultimo-error.log"; then
    mv "$archivo.tmp" "$archivo"
    echo "[backup] OK -> $(basename "$archivo") ($(du -h "$archivo" | cut -f1))"
    limpiar_viejos
  else
    rm -f "$archivo.tmp"
    echo "[backup] ERROR: no se pudo respaldar. Mira backups/ultimo-error.log"
  fi
}

echo "[backup] esperando a MySQL en $HOST..."
until mysqladmin ping -h "$HOST" -u "$USUARIO" --silent 2>/dev/null; do sleep 3; done
echo "[backup] MySQL listo. Respaldo cada $((INTERVALO / 3600)) h, se conservan $MAXIMO."

while true; do
  hacer_respaldo
  sleep "$INTERVALO"
done
