import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { NavComponent } from '../../../shared/nav/nav.component';
import { SceneComponent } from '../../../shared/scene/scene.component';

@Component({
  selector: 'app-juegos-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent],
  templateUrl: './juegos-home.component.html',
  styleUrls: ['./juegos-home.component.scss'],
})
export class JuegosHomeComponent {
  nombre: string;

  juegos = [
    {
      ruta: '/juegos/memorama',
      img: 'assets/img/target.png',
      nombre: 'Memorama matemático',
      descripcion: 'Encuentra la pareja entre cada operación y su resultado',
    },
    {
      ruta: '/juegos/carrera',
      img: 'assets/img/pyro.png',
      nombre: 'Carrera del dragón',
      descripcion: 'Responde rápido y ayuda a Pyro a llegar a la meta',
    },
  ];

  constructor(private auth: AuthService) {
    this.nombre = auth.getNombre();
  }
}
