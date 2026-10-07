import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EjercicioService, EjercicioAPI } from '../../services/ejercicio.service';
import { AuthService } from '../../services/auth.service';
import { HistorialService } from '../../services/historial.service';
import { PyroComponent } from '../../shared/pyro/pyro.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';

import { SceneComponent } from '../../shared/scene/scene.component';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule, PyroComponent, HeartsComponent, SceneComponent],
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.scss']
})
export class EjerciciosComponent implements OnInit {
  ejercicios: EjercicioAPI[] = [];
  indiceActual = 0;
  respuestaSeleccionada: string | null = null;
  esCorrecta: boolean | null = null;
  mensajeFeedback: string = '';
  datoCurioso: string = '';
  explicacionError: string = '';
  datosCuriososNivel: string[] = [];
  mensajePyroFinal: string = '';
  cargandoDato = false;
  cargandoExplicacion = false;
  nivel = 1;
  vidas = 5;
  finNivel = false;
  sinVidas = false;
  puntaje = 0;
  monedasGanadas = 0;
  mostrarExplosion = false;
  explosionItems: any[] = [];

  readonly MAX_NIVELES = 6;

  particulas = Array.from({ length: 12 }, () => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 5}s`,
    size: `${Math.random() * 1.5 + 0.8}rem`,
    emoji: ['➕', '➖', '✖️', '➗', '🔢', '⭐', '🔥'][Math.floor(Math.random() * 7)]
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ejercicioService: EjercicioService,
    private auth: AuthService,
    private historialService: HistorialService
  ) {}

  ngOnInit(): void {
    this.nivel = Number(this.route.snapshot.paramMap.get('nivel')) || 1;
    this.vidas = this.auth.getVidas();
    this.cargarEjercicios();
  }

  cargarEjercicios(): void {
    this.ejercicioService.obtenerEjerciciosAPI(this.nivel).subscribe({
      next: (lista) => this.ejercicios = lista
    });
  }

  get ejercicioActual(): EjercicioAPI {
    return this.ejercicios[this.indiceActual];
  }

  seleccionar(opcion: string): void {
    if (this.respuestaSeleccionada || this.cargandoDato) return;
    this.respuestaSeleccionada = opcion;
    const correcto = opcion === this.ejercicioActual.respuestaCorrecta;
    this.esCorrecta = correcto;
    this.explicacionError = '';
    this.datoCurioso = '';

    // Guardar en historial y actualizar logros en backend
    this.historialService.guardarResultado(
      this.auth.getUsuarioId(),
      this.ejercicioActual.pregunta,
      this.nivel,
      correcto
    ).subscribe({
      next: (res) => {
        // El backend ya guardó XP, rango y racha en la base de datos;
        // solo reflejamos esos valores en el almacenamiento local.
        if (correcto) {
          localStorage.setItem('xp', res.xp.toString());
          localStorage.setItem('rango', res.rango);
          localStorage.setItem('rachaActual', res.rachaActual.toString());
        }
      },
      error: (err) => console.error('Error guardando resultado:', err)
    });

    if (correcto) {
      this.puntaje++;
      const monedas = this.nivel * 10;
      this.monedasGanadas += monedas;
      this.mensajeFeedback = `✅ ¡Correcto! +${monedas} 🪙`;
      this.lanzarExplosion();

      const numero = Number.parseInt(this.ejercicioActual.respuestaCorrecta, 10);
if (!Number.isNaN(numero) && numero > 0) {
        this.ejercicioService.obtenerDatoCurioso(numero).subscribe({
          next: (dato) => {
            this.datoCurioso = dato;
            if (dato && this.datosCuriososNivel.length < 3) {
              this.datosCuriososNivel.push(dato);
            }
          }
        });
      }
    } else {
      this.vidas = Math.max(0, this.vidas - 1);
      this.auth.guardarProgreso({ vidas: this.vidas }).subscribe();
      this.mensajeFeedback = `❌ Respuesta incorrecta`;

      this.ejercicioService.explicarError(
        this.ejercicioActual.pregunta,
        this.ejercicioActual.respuestaCorrecta,
        opcion
      ).subscribe({
        next: (explicacion) => this.explicacionError = explicacion
      });

      if (this.vidas === 0) {
        setTimeout(() => this.sinVidas = true, 1800);
      }
    }
  }

  lanzarExplosion(): void {
    this.explosionItems = Array.from({ length: 8 }, (_, i) => ({
      transform: `rotate(${i * 45}deg) translateX(80px)`,
      delay: `${i * 0.05}s`
    }));
    this.mostrarExplosion = true;
    setTimeout(() => this.mostrarExplosion = false, 1000);
  }

  siguiente(): void {
    if (this.cargandoDato || this.cargandoExplicacion) return;
    this.respuestaSeleccionada = null;
    this.esCorrecta = null;
    this.mensajeFeedback = '';
    this.datoCurioso = '';
    this.explicacionError = '';
    this.indiceActual++;

    if (this.indiceActual >= this.ejercicios.length) {
      this.ejercicioService.mensajePyro(this.puntaje, this.ejercicios.length, this.nivel).subscribe({
        next: (msg) => this.mensajePyroFinal = msg,
        error: () => this.mensajePyroFinal = '¡Lo hiciste genial! 🔥'
      });
      this.finNivel = true;
      const nuevoNivel = this.nivel + 1;
      if (nuevoNivel <= this.MAX_NIVELES && nuevoNivel > this.auth.getNivelActual()) {
        this.auth.guardarProgreso({ nivelActual: nuevoNivel }).subscribe();
      }
    }
  }

  irHome(): void { this.router.navigate(['/home']); }

  irSiguienteNivel(): void {
    if (this.nivel < this.MAX_NIVELES) {
      this.router.navigate(['/ejercicios', this.nivel + 1]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  get corazones(): string {
    return '❤️'.repeat(this.vidas) + '🖤'.repeat(Math.max(0, 5 - this.vidas));
  }

  get progreso(): number {
    return this.ejercicios.length > 0
      ? Math.round((this.indiceActual / this.ejercicios.length) * 100)
      : 0;
  }

  /** Divide la pregunta para resaltar los números en verde. */
  get preguntaPartes(): { t: string; n: boolean }[] {
    const texto = this.ejercicioActual?.pregunta ?? '';
    return texto.split(/(\d+(?:[.,]\d+)?)/)
      .filter(t => t !== '')
      .map(t => ({ t, n: /^\d/.test(t) }));
  }

  get xpActual(): number { return this.auth.getXp(); }
  get hayNivelSiguiente(): boolean { return this.nivel < this.MAX_NIVELES; }

  get estrellas(): number {
    const pct = this.ejercicios.length > 0 ? this.puntaje / this.ejercicios.length : 0;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    return 1;
  }

  get nombreNivel(): string {
    const nombres: Record<number, string> = {
      1: 'Sumas',
      2: 'Restas',
      3: 'Multiplicación',
      4: 'División',
      5: 'Raíces Cuadradas',
      6: 'Fracciones y Porcentajes'
    };
    return nombres[this.nivel] ?? `Nivel ${this.nivel}`;
  }
}