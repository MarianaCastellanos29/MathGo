import { Component, Input, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IDIOMAS, IdiomaService } from '../../services/idioma.service';

/**
 * Selector de idioma ES | EN con icono de globo.
 *   <app-selector-idioma />                      -> estilo oscuro (barra superior)
 *   <app-selector-idioma [flotante]="true" />    -> estilo claro, fijo arriba a la derecha (login y registro)
 */
@Component({
  selector: 'app-selector-idioma',
  standalone: true,
  imports: [TranslateModule],
  host: { '[class.flotante]': 'flotante' },
  template: `
    <div class="selector-idioma" role="group" [attr.aria-label]="'IDIOMA.ETIQUETA' | translate">
      <svg class="globo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18"/>
        <path d="M12 3c2.8 3 4 6 4 9s-1.2 6-4 9c-2.8-3-4-6-4-9s1.2-6 4-9z"/>
      </svg>
      @for (i of idiomas; track i.codigo) {
        <button
          type="button"
          [class.activo]="i.codigo === idiomaService.idioma()"
          [attr.aria-pressed]="i.codigo === idiomaService.idioma()"
          [title]="i.nombre"
          (click)="idiomaService.cambiar(i.codigo)">
          {{ i.etiqueta }}
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-flex; }
    :host(.flotante) { position: fixed; top: 12px; right: 16px; z-index: 1000; }

    /* ----- Estilo oscuro (barra superior morada) ----- */
    .selector-idioma {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 3px 4px 3px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.10);
      border: 1px solid rgba(255, 255, 255, 0.22);
      color: #fff;
      white-space: nowrap;
    }
    .globo {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      opacity: 0.85;
      flex-shrink: 0;
    }
    button {
      background: transparent;
      color: rgba(255, 255, 255, 0.78);
      border: none;
      border-radius: 999px;
      padding: 4px 11px;
      font: inherit;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    button:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    button.activo {
      background: linear-gradient(135deg, #8b6cff, #6a4cf0);
      color: #fff;
      box-shadow: 0 2px 8px rgba(106, 76, 240, 0.45);
    }
    button:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }

    /* ----- Estilo claro (login y registro) ----- */
    :host(.flotante) .selector-idioma {
      background: #fff;
      border: 2px solid #3b3b58;
      color: #3b3b58;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    }
    :host(.flotante) button { color: #3b3b58; }
    :host(.flotante) button:hover { background: rgba(59, 59, 88, 0.10); color: #3b3b58; }
    :host(.flotante) button.activo {
      background: #3b3b58;
      color: #fff;
      box-shadow: none;
    }
    :host(.flotante) button:focus-visible { outline-color: #3b3b58; }
  `]
})
export class SelectorIdiomaComponent {
  @Input() flotante = false;

  readonly idiomaService = inject(IdiomaService);
  readonly idiomas = IDIOMAS;
}
