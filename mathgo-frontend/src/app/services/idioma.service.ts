import { Injectable, computed, inject, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { TranslateService } from '@ngx-translate/core';

export type CodigoIdioma = 'es' | 'en';

export interface Idioma {
  codigo: CodigoIdioma;
  etiqueta: string;
  nombre: string;
  /** Configuración regional (l10n): formato de fechas y números */
  locale: string;
}

export const IDIOMAS: Idioma[] = [
  { codigo: 'es', etiqueta: 'ES', nombre: 'Español', locale: 'es-CO' },
  { codigo: 'en', etiqueta: 'EN', nombre: 'English', locale: 'en-US' }
];

const CLAVE_IDIOMA = 'idioma';
const IDIOMA_POR_DEFECTO: CodigoIdioma = 'es';

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private readonly translate = inject(TranslateService);

  private readonly _idioma = signal<CodigoIdioma>(IDIOMA_POR_DEFECTO);

  /** Idioma activo (señal de solo lectura). */
  readonly idioma = this._idioma.asReadonly();

  /**
   * Locale activo para los pipes de fecha y número, por ejemplo:
   *   {{ fecha | date:'mediumDate':undefined:idiomaService.locale() }}
   *   {{ xp | number:'1.0-0':idiomaService.locale() }}
   */
  readonly locale = computed(
    () => IDIOMAS.find(i => i.codigo === this._idioma())?.locale ?? 'es-CO'
  );

  constructor() {
    registerLocaleData(localeEsCo, 'es-CO'); // en-US ya viene incluido en Angular
  }

  /** Se llama una vez al arrancar la aplicación. */
  iniciar(): void {
    this.translate.addLangs(IDIOMAS.map(i => i.codigo));
    this.translate.setDefaultLang(IDIOMA_POR_DEFECTO);
    this.cambiar(this.leerGuardado());
  }

  cambiar(codigo: CodigoIdioma): void {
    this._idioma.set(codigo);
    this.translate.use(codigo);
    document.documentElement.lang = codigo;
    try {
      localStorage.setItem(CLAVE_IDIOMA, codigo);
    } catch {
      /* si localStorage no está disponible, el idioma solo dura la sesión */
    }
  }

  private leerGuardado(): CodigoIdioma {
    try {
      const guardado = localStorage.getItem(CLAVE_IDIOMA);
      if (IDIOMAS.some(i => i.codigo === guardado)) {
        return guardado as CodigoIdioma;
      }
    } catch {
      /* se usa el idioma por defecto */
    }
    return IDIOMA_POR_DEFECTO;
  }
}
