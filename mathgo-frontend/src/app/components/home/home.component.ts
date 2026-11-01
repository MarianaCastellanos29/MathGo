import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { PyroComponent } from '../../shared/pyro/pyro.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';
import { GradoService } from '../../services/grado.service';
import { obtenerSesion } from '../../services/grado-utils';
import { NivelGrado, nivelesDeGrado, etiquetaGrado, gradoGuardado } from '../../utils/niveles-grado';
import {
  claveGradoEnFrase,
  claveGradoNombre,
  claveNivelDescripcion,
  claveNivelTema
} from '../../utils/claves-traduccion';

type EstadoNivel = 'hecho' | 'actual' | 'misterio';
interface NivelMapa { nivel: NivelGrado; estado: EstadoNivel; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NavComponent, PyroComponent, HeartsComponent, SceneComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nombre: string = '';
  nivelActual: number = 1;
  /** Niveles ya terminados en el grado actual (0 a 3). */
  nivelesCompletados = 0;
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
    const guardados = localStorage.getItem('nivelesCompletados');
    this.nivelesCompletados = guardados !== null && guardados !== '' && !Number.isNaN(Number(guardados))
      ? Number(guardados)
      : Math.max(0, this.nivelActual - 1);
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
          // El servidor es la fuente de verdad del nivel. Antes solo se aceptaba si era mayor,
          // y al cambiar de grado se quedaba el nivel del grado anterior.
          if (typeof r.nivelActual === 'number' && r.nivelActual >= 1) {
            this.nivelActual = r.nivelActual;
            localStorage.setItem('nivelActual', String(r.nivelActual));
          }
          if (typeof r.nivelesCompletados === 'number') {
            this.nivelesCompletados = r.nivelesCompletados;
            localStorage.setItem('nivelesCompletados', String(r.nivelesCompletados));
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
    // Con el avance por grado: los niveles hasta "hechos" están completos, el siguiente es el actual
    const hechos = Math.min(Math.max(this.nivelesCompletados, 0), this.niveles.length);
    const lista: NivelMapa[] = [];
    for (const nivel of this.niveles) {
      if (nivel.id <= hechos) lista.push({ nivel, estado: 'hecho' });
      else if (nivel.id === hechos + 1) lista.push({ nivel, estado: 'actual' });
      else if (nivel.id === hechos + 2) lista.push({ nivel, estado: 'misterio' });
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
    const hechos = Math.min(Math.max(this.nivelesCompletados, 0), this.niveles.length);
    return Math.round((hechos / this.niveles.length) * 100);
  }

  /** true cuando el niño ya terminó los 3 niveles de su grado. */
  get gradoCompletado(): boolean {
    return this.grado !== null && this.nivelesCompletados >= this.niveles.length;
  }

  get mensajeProgreso(): string {
    return this.progresoGeneral >= 50 ? '¡Vas muy bien!' : '¡Sigue así, tú puedes!';
  }

  get corazones(): string {
    return '❤️'.repeat(this.vidas) + '🖤'.repeat(Math.max(0, 5 - this.vidas));
  }

  // ----- Claves de traducción usadas por la plantilla -----

  /** Clave del mensaje de progreso (mensajeProgreso se conserva por compatibilidad). */
  get claveMensajeProgreso(): string {
    return this.progresoGeneral >= 50 ? 'HOME.VAS_MUY_BIEN' : 'HOME.SIGUE_ASI';
  }

  get claveGrado(): string { return claveGradoNombre(this.grado); }

  get claveGradoEnFrase(): string { return claveGradoEnFrase(this.grado); }

  claveTema(item: NivelMapa): string { return claveNivelTema(this.grado, item.nivel.id); }

  claveDescripcion(item: NivelMapa): string { return claveNivelDescripcion(this.grado, item.nivel.id); }
}
