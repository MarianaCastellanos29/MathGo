import { Component, inject } from '@angular/core';
import { IdiomaService } from './idioma.service';
import { TraducirPipe } from './i18n.pipes';

/** Botón ES | EN para cambiar el idioma de la aplicación. */
@Component({
  selector: 'app-selector-idioma',
  standalone: true,
  imports: [TraducirPipe],
  template: `
    <button type="button" class="mg-pill selector-idioma" (click)="idioma.alternar()"
            [attr.aria-label]="'nav.cambiarIdioma' | t">
      <span [class.on]="idioma.idioma() === 'es'">ES</span>
      <i>|</i>
      <span [class.on]="idioma.idioma() === 'en'">EN</span>
    </button>`,
  styles: [`
    .selector-idioma { cursor: pointer; gap: 6px; padding: 7px 12px; font-size: .85rem; }
    .selector-idioma span { opacity: .5; font-weight: 800; }
    .selector-idioma span.on { opacity: 1; color: var(--mg-mint); }
    .selector-idioma i { opacity: .35; font-style: normal; }
  `]
})
export class SelectorIdiomaComponent {
  idioma = inject(IdiomaService);
}
