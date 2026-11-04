import { Pipe, PipeTransform, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { IdiomaService } from './idioma.service';

/** {{ 'clave' | t }}  o  {{ 'clave' | t:{ nombre: 'Ana' } }}  — traduce según el idioma activo. */
@Pipe({ name: 't', standalone: true, pure: false })
export class TraducirPipe implements PipeTransform {
  private idioma = inject(IdiomaService);
  transform(clave: string | null | undefined, parametros?: Record<string, string | number>): string {
    this.idioma.idioma(); // dependencia reactiva: se actualiza al cambiar de idioma
    return clave ? this.idioma.t(clave, parametros) : '';
  }
}

/** l10n de fechas: {{ fecha | fechaL:'short' }} — respeta la región (es-CO / en-US). */
@Pipe({ name: 'fechaL', standalone: true, pure: false })
export class FechaLocalPipe implements PipeTransform {
  private idioma = inject(IdiomaService);
  transform(valor: string | number | Date | null | undefined, formato = 'short'): string {
    if (!valor) return '';
    try {
      return formatDate(valor, formato, this.idioma.region);
    } catch {
      return String(valor);
    }
  }
}

/** l10n de números: {{ 12500 | numeroL }} → 12.500 (es-CO) o 12,500 (en-US). */
@Pipe({ name: 'numeroL', standalone: true, pure: false })
export class NumeroLocalPipe implements PipeTransform {
  private idioma = inject(IdiomaService);
  transform(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined || valor === '') return '';
    return new Intl.NumberFormat(this.idioma.region).format(Number(valor));
  }
}
