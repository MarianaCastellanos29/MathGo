import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GradoService } from '../services/grado.service';
import { obtenerSesion } from '../services/grado-utils';
import { nivelesDeGrado } from '../utils/niveles-grado';
import { SceneComponent } from '../shared/scene/scene.component';
import { PyroComponent } from '../shared/pyro/pyro.component';

@Component({
  selector: 'app-seleccion-grado',
  standalone: true,
  imports: [CommonModule, SceneComponent, PyroComponent],
  templateUrl: './seleccion-grado.component.html',
  styleUrls: ['./seleccion-grado.component.css']
})
export class SeleccionGradoComponent {
  private gradoService = inject(GradoService);
  private router = inject(Router);

  grados = [
    { valor: 1, nombre: 'Primero', emoji: '🌱' },
    { valor: 2, nombre: 'Segundo', emoji: '🐣' },
    { valor: 3, nombre: 'Tercero', emoji: '🚀' },
    { valor: 4, nombre: 'Cuarto', emoji: '🦁' },
    { valor: 5, nombre: 'Quinto', emoji: '🏆' }
  ];

  seleccionado: number | null = null;
  guardando = false;
  error = '';

  /** Temas que practicará en el grado elegido (vista previa). */
  get temas(): string[] {
    return this.seleccionado ? nivelesDeGrado(this.seleccionado).map(n => n.tema) : [];
  }

  elegir(valor: number) {
    this.seleccionado = valor;
  }

  continuar() {
    if (this.seleccionado === null) return;

    const { id } = obtenerSesion();
    if (!id) {
      this.error = 'No encontramos tu sesión. Vuelve a iniciar sesión.';
      return;
    }

    this.guardando = true;
    this.error = '';

    this.gradoService.actualizarGrado(id, this.seleccionado).subscribe({
      next: (resp) => {
        localStorage.setItem(`grado_${id}`, String(resp.grado));
        localStorage.setItem('grado', String(resp.grado));
        this.guardando = false;

        // Vuelve a la pantalla a la que el niño iba; si no hay, a la raíz.
        const pendiente = sessionStorage.getItem('urlPendienteGrado');
        sessionStorage.removeItem('urlPendienteGrado');
        this.router.navigateByUrl(pendiente && !pendiente.includes('seleccion-grado') ? pendiente : '/');
      },
      error: () => {
        this.guardando = false;
        this.error = 'Ups, no pudimos guardar tu grado. Intenta de nuevo.';
      }
    });
  }
}
