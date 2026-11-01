import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EjercicioService, EjercicioAPI } from '../../services/ejercicio.service';
import { AuthService } from '../../services/auth.service';
import { HistorialService } from '../../services/historial.service';
import { GradoService } from '../../services/grado.service';
import { SonidoService } from '../../services/sonido.service';
import { MAX_NIVELES_GRADO, temaDeNivel, gradoGuardado } from '../../utils/niveles-grado';
import { claveGradoEnFrase as claveGradoFrase, claveNivelTema } from '../../utils/claves-traduccion';
import { PyroComponent } from '../../shared/pyro/pyro.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { VisualEjercicioComponent } from '../../shared/visual-ejercicio/visual-ejercicio.component';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule, TranslateModule, PyroComponent, HeartsComponent, SceneComponent, VisualEjercicioComponent],
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

  /** Resultado de cada pregunta: true = acertó, false = falló, null = aún sin responder. */
  resultados: (boolean | null)[] = [];
  racha = 0;
  mejorRachaNivel = 0;
  pistasRestantes = 2;
  /** true mientras se guarda en el servidor el nivel recien superado. */
  guardandoNivel = false;
  /** true si con este nivel el niño terminó los 3 niveles de su grado. */
  gradoCompletado = false;
  opcionesQuitadas: string[] = [];
  readonly letras = ['A', 'B', 'C'];

  confeti = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 1.2}s`,
    dur: `${2.4 + Math.random() * 2}s`,
    color: ['#34e6a4', '#ffc83d', '#ff7aa8', '#a98bff', '#6fd3ff'][i % 5]
  }));

  readonly MAX_NIVELES = MAX_NIVELES_GRADO;

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
    private historialService: HistorialService,
    private sonido: SonidoService,
    private gradoService: GradoService
  ) {}

  ngOnInit(): void {
    this.nivel = Number(this.route.snapshot.paramMap.get('nivel')) || 1;
    this.vidas = this.auth.getVidas();
    this.cargarEjercicios();
  }

  cargarEjercicios(): void {
    this.ejercicioService.obtenerEjerciciosAPI(this.nivel).subscribe({
      next: (lista) => {
        this.ejercicios = lista;
        this.resultados = lista.map(() => null);
      }
    });
  }

  get ejercicioActual(): EjercicioAPI {
    return this.ejercicios[this.indiceActual];
  }

  seleccionar(opcion: string): void {
    if (this.respuestaSeleccionada || this.cargandoDato) return;
    if (this.opcionesQuitadas.includes(opcion)) return;
    this.respuestaSeleccionada = opcion;
    const correcto = opcion === this.ejercicioActual.respuestaCorrecta;
    this.esCorrecta = correcto;
    this.resultados[this.indiceActual] = correcto;
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
      this.racha++;
      this.mejorRachaNivel = Math.max(this.mejorRachaNivel, this.racha);
      this.sonido.reproducir('acierto');
      const monedas = this.nivel * 10;
      this.monedasGanadas += monedas;
      this.mensajeFeedback = `✅ ¡Correcto! +${monedas} 🪙`;
      this.lanzarExplosion();

      // El dato curioso solo tiene sentido para respuestas que son un número entero
      const textoRespuesta = this.ejercicioActual.respuestaCorrecta.trim();
      if (/^\d+$/.test(textoRespuesta)) {
        const numero = Number.parseInt(textoRespuesta, 10);
        if (numero > 0) {
          this.ejercicioService.obtenerDatoCurioso(numero).subscribe({
            next: (dato) => {
              this.datoCurioso = dato;
              if (dato && this.datosCuriososNivel.length < 3) {
                this.datosCuriososNivel.push(dato);
              }
            }
          });
        }
      }
    } else {
      this.racha = 0;
      this.sonido.reproducir('error');
      this.vidas = Math.max(0, this.vidas - 1);
      this.auth.guardarProgreso({ vidas: this.vidas }).subscribe();
      this.mensajeFeedback = `❌ Respuesta incorrecta`;

      if (this.ejercicioActual.explicacion) {
        this.explicacionError = `${this.ejercicioActual.explicacion}`;
      } else {
        this.ejercicioService.explicarError(
          this.ejercicioActual.pregunta,
          this.ejercicioActual.respuestaCorrecta,
          opcion
        ).subscribe({
          next: (explicacion) => this.explicacionError = explicacion
        });
      }

      if (this.vidas === 0) {
        setTimeout(() => this.sinVidas = true, 1800);
      }
    }
  }

  /** Pista: quita una opción incorrecta. Se puede usar una vez por pregunta, hasta 2 por nivel. */
  usarPista(): void {
    if (!this.pistaDisponible) return;
    const incorrectas = this.ejercicioActual.opciones.filter(
      o => o !== this.ejercicioActual.respuestaCorrecta && !this.opcionesQuitadas.includes(o)
    );
    if (incorrectas.length <= 1) return;
    const quitar = incorrectas[Math.floor(Math.random() * incorrectas.length)];
    this.opcionesQuitadas.push(quitar);
    this.pistasRestantes--;
    this.sonido.reproducir('pista');
  }

  get pistaDisponible(): boolean {
    return !!this.ejercicioActual
      && !this.respuestaSeleccionada
      && this.pistasRestantes > 0
      && this.opcionesQuitadas.length === 0;
  }

  alternarSonido(): void { this.sonido.alternar(); }
  get sonidoActivo(): boolean { return this.sonido.activo; }

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
    this.opcionesQuitadas = [];
    this.indiceActual++;

    if (this.indiceActual >= this.ejercicios.length) {
      this.ejercicioService.mensajePyro(this.puntaje, this.ejercicios.length, this.nivel).subscribe({
        next: (msg) => this.mensajePyroFinal = msg,
        error: () => this.mensajePyroFinal = '¡Lo hiciste genial! 🔥'
      });
      this.finNivel = true;
      if (this.estrellas >= 2) this.sonido.reproducir('victoria');
      // El servidor anota el nivel terminado y devuelve el avance del grado.
      // Los botones del final esperan a que responda para que la pantalla de inicio lea el dato nuevo.
      const usuarioId = this.auth.getUsuarioId();
      if (usuarioId) {
        this.guardandoNivel = true;
        this.gradoService.registrarNivelCompletado(usuarioId, this.nivel).subscribe({
          next: (r) => {
            localStorage.setItem('nivelActual', String(r.nivelActual));
            localStorage.setItem('nivelesCompletados', String(r.nivelesCompletados ?? 0));
            this.gradoCompletado = !!r.gradoCompletado;
            this.guardandoNivel = false;
          },
          error: () => this.guardandoNivel = false
        });
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

  get ultimaPregunta(): boolean {
    return this.indiceActual + 1 >= this.ejercicios.length;
  }

  /** Divide la pregunta para resaltar los números en verde. */
  get preguntaPartes(): { t: string; n: boolean }[] {
    const texto = this.ejercicioActual?.pregunta ?? '';
    return texto.split(/(\d+(?:[.,]\d+)?)/)
      .filter(t => t !== '')
      .map(t => ({ t, n: /^\d/.test(t) }));
  }

  /** Las preguntas con historia son largas: se muestran con letra más pequeña. */
  get preguntaLarga(): boolean {
    return (this.ejercicioActual?.pregunta ?? '').length > 40;
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
    return temaDeNivel(gradoGuardado(), this.nivel);
  }

  /** Clave de traducción del tema del nivel (para la plantilla). */
  get claveTema(): string {
    return claveNivelTema(gradoGuardado(), this.nivel);
  }

  /** Clave de traducción del grado, en minúsculas, para usarlo dentro de una frase. */
  get claveGradoEnFrase(): string {
    return claveGradoFrase(gradoGuardado());
  }

  elegirOtroGrado(): void {
    sessionStorage.setItem('urlPendienteGrado', '/home');
    this.router.navigate(['/seleccion-grado']);
  }
}
