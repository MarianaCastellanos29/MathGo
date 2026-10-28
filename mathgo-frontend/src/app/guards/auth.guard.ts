import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege rutas. Si la ruta define data: { roles: ['PADRE', 'ADMIN'] },
 * ademas exige que el usuario tenga uno de esos roles.
 */
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data?.['roles'] as string[] | undefined;
  if (roles && roles.length > 0 && !roles.includes(auth.getRol().toUpperCase())) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
