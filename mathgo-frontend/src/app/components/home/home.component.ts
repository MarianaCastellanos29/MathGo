import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { PyroComponent } from '../../shared/pyro/pyro.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';
import { GradoService } from '../../services/grado.service';
import { obtenerSesion } from '../../services/grado-utils';
import { NivelGrado, nivelesDeGrado, etiquetaGrado, gradoGuardado } from '../../utils/niveles-grado';

type EstadoNivel = 'hecho' | 'actual' | 'misterio';
interface NivelMapa { nivel: NivelGrado; estado: EstadoNivel; }

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

  grado: number | null = null;
  niveles: NivelGrado[] = [];
  mapa: NivelMapa[] = [];
  cargandoGrado = true;

  constructor(private auth: AuthService, private router: Router, private gradoService: GradoService) {}

  ngOnInit(): void {
    this.nombre      = this.auth.getNombre();
    this.nivelActual = this.auth.getNivelActual();
    this.vidas       = this.auth.getVidas();
    this.avatarUrl   = this.auth.getAvatarUrl();
    this.xp          = this.auth.getXp();
    this.rol         = this.auth.getRol();

    // 1) pintamos al instante con lo que ya está guardado...
    this.aplicarGrado(gradoGuardado());
    this.cargandoGrado = this.grado === null;

    // 2) ...y confirmamos con el servidor (grado y nivel pueden haber cambiado)
    const { id } = obtenerSesion();
    if (id) {
      this.gradoService.consultarGrado(id).subscribe({
        next: (r) => {
          if (r.grado) localStorage.setItem('grado', String(r.grado));
          if (r.nivelActual > this.nivelActual) {
            this.nivelActual = r.nivelActual;
            localStorage.setItem('nivelActual', String(r.nivelActual));
          }
          this.aplicarGrado(r.grado ?? this.grado);
          this.cargandoGrado = false;
        },
        error: () => { this.cargandoGrado = false; }
      });
    } else {
      this.cargandoGrado = false;
    }
  }

  /** Niveles del grado; solo se muestran los que el niño ya puede jugar + UNO de adelanto. */
  private aplicarGrado(grado: number | null): void {
    this.grado = grado;
    this.niveles = nivelesDeGrado(grado);
    this.mapa = this.construirMapa();
  }

  private construirMapa(): NivelMapa[] {
    if (!this.grado) return [];
    const actual = Math.min(Math.max(this.nivelActual, 1), this.niveles.length);
    const lista: NivelMapa[] = [];
    for (const nivel of this.niveles) {
      if (nivel.id < actual) lista.push({ nivel, estado: 'hecho' });
      else if (nivel.id === actual) lista.push({ nivel, estado: 'actual' });
      else if (nivel.id === actual + 1) lista.push({ nivel, estado: 'misterio' });
    }
    return lista;
  }

  get etiquetaGrado(): string { return etiquetaGrado(this.grado); }

  get nivelesJugables(): number { return this.mapa.filter(m => m.estado !== 'misterio').length; }

  seleccionarNivel(item: NivelMapa) {
    if (item.estado === 'misterio') return;
    this.router.navigate(['/ejercicios', item.nivel.id]);
  }

  cambiarGrado() {
    sessionStorage.setItem('urlPendienteGrado', '/home');
    this.router.navigate(['/seleccion-grado']);
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