import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogrosService } from '../../services/logros.service';
import { UsuarioLogro, Logro } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent],
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {
  logrosObtenidos: UsuarioLogro[] = [];
  todosLosLogros: Logro[] = [];
  xp: number = 0;
  rango: string = 'Aprendiz';
  rachaActual: number = 0;

  constructor(
    private logrosService: LogrosService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const usuarioId = this.auth.getUsuarioId();
    this.xp = this.auth.getXp();
    this.rango = this.auth.getRango();
    this.rachaActual = this.auth.getRachaActual();

    // Cargar todos los logros disponibles
    this.http.get<Logro[]>('http://localhost:8080/logros').subscribe({
      next: (data) => this.todosLosLogros = data,
      error: () => this.todosLosLogros = this.logrosDefault()
    });

    // Cargar logros obtenidos por el usuario
    this.logrosService.obtenerLogros(usuarioId).subscribe({
      next: (data) => this.logrosObtenidos = data,
      error: (err) => console.error(err)
    });
  }

  estaObtenido(logroId: number): boolean {
    return this.logrosObtenidos.some(ul => ul.logro.id === logroId);
  }

  fechaObtenido(logroId: number): string {
    const ul = this.logrosObtenidos.find(ul => ul.logro.id === logroId);
    return ul ? ul.fechaObtenido : '';
  }

  get rangoEmoji(): string {
    switch(this.rango) {
      case 'Genio': return '🏆';
      case 'Matematico': return '🎓';
      case 'Estudiante': return '📚';
      default: return '🌱';
    }
  }

  get porcentajeProgreso(): number {
    if (this.todosLosLogros.length === 0) return 0;
    return Math.round((this.logrosObtenidos.length / this.todosLosLogros.length) * 100);
  }

  private logrosDefault(): Logro[] {
    return [
      { id: 1, nombre: 'Primera racha', descripcion: 'Consigue una racha de 3 respuestas correctas', icono: '🔥', tipo: 'RACHA', valorRequerido: 3 },
      { id: 2, nombre: 'Racha de fuego', descripcion: 'Consigue una racha de 5 respuestas correctas', icono: '🔥🔥', tipo: 'RACHA', valorRequerido: 5 },
      { id: 3, nombre: 'Imparable', descripcion: 'Consigue una racha de 10 respuestas correctas', icono: '⚡', tipo: 'RACHA', valorRequerido: 10 },
      { id: 4, nombre: 'Primeros pasos', descripcion: 'Gana tus primeros 50 XP', icono: '⭐', tipo: 'XP', valorRequerido: 50 },
      { id: 5, nombre: 'Estudiante', descripcion: 'Gana 200 XP', icono: '📚', tipo: 'XP', valorRequerido: 200 },
      { id: 6, nombre: 'Genio matematico', descripcion: 'Gana 500 XP', icono: '🏆', tipo: 'XP', valorRequerido: 500 },
      { id: 7, nombre: 'Ejercitado', descripcion: 'Completa 10 ejercicios correctamente', icono: '✅', tipo: 'EJERCICIOS', valorRequerido: 10 },
      { id: 8, nombre: 'Experto', descripcion: 'Completa 25 ejercicios correctamente', icono: '🎯', tipo: 'EJERCICIOS', valorRequerido: 25 },
      { id: 9, nombre: 'Nivel 2', descripcion: 'Alcanza el nivel 2', icono: '🥈', tipo: 'NIVEL', valorRequerido: 2 },
      { id: 10, nombre: 'Nivel 3', descripcion: 'Alcanza el nivel 3', icono: '🥇', tipo: 'NIVEL', valorRequerido: 3 },
    ];
  }
}