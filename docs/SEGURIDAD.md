# Seguridad de MathGo: autenticación, roles y control de acceso

Este documento describe cómo MathGo autentica a los usuarios, protege sus contraseñas y controla quién puede ver o modificar cada dato. Corresponde a la rama `seguridad-jwt`.

## Resumen

- **Autenticación con JWT:** el login devuelve un token firmado que el frontend envía en cada petición.
- **Roles:** el token incluye el rol del usuario (`ALUMNO`, `PADRE`, `ADMIN`).
- **Contraseñas con BCrypt:** nunca se guardan ni se devuelven en texto plano.
- **Rutas cerradas por defecto:** solo registro, login y la documentación Swagger son públicos.
- **Propiedad de los datos:** un alumno solo accede a sus propios datos; un padre o administrador accede a cualquier alumno.

## Flujo de autenticación

1. El cliente envía `POST /usuarios/login` con `correo` y `password`.
2. El backend valida la contraseña con `PasswordUtil.coincide`.
3. Si es válida, genera un token con `JwtUtil.generarToken(correo, rol)` y lo devuelve en `LoginResponse`.
4. El frontend guarda el token y lo envía con `Authorization: Bearer <token>` mediante `auth.interceptor.ts`.
5. `JwtFilter` valida el token, y deja al usuario y su rol autenticados en Spring Security.
6. `SecurityConfig` y `@PreAuthorize` deciden si la petición tiene permiso.

### Contenido del token

| Claim | Valor |
|---|---|
| `sub` | Correo del usuario |
| `rol` | Rol del usuario |
| `iat` | Fecha de emisión |
| `exp` | Fecha de expiración (24 horas por defecto) |

## Configuración

El backend lee estas variables de entorno (en Docker se definen en `docker-compose.yml`):

| Variable | Descripción | Si falta |
|---|---|---|
| `JWT_SECRET` | Secreto de firma. **Mínimo 32 caracteres.** | Se genera una clave aleatoria y los tokens se invalidan al reiniciar |
| `JWT_EXPIRATION` | Duración del token en milisegundos | `86400000` (24 horas) |

No se debe publicar el valor real del secreto en el repositorio.

## Contraseñas

- Al registrarse, la contraseña se guarda con BCrypt (`PasswordUtil.encriptar`). Una contraseña en blanco se rechaza con `400`.
- **Migración automática:** si un usuario antiguo tiene la contraseña en texto plano, se valida y se vuelve a guardar encriptada la primera vez que inicia sesión.
- **Nunca se devuelve:** el campo `password` de la entidad `Usuario` está marcado como solo escritura (`@JsonProperty(access = WRITE_ONLY)`), así que no aparece en ninguna respuesta JSON, ni siquiera cuando `Usuario` viene anidado en otros objetos (por ejemplo, el historial).

## Control de acceso

### Rutas públicas

| Método y ruta | Motivo |
|---|---|
| `POST /usuarios/registro` | Crear cuenta |
| `POST /usuarios/login` | Iniciar sesión |
| `POST /usuarios/login-nino` | Verificación del alumno desde el panel del padre |
| `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` | Documentación |
| `/error` | Página interna de errores de Spring Boot (si no fuera pública, un `403` o `400` se convertiría en `401`) |

Cualquier otra ruta requiere un token válido.

### Solo `PADRE` y `ADMIN`

| Ruta |
|---|
| `GET /usuarios` (listado completo) |
| `GET /usuarios/alumnos` |
| `GET /usuarios/buscar` |
| `POST /usuarios/{id}/mensaje` |

### Propiedad de los datos

Un `ALUMNO` solo puede acceder a su propio `id`. `PADRE` y `ADMIN` pueden acceder a cualquier alumno. La regla está en `AccesoUsuario` y se aplica con `@PreAuthorize`:

| Ruta |
|---|
| `GET /ejercicios/nivel/{usuarioId}/{nivel}` y `POST /ejercicios/responder` |
| `GET /historial/{usuarioId}`, `POST /historial/guardar` y `GET /historial/{usuarioId}/logros` |
| `GET /progreso/{usuarioId}` |
| `GET /usuarios/{id}`, `PUT /usuarios/{id}/progreso`, `POST /usuarios/{id}/dar-vidas` y `GET /usuarios/{id}/reporte-semanal` |
| `GET` y `PUT /usuarios/{id}/grado` |

