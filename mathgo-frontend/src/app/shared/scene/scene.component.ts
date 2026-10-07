import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Escena decorativa animada de fondo: nubes flotando y estrellas titilando.
 * variant "game" agrega islas flotantes con cascada, para la pantalla de ejercicios.
 * Puramente decorativa (aria-hidden), no ocupa espacio en el layout.
 */
@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="mg-scene" aria-hidden="true">
    <span class="cloud c1"></span>
    <span class="cloud c2"></span>
    <span class="cloud c3"></span>
    <span class="star" *ngFor="let s of estrellas" [style.left.%]="s.x" [style.top.%]="s.y"
          [style.width.px]="s.size" [style.height.px]="s.size"
          [style.animation-delay]="s.delay"></span>

    <ng-container *ngIf="variant === 'game'">
      <div class="isla isla-izq">
        <span class="cascada"></span>
        <span class="roca"></span>
      </div>
      <div class="isla isla-der">
        <span class="cascada"></span>
        <span class="roca"></span>
      </div>
    </ng-container>
  </div>`,
  styles: [`
    :host { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
    .mg-scene { position: absolute; inset: 0; }

    .star {
      position: absolute; border-radius: 50%;
      background: #fff; box-shadow: 0 0 6px 1px rgba(255,255,255,.8);
      animation: titilar 2.8s ease-in-out infinite;
    }
    @keyframes titilar { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }

    .cloud {
      position: absolute; border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,.16), rgba(255,255,255,0) 70%);
      filter: blur(1px);
    }
    .c1 { width: 340px; height: 120px; top: 8%;  left: -20%; animation: deriva-derecha 46s linear infinite; }
    .c2 { width: 260px; height: 90px;  top: 22%; right: -18%; animation: deriva-izquierda 58s linear infinite; }
    .c3 { width: 220px; height: 80px;  top: 4%;  left: 40%;  animation: deriva-derecha 70s linear infinite; animation-delay: -12s; }
    @keyframes deriva-derecha  { from { transform: translateX(0); } to { transform: translateX(140vw); } }
    @keyframes deriva-izquierda{ from { transform: translateX(0); } to { transform: translateX(-140vw); } }

    .isla { position: absolute; width: 130px; animation: flotar-isla 5s ease-in-out infinite; }
    .isla-izq { left: 2%;  top: 12%; }
    .isla-der { right: 3%; top: 40%; animation-delay: -2.5s; width: 100px; }
    .isla .roca {
      display: block; width: 100%; height: 46px; border-radius: 50% 50% 46% 46% / 60% 60% 40% 40%;
      background: linear-gradient(160deg, #4a34a8, #241454 75%);
      box-shadow: 0 16px 30px rgba(6,2,40,.55), inset 0 2px 0 rgba(255,255,255,.12);
    }
    .isla .cascada {
      display: block; width: 6px; height: 46px; margin: 0 auto; border-radius: 0 0 6px 6px;
      background: linear-gradient(180deg, rgba(125,214,255,.85), rgba(125,214,255,0));
    }
    @keyframes flotar-isla { 50% { transform: translateY(-14px); } }

    @media (prefers-reduced-motion: reduce) {
      .star, .cloud, .isla { animation: none !important; }
    }
  `]
})
export class SceneComponent {
  @Input() variant: 'default' | 'game' = 'default';

  /** Posiciones fijas (pero de aspecto aleatorio) para que no cambien en cada render. */
  estrellas = [
    { x: 6,  y: 12, size: 3, delay: '0s' },
    { x: 15, y: 70, size: 2, delay: '.6s' },
    { x: 27, y: 30, size: 3, delay: '1.2s' },
    { x: 38, y: 82, size: 2, delay: '.3s' },
    { x: 52, y: 18, size: 2, delay: '1.8s' },
    { x: 64, y: 60, size: 3, delay: '.9s' },
    { x: 73, y: 15, size: 2, delay: '2.1s' },
    { x: 85, y: 72, size: 3, delay: '.2s' },
    { x: 92, y: 34, size: 2, delay: '1.5s' },
    { x: 46, y: 48, size: 2, delay: '2.4s' },
  ];
}
