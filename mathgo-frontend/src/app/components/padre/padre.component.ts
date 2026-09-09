import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PadreService } from '../../services/padre.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-padre',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './padre.component.html',
  styleUrls: ['./padre.component.scss']
})
export class PadreComponent implements OnInit {
  // Login del niño
  correoNino: string = '';
  passwordNino: string = '';
  errorLogin: string = '';
  cargandoLogin: boolean = false;

  // Estado
  alumnoSeleccionado: any = null;
  reporte: any = null;
  historial: any[] = [];
  logros: any[] = [];
  mensaje: string = '';
  mensajeEnviado: boolean = false;
  vidasDadas: boolean = false;
  cargando: boolean = false;
  avatarUrl: string = '';

  nombrePadre: string = '';

  constructor(
    private padreService: PadreService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.nombrePadre = this.auth.getNombre();
  }

  buscarNino(): void {
    if (!this.correoNino.trim() || !this.passwordNino.trim()) {
      this.errorLogin = 'Ingresa el correo y contraseña del niño';
      return;
    }
    this.cargandoLogin = true;
    this.errorLogin = '';
    this.padreService.loginNino(this.correoNino, this.passwordNino).subscribe({
      next: (alumno) => {
        this.cargandoLogin = false;
        this.seleccionar(alumno);
      },
      error: () => {
        this.cargandoLogin = false;
        this.errorLogin = 'Correo o contraseña incorrectos';
      }
    });
  }

  seleccionar(alumno: any): void {
    this.alumnoSeleccionado = alumno;
    this.reporte = null;
    this.historial = [];
    this.logros = [];
    this.mensaje = '';
    this.mensajeEnviado = false;
    this.vidasDadas = false;
    this.avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(alumno.nombre)}&backgroundColor=b6e3f4`;
    this.cargarDatos(alumno.id);
  }

  cargarDatos(id: number): void {
    this.cargando = true;
    this.padreService.reporteSemanal(id).subscribe({
      next: (data) => { this.reporte = data; this.cargando = false; }
    });
    this.padreService.obtenerHistorial(id).subscribe({
      next: (data) => this.historial = data.slice(0, 10)
    });
    this.padreService.obtenerLogros(id).subscribe({
      next: (data) => this.logros = data
    });
  }

  darVidas(): void {
    if (!this.alumnoSeleccionado) return;
    this.padreService.darVidas(this.alumnoSeleccionado.id, 5).subscribe({
      next: (res) => {
        this.alumnoSeleccionado.vidas = res.vidas;
        this.vidasDadas = true;
        setTimeout(() => this.vidasDadas = false, 3000);
      }
    });
  }

  enviarMensaje(): void {
    if (!this.mensaje.trim() || !this.alumnoSeleccionado) return;
    this.padreService.enviarMensaje(this.alumnoSeleccionado.id, this.mensaje).subscribe({
      next: () => {
        this.mensajeEnviado = true;
        this.mensaje = '';
        setTimeout(() => this.mensajeEnviado = false, 3000);
      }
    });
  }

  volver(): void {
    this.alumnoSeleccionado = null;
    this.reporte = null;
    this.correoNino = '';
    this.passwordNino = '';
  }

  logout(): void {
    this.auth.logout();
  }

  get rangoEmoji(): string {
    switch(this.alumnoSeleccionado?.rango) {
      case 'Genio': return '🏆';
      case 'Matematico': return '🎓';
      case 'Estudiante': return '📚';
      default: return '🌱';
    }
  }

  get corazones(): string {
    const v = this.alumnoSeleccionado?.vidas ?? 0;
    return '❤️'.repeat(v) + '🖤'.repeat(Math.max(0, 5 - v));
  }

  nivelNombre(nivel: number): string {
    const nombres: Record<number, string> = {
      1: 'Sumas', 2: 'Restas', 3: 'Mult/Div'
    };
    return nombres[nivel] ?? `Nivel ${nivel}`;
  }
}