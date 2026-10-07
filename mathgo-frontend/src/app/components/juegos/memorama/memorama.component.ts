import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Dificultad, generarSetUnico } from '../../../utils/juegos.util';
import { NavComponent } from '../../../shared/nav/nav.component';
import { SceneComponent } from '../../../shared/scene/scene.component';
import { PyroComponent } from '../../../shared/pyro/pyro.component';

interface Carta {
  id: number;       // id único de la carta
  parejaId: number; // id compartido entre la operación y su resultado
  texto: string;
  tipo: 'operacion' | 'resultado';
  volteada: boolean;
  resuelta: boolean;
  error: boolean;
}

const PAREJAS_POR_DIFICULTAD: Record<Dificultad, number> = {
  facil: 4,
  medio: 6,
  dificil: 8,
};

@Component({
  selector: 'app-memorama',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent, PyroComponent],
  templateUrl: './memorama.component.html',
  styleUrls: ['./memorama.component.scss'],
})
export class MemoramaComponent implements OnDestroy {
  dificultad: Dificultad | null = null;
  cartas: Carta[] = [];

  seleccionadas: Carta[] = [];
  bloqueado = false;

  movimientos = 0;
  aciertos = 0;
  segundos = 0;
  private timer?: ReturnType<typeof setInterval>;

  juegoTerminado = false;

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  // ─── Configuración ───
  elegirDificultad(d: Dificultad): void {
    this.dificultad = d;
    this.iniciarPartida();
  }

  iniciarPartida(): void {
    if (!this.dificultad) return;
    const total = PAREJAS_POR_DIFICULTAD[this.dificultad];
    const operaciones = generarSetUnico(total, this.dificultad);

    const cartas: Carta[] = [];
    operaciones.forEach((op, i) => {
      cartas.push({ id: i * 2, parejaId: i, texto: op.texto, tipo: 'operacion', volteada: false, resuelta: false, error: false });
      cartas.push({ id: i * 2 + 1, parejaId: i, texto: op.resultado.toString(), tipo: 'resultado', volteada: false, resuelta: false, error: false });
    });

    this.cartas = cartas.sort(() => Math.random() - 0.5);
    this.seleccionadas = [];
    this.movimientos = 0;
    this.aciertos = 0;
    this.segundos = 0;
    this.juegoTerminado = false;
    this.bloqueado = false;

    clearInterval(this.timer);
    this.timer = setInterval(() => (this.segundos += 1), 1000);
  }

  reiniciar(): void {
    this.dificultad = null;
    this.cartas = [];
    clearInterval(this.timer);
  }

  // ─── Juego ───
  voltear(carta: Carta): void {
    if (this.bloqueado || carta.volteada || carta.resuelta) return;

    carta.volteada = true;
    this.seleccionadas.push(carta);

    if (this.seleccionadas.length === 2) {
      this.movimientos++;
      this.bloqueado = true;
      const [a, b] = this.seleccionadas;

      if (a.parejaId === b.parejaId) {
        setTimeout(() => {
          a.resuelta = true;
          b.resuelta = true;
          this.aciertos++;
          this.seleccionadas = [];
          this.bloqueado = false;
          if (this.cartas.every((c) => c.resuelta)) this.finalizar();
        }, 350);
      } else {
        a.error = true;
        b.error = true;
        setTimeout(() => {
          a.volteada = false;
          b.volteada = false;
          a.error = false;
          b.error = false;
          this.seleccionadas = [];
          this.bloqueado = false;
        }, 700);
      }
    }
  }

  private finalizar(): void {
    clearInterval(this.timer);
    this.juegoTerminado = true;
  }

  get totalParejas(): number {
    return this.dificultad ? PAREJAS_POR_DIFICULTAD[this.dificultad] : 0;
  }

  get tiempoFormateado(): string {
    const m = Math.floor(this.segundos / 60).toString().padStart(2, '0');
    const s = (this.segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  volverAJuegos(): void {
    this.router.navigate(['/juegos']);
  }
}
