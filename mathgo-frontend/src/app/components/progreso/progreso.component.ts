import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProgresoService } from '../../services/progreso.service';
import { AuthService } from '../../services/auth.service';
import { ProgresoResponse } from '../../models/models';

import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent],
  templateUrl: './progreso.component.html',
  styleUrls: ['./progreso.component.scss']
})
export class ProgresoComponent implements OnInit {
  progreso: ProgresoResponse | null = null;
  nombre: string;
  vidas: number;
  nivelActual: number;

  constructor(
    private progresoService: ProgresoService,
    private auth: AuthService,
    private router: Router
  ) {
    this.nombre = auth.getNombre();
    this.vidas = auth.getVidas();
    this.nivelActual = auth.getNivelActual();
  }

  ngOnInit(): void {
    this.progresoService.obtenerProgreso(this.auth.getUsuarioId()).subscribe({
      next: (p) => this.progreso = p
    });
  }

  get corazones(): string {
    return '❤️'.repeat(this.vidas) + '🖤'.repeat(Math.max(0, 5 - this.vidas));
  }

  irHome(): void {
    this.router.navigate(['/home']);
  }
}
