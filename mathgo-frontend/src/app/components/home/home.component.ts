import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { PyroComponent } from '../../shared/pyro/pyro.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, PyroComponent, HeartsComponent, SceneComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nombre: string = '';
  nivelActual: number = 1;
  vidas: number = 5;
  avatarUrl: string = '';
  xp: number = 0;
  rol: string = '';

  particulas = Array.from({ length: 15 }, () => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 8}s`,
    duration: `${Math.random() * 6 + 7}s`,
    size: `${Math.random() * 1.2 + 0.7}rem`,
    emoji: ['➕', '➖', '✖️', '➗', '🔢', '⭐', '🔥', '💫', '🌟'][Math.floor(Math.random() * 9)]
  }));

  niveles = [
    { id: 1, nombre: 'Nivel 1', descripcion: 'Sumas',            emoji: '🌱', color: '#22c55e' },
    { id: 2, nombre: 'Nivel 2', descripcion: 'Restas',           emoji: '⭐', color: '#3b82f6', img: 'assets/img/star.png' },
    { id: 3, nombre: 'Nivel 3', descripcion: 'Multiplicación',   emoji: '✖️', color: '#f59e0b' },
    { id: 4, nombre: 'Nivel 4', descripcion: 'División',         emoji: '➗', color: '#a855f7', img: 'assets/img/divide.png' },
    { id: 5, nombre: 'Nivel 5', descripcion: 'Raíces Cuadradas', emoji: '√',  color: '#ef4444' },
    { id: 6, nombre: 'Nivel 6', descripcion: 'Fracciones y %',   emoji: '🏆', color: '#f97316' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.nombre      = this.auth.getNombre();
    this.nivelActual = this.auth.getNivelActual();
    this.vidas       = this.auth.getVidas();
    this.avatarUrl   = this.auth.getAvatarUrl();
    this.xp          = this.auth.getXp();
    this.rol         = this.auth.getRol();
  }

  seleccionarNivel(nivel: number) {
    if (nivel > this.nivelActual) return;
    this.router.navigate(['/ejercicios', nivel]);
  }

  logout() { this.auth.logout(); }
  irPerfil() { this.router.navigate(['/perfil']); }

  /** % de niveles completados (nivel 1 = 0%). */
  get progresoGeneral(): number {
    return Math.round(((this.nivelActual - 1) / this.niveles.length) * 100);
  }

  get mensajeProgreso(): string {
    return this.progresoGeneral >= 50 ? '¡Vas muy bien!' : '¡Sigue así, tú puedes!';
  }

  get corazones(): string {
    return '❤️'.repeat(this.vidas) + '🖤'.repeat(Math.max(0, 5 - this.vidas));
  }
}