`GET /usuarios/{id}/mensaje` es solo para el propio usuario, porque leer el mensaje lo borra.

`GET /ejercicios` y `GET /logros` están disponibles para cualquier usuario con sesión.

### Registro y roles

- Sin rol, el usuario se crea como `ALUMNO`.
- El registro público **rechaza el rol `ADMIN`** con `403`. Para crear un administrador se cambia el rol directamente en la base de datos:
  ```sql
  UPDATE usuarios SET rol = 'ADMIN' WHERE correo = 'correo@ejemplo.com';
  ```

### Códigos de respuesta

| Código | Cuándo |
|---|---|
| `401` | No hay token, es inválido o está vencido |
| `403` | El token es válido, pero el usuario no tiene permiso |

## Frontend

- **`auth.interceptor.ts`:** agrega el token solo a peticiones a la API propia (no a servicios externos ni a las rutas públicas). Si recibe un `401` con sesión iniciada, cierra la sesión y manda al login.
- **`auth.guard.ts`:** exige sesión y, si la ruta define `data: { roles: [...] }`, también el rol. Las rutas `/admin` y `/padre` permiten solo `PADRE` y `ADMIN`.
- **`auth.service.ts`:** `isLoggedIn()` comprueba que el token exista y que no haya vencido (lee `exp`).

## Despliegue

El frontend se sirve con nginx dentro de Docker. El archivo `mathgo-frontend/nginx.conf` entrega `index.html` cuando una ruta no existe como archivo (`try_files`), para que rutas como `/home` o `/padre` funcionen al recargar la página.

Para aplicar cambios:

```bash
docker compose up -d --build backend frontend
```

## Pruebas

Automáticas:

```bash
cd mathgo-backend
mvn test
```

- `JwtUtilTest` y `JwtFilterTest`: generación y validación de tokens, y roles como autoridades.
- `AccesoUsuarioTest`: regla de propiedad de los datos.
- `UsuarioSerializacionTest`: la contraseña no aparece en el JSON.
- `UsuarioControllerTest`, `UsuarioServiceTest` y `TiposDePruebasUnitariasTest`: registro y login.
- `EjercicioServiceTest`: lógica de grados, niveles, racha y XP.

Manuales (PowerShell, con el backend en marcha):

```powershell
$a = Invoke-RestMethod -Method Post -Uri http://localhost:8080/usuarios/login `
  -ContentType "application/json" `
  -Body '{"correo":"alumno@ejemplo.com","password":"su-contraseña"}'
$h = @{Authorization="Bearer $($a.token)"}

# Sus propios datos: 200
Invoke-RestMethod http://localhost:8080/historial/$($a.usuarioId) -Headers $h

# Datos de otro usuario: 403
try { Invoke-RestMethod http://localhost:8080/historial/9999 -Headers $h } catch { $_.Exception.Response.StatusCode.value__ }

# Sin token: 401
try { Invoke-RestMethod http://localhost:8080/usuarios } catch { $_.Exception.Response.StatusCode.value__ }

# Función de padre con token de alumno: 403
try { Invoke-RestMethod http://localhost:8080/usuarios/alumnos -Headers $h } catch { $_.Exception.Response.StatusCode.value__ }
```

## Limitaciones conocidas

- **Un `PADRE` puede ver a cualquier alumno.** El modelo de datos no relaciona padres con hijos.
- **Los tokens no se pueden revocar** antes de que venzan (24 horas por defecto). No hay refresh token ni lista de tokens cancelados.
- **El token se guarda en `localStorage`**, que es vulnerable si algún día aparece una falla de XSS.
- **`dar-vidas` está permitido al propio alumno**, para no romper pantallas que lo usen. Si solo lo usa el panel del padre, conviene restringirlo a `PADRE` y `ADMIN`.

## Pendiente

- [ ] Mover `JWT_SECRET` y las contraseñas de MySQL de `docker-compose.yml` a un archivo `.env` fuera del repositorio, y cambiar los valores actuales.
- [ ] Revisar que las respuestas de ejercicios no expongan la respuesta correcta al navegador.
- [ ] Relacionar padres con hijos para limitar el acceso de cada padre a sus propios hijos.
- [ ] Internacionalización (i18n/l10n) en español e inglés.
- [ ] Módulo de backup de la base de datos MySQL.
