import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Muestra las vidas como corazones rosados (llenos / apagados). */
@Component({
  selector: 'app-hearts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <span class="hearts" [attr.aria-label]="vidas + ' de ' + max + ' vidas'">
    <svg *ngFor="let h of lista" viewBox="0 0 24 22" [class.off]="!h" aria-hidden="true">
      <path d="M12 21C5 15 1 11.5 1 7a5.5 5.5 0 0 1 11-1.2A5.5 5.5 0 0 1 23 7c0 4.500-4 8-11 14z"/>
    </svg>
  </span>`,
  styles: [`
    :host{display:inline-flex}
    .hearts{display:inline-flex;gap:.28em}
    svg{width:1.15em;height:1.05em;fill:#ff3d9a;filter:drop-shadow(0 0 5px rgba(255,61,154,.55))}
    svg.off{fill:#8b78d8;opacity:.55;filter:none}
  `]
})
export class HeartsComponent {
  @Input() vidas = 5;
  @Input() max = 5;
  get lista(): boolean[] {
    return Array.from({ length: this.max }, (_, i) => i < this.vidas);
  }
}
