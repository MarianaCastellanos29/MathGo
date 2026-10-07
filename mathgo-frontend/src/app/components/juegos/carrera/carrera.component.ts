import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Dificultad, generarOpciones, generarOperacion, OperacionGenerada } from '../../../utils/juegos.util';
import { NavComponent } from '../../../shared/nav/nav.component';
import { SceneComponent } from '../../../shared/scene/scene.component';

const CONFIG: Record<Dificultad, { tiempo: number; avancePorAcierto: number; retrocesoPorError: number }> = {
  facil:   { tiempo: 60, avancePorAcierto: 16, retrocesoPorError: 2 },
  medio:   { tiempo: 75, avancePorAcierto: 12, retrocesoPorError: 3 },
  dificil: { tiempo: 55, avancePorAcierto: 10, retrocesoPorError: 4 },
};

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent],
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.scss'],
})
export class CarreraComponent implements OnDestroy {
  dificultad: Dificultad | null = null;

  progreso = 0; // 0 a 100
  tiempoRestante = 0;
  correctas = 0;
  incorrectas = 0;

  pregunta: OperacionGenerada | null = null;
  opciones: string[] = [];
  respuestaSeleccionada: string | null = null;
  esCorrecta: boolean | null = null;

  dragonSaltando = false;
  dragonTropieza = false;

  estado: 'jugando' | 'ganado' | 'tiempo-agotado' = 'jugando';

  private timer?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  elegirDificultad(d: Dificultad): void {
    this.dificultad = d;
    this.iniciarCarrera();
  }

  iniciarCarrera(): void {
    if (!this.dificultad) return;
    this.progreso = 0;
    this.correctas = 0;
    this.incorrectas = 0;
    this.tiempoRestante = CONFIG[this.dificultad].tiempo;
    this.estado = 'jugando';
    this.siguientePregunta();

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.timer);
        this.estado = 'tiempo-agotado';
      }
    }, 1000);
  }

  reiniciar(): void {
    this.dificultad = null;
    clearInterval(this.timer);
  }

  private siguientePregunta(): void {
    if (!this.dificultad) return;
    this.pregunta = generarOperacion(this.dificultad);
    this.opciones = generarOpciones(this.pregunta.resultado);
    this.respuestaSeleccionada = null;
    this.esCorrecta = null;
  }

  responder(opcion: string): void {
    if (this.estado !== 'jugando' || this.respuestaSeleccionada || !this.dificultad || !this.pregunta) return;

    this.respuestaSeleccionada = opcion;
    const correcta = Number(opcion) === this.pregunta.resultado;
    this.esCorrecta = correcta;

    const cfg = CONFIG[this.dificultad];

    if (correcta) {
      this.correctas++;
      this.progreso = Math.min(100, this.progreso + cfg.avancePorAcierto);
      this.dragonSaltando = false;
      requestAnimationFrame(() => (this.dragonSaltando = true));
      setTimeout(() => (this.dragonSaltando = false), 600);
    } else {
      this.incorrectas++;
      this.progreso = Math.max(0, this.progreso - cfg.retrocesoPorError);
      this.dragonTropieza = false;
      requestAnimationFrame(() => (this.dragonTropieza = true));
      setTimeout(() => (this.dragonTropieza = false), 500);
    }

    if (this.progreso >= 100) {
      clearInterval(this.timer);
      this.estado = 'ganado';
      return;
    }

    setTimeout(() => this.siguientePregunta(), 700);
  }

  volverAJuegos(): void {
    this.router.navigate(['/juegos']);
  }
}
