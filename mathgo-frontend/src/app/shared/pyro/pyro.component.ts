import { Component, Input } from '@angular/core';

/** Mascota Pyro (ilustración original). mood: happy | idle | sad */
@Component({
  selector: 'app-pyro',
  standalone: true,
  template: `<img class="pyro" [class.sad]="mood === 'sad'" src="assets/img/pyro.png" alt="Pyro, el dragón de MathGo" />`,
  styles: [`
    :host { display: inline-block; line-height: 0; }
    .pyro { width: 100%; height: auto; filter: drop-shadow(0 12px 18px rgba(8,3,50,.4)); transition: filter .3s, transform .3s; }
    .pyro.sad { filter: saturate(.55) brightness(.9) drop-shadow(0 12px 18px rgba(8,3,50,.4)); transform: rotate(-3deg); }
  `]
})
export class PyroComponent {
  @Input() mood: 'happy' | 'idle' | 'sad' = 'happy';
}
