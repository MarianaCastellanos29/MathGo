# Backup de la base de datos de MathGo

MathGo guarda los datos en MySQL (`mathgo_db`). El volumen de Docker `mathgo-mysql-data` conserva los datos al reiniciar, pero **no es un respaldo**: si el volumen se borra o se daña, se pierde todo. Este módulo genera copias de seguridad aparte.

## Cómo funciona

El servicio `backup` de `docker-compose.yml` (contenedor `mathgo-backup`):

1. Espera a que MySQL esté listo.
2. Hace un respaldo al arrancar y luego uno cada `BACKUP_INTERVALO_HORAS` horas (24 por defecto).
3. Guarda cada respaldo en `backups/mathgo_AAAA-MM-DD_HH-MM-SS.sql` (carpeta del proyecto).
4. Conserva solo los últimos `BACKUP_MAXIMO` respaldos (14 por defecto) y borra los más viejos.

Si un respaldo falla, el detalle queda en `backups/ultimo-error.log`.

| Variable (en `docker-compose.yml`) | Qué controla | Valor por defecto |
|---|---|---|
| `BACKUP_INTERVALO_HORAS` | Cada cuántas horas respalda | `24` |
| `BACKUP_MAXIMO` | Cuántos respaldos conserva | `14` |

La carpeta `backups/` está en `.gitignore`: contiene datos reales de los usuarios y no debe subirse a GitHub.

## Uso

Iniciar el servicio junto con el resto:

```powershell
docker compose up -d --build
docker compose logs backup --tail 20     # debe decir: [backup] OK -> mathgo_....sql
```

Respaldo manual inmediato (PowerShell, en la raíz del proyecto):

```powershell
.\backup\respaldar-ahora.ps1             # crea backups\manual_AAAA-MM-DD_HH-MM-SS.sql
```

## Restaurar

```powershell
.\backup\restaurar.ps1 backups\mathgo_2026-10-27_03-00-00.sql
```

El script pide confirmar escribiendo `SI`, guarda antes un respaldo de seguridad de los datos actuales, restaura el archivo y reinicia el backend.

## Cómo comprobar que funciona

1. Revisa que exista un archivo `.sql` en `backups/` y que no esté vacío.
2. Crea un usuario de prueba y haz un respaldo manual.
3. Borra ese usuario (o cambia un dato) desde la aplicación.
4. Restaura el respaldo: el usuario debe volver a aparecer.

## Limitaciones

- Los respaldos quedan en la misma máquina. Para protegerse de la pérdida del equipo hay que copiar `backups/` a otro lugar (nube o disco externo).
- Los archivos `.sql` incluyen las contraseñas ya encriptadas con BCrypt, pero siguen siendo datos sensibles.
- Es una copia completa periódica, no un respaldo continuo: se pueden perder los cambios hechos desde el último respaldo.
