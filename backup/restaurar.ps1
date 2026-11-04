# Restaura la base de datos de MathGo desde un archivo .sql (Windows / PowerShell).
# Uso (desde la raíz del proyecto):   .\backup\restaurar.ps1 backups\mathgo_2026-10-27_03-00-00.sql
# ATENCIÓN: reemplaza los datos actuales por los del respaldo.
param([Parameter(Mandatory = $true)][string]$Archivo)
$ErrorActionPreference = "Stop"
$contenedor = "mathgo-mysql"
$base = "mathgo_db"

if (-not (Test-Path $Archivo)) { Write-Host "No existe el archivo: $Archivo" -ForegroundColor Red; exit 1 }

$resp = Read-Host "Esto REEMPLAZA los datos actuales por '$Archivo'. Escribe SI para continuar"
if ($resp -ne "SI") { Write-Host "Cancelado."; exit 0 }

# Respaldo de seguridad previo, por si te arrepientes
Write-Host "Guardando un respaldo de seguridad de lo actual..."
& "$PSScriptRoot\respaldar-ahora.ps1"

Write-Host "Restaurando..."
docker cp $Archivo "${contenedor}:/tmp/restaurar.sql"
docker exec $contenedor sh -c "MYSQL_PWD=`"`$MYSQL_ROOT_PASSWORD`" mysql -u root $base < /tmp/restaurar.sql"
docker exec $contenedor rm -f /tmp/restaurar.sql

Write-Host "Reiniciando el backend para que tome los datos..."
docker compose restart backend
Write-Host "Restauración completa." -ForegroundColor Green
