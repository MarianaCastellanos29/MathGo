import { Injectable, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { Diccionario, EN, ES, Idioma } from './diccionarios';

// Datos de región (l10n) para fechas y números. 'en-US' ya viene incluido en Angular.
registerLocaleData(localeEsCo, 'es-CO');

const CLAVE = 'idioma';
const REGION: Record<Idioma, string> = { es: 'es-CO', en: 'en-US' };
const DICCIONARIOS: Record<Idioma, Diccionario> = { es: ES, en: EN };

/** Idioma activo (i18n) y región (l10n). Se recuerda en localStorage. */
@Injectable({ providedIn: 'root' })
export class IdiomaService {
  readonly idioma = signal<Idioma>(this.inicial());

  constructor() {
    document.documentElement.lang = this.idioma();
  }

  private inicial(): Idioma {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado === 'es' || guardado === 'en') return guardado;
    } catch { /* sin almacenamiento: se usa el idioma del navegador */ }
    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  /** Región para formatear fechas y números: es-CO o en-US. */
  get region(): string {
    return REGION[this.idioma()];
  }

  cambiar(nuevo: Idioma): void {
    this.idioma.set(nuevo);
    try { localStorage.setItem(CLAVE, nuevo); } catch { /* ignorado */ }
    document.documentElement.lang = nuevo;
  }

  alternar(): void {
    this.cambiar(this.idioma() === 'es' ? 'en' : 'es');
  }

  /** Traduce una clave; si no existe devuelve la propia clave. Reemplaza {parametros}. */
  t(clave: string, parametros?: Record<string, string | number>): string {
    const diccionario = DICCIONARIOS[this.idioma()];
    let texto = diccionario[clave] ?? ES[clave] ?? clave;
    if (parametros) {
      for (const [k, v] of Object.entries(parametros)) {
        texto = texto.split(`{${k}}`).join(String(v));
      }
    }
    return texto;
  }
}
