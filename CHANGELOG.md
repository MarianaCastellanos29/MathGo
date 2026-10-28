# Changelog

Todos los cambios importantes del proyecto MathGo se documentan aquí.

## [Sin publicar] - 2026-10-28

### Agregado
- Selección de grado escolar (1 a 5) para los alumnos, con `GradoController` y componentes de frontend.
- `PasswordUtil`: encriptación y comparación de contraseñas con BCrypt.
- `AccesoUsuario`: regla de propiedad de los datos (cada alumno accede solo a lo suyo; `PADRE` y `ADMIN` a cualquier alumno), aplicada con `@PreAuthorize`.
- Roles dentro del token JWT y como autoridades de Spring Security.
- `nginx.conf` para el frontend, de modo que las rutas de Angular funcionen al recargar la página.
- Tests nuevos: `AccesoUsuarioTest`, `UsuarioSerializacionTest`, casos de rol en `JwtFilterTest` y casos de grados, niveles y XP en `EjercicioServiceTest`.
- Documentación en `docs/SEGURIDAD.md`.

### Cambiado
- `JwtUtil`: el secreto y la expiración se leen de `JWT_SECRET` y `JWT_EXPIRATION`.
- `SecurityConfig`: solo registro, login y Swagger son públicos; el resto exige token; respuestas `401` (sin token) y `403` (sin permiso).
- `UsuarioService` y `UsuarioController`: contraseñas con BCrypt y migración automática de las antiguas al iniciar sesión.
- El registro público rechaza el rol `ADMIN`.
- Controladores de ejercicios, historial, progreso, grado y usuarios: comprueban la propiedad de los datos.
- `EjercicioService`: los ejercicios se filtran por el grado y el nivel del alumno.
- Frontend: el interceptor solo envía el token a la API propia y cierra la sesión ante un `401`; el guard valida roles; `isLoggedIn()` comprueba que el token no haya vencido; `/admin` y `/padre` solo para `PADRE` y `ADMIN`.
- `.gitignore`: se ignoran `*.bak` y `docker-logs.txt`.

### Corregido
- La contraseña ya no se devuelve en las respuestas JSON (antes aparecía anidada en el historial).
- Las contraseñas ya no se guardan ni se comparan en texto plano.
- Los tokens ya no se invalidan al reiniciar el backend cuando `JWT_SECRET` está definido.
- Un `403` o un `400` ya no se convierte en `401` al pasar por `/error`.
- Las rutas de Angular dan `404` al recargar la página en nginx.

### Pendiente
- Mover los secretos de `docker-compose.yml` a un archivo `.env`.
- Internacionalización (i18n/l10n).
- Módulo de backup.
