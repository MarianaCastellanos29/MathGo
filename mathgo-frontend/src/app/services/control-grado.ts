import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GradoService } from './grado.service';
import { esAlumno, obtenerSesion } from './grado-utils';

const RUTAS_LIBRES = ['/login', '/registro', '/register', '/registrar', '/seleccion-grado'];

/**
 * Se ejecuta una vez al arrancar la app. Cada vez que el niño navega a una pantalla,
 * revisa si ya escogió su grado; si no, lo manda a /seleccion-grado.
 * Los padres/docentes (rol distinto de ALUMNO) no pasan por aquí.
 */
export function iniciarControlGrado(): void {
  const router = inject(Router);
  const gradoService = inject(GradoService);
  let consultando = false;

  router.events
    .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    .subscribe((evento) => {
      const url = evento.urlAfterRedirects.split('?')[0].toLowerCase();
      if (RUTAS_LIBRES.some((r) => url === r || url.startsWith(r + '/'))) return;

      const { id, rol } = obtenerSesion();
      if (!id) return;
      if (!esAlumno(rol)) return;

      const clave = `grado_${id}`;
      const guardado = localStorage.getItem(clave);
      if (guardado && guardado !== 'null' && guardado !== 'undefined') {
        localStorage.setItem('grado', guardado);
        return;
      }

      if (consultando) return;
      consultando = true;

      gradoService.consultarGrado(id).subscribe({
        next: (r) => {
          consultando = false;
          if (!esAlumno(r.rol)) return;
          if (r.grado) {
            localStorage.setItem(clave, String(r.grado));
            localStorage.setItem('grado', String(r.grado));
            return;
          }
          sessionStorage.setItem('urlPendienteGrado', evento.urlAfterRedirects);
          router.navigate(['/seleccion-grado']);
        },
        error: () => {
          consultando = false; // si falla la consulta, no bloqueamos al niño
        }
      });
    });
}
