import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import { iniciarControlGrado } from './services/control-grado';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => iniciarControlGrado() },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
