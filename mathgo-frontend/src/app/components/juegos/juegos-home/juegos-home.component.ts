import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { NavComponent } from '../../../shared/nav/nav.component';
import { SceneComponent } from '../../../shared/scene/scene.component';

import { TraducirPipe } from '../../../i18n/i18n.pipes';
@Component({
  selector: 'app-juegos-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent, TraducirPipe],
  templateUrl: './juegos-home.component.html',
  styleUrls: ['./juegos-home.component.scss'],
})
export class JuegosHomeComponent {
  nombre: string;

  juegos = [
    {
      ruta: '/juegos/memorama',
      img: 'assets/img/target.png',
      nombre: 'juegos.memorama',
      descripcion: 'juegos.memoramaDesc',
    },
    {
      ruta: '/juegos/carrera',
      img: 'assets/img/pyro.png',
      nombre: 'juegos.carrera',
      descripcion: 'juegos.carreraDesc',
    },
  ];

  constructor(private auth: AuthService) {
    this.nombre = auth.getNombre();
  }
}
