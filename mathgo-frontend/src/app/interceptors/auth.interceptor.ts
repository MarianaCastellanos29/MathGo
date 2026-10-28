import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const API_BASE = 'http://localhost:8080';

// Rutas que no necesitan token (y donde un 401 solo significa "credenciales incorrectas")
const RUTAS_PUBLICAS = ['/usuarios/login', '/usuarios/login-nino', '/usuarios/registro'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Solo se envia el token a nuestra API, nunca a servicios externos
  const esApiPropia = req.url.startsWith(API_BASE) || !/^https?:\/\//i.test(req.url);
  const esPublica = RUTAS_PUBLICAS.some(ruta => req.url.includes(ruta));

  const peticion = token && esApiPropia && !esPublica
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token vencido o invalido: cerrar la sesion y volver al login
      if (err.status === 401 && esApiPropia && !esPublica && auth.getToken()) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
