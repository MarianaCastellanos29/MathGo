import { ApplicationConfig, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { iniciarControlGrado } from './services/control-grado';
import { IdiomaService } from './services/idioma.service';

/** Carga los textos desde src/assets/i18n/<idioma>.json */
export function crearTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => iniciarControlGrado() },
    { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => inject(IdiomaService).iniciar() },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: crearTranslateLoader,
          deps: [HttpClient]
        }
      })
    )
  ]
};
