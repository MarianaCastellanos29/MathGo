# Hace un respaldo manual de la base de datos de MathGo (Windows / PowerShell).
# Uso (desde la raíz del proyecto):   .\backup\respaldar-ahora.ps1
$ErrorActionPreference = "Stop"
$contenedor = "mathgo-mysql"
$base = "mathgo_db"

New-Item -ItemType Directory -Force -Path "backups" | Out-Null
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$destino = "backups\manual_$fecha.sql"

Write-Host "Respaldando '$base'..."
docker exec $contenedor sh -c "MYSQL_PWD=`"`$MYSQL_ROOT_PASSWORD`" mysqldump -u root --single-transaction --routines --triggers --no-tablespaces $base > /tmp/respaldo.sql"
docker cp "${contenedor}:/tmp/respaldo.sql" $destino
docker exec $contenedor rm -f /tmp/respaldo.sql

$kb = [math]::Round((Get-Item $destino).Length / 1KB, 1)
Write-Host "Listo: $destino ($kb KB)" -ForegroundColor Green
