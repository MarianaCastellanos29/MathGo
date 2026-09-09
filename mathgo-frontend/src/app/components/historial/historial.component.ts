import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HistorialService } from '../../services/historial.service';
import { HistorialItem } from '../../models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  historial: HistorialItem[] = [];

  constructor(private historialService: HistorialService, private auth: AuthService) {}

  ngOnInit(): void {
    const usuarioId = this.auth.getUsuarioId();
    this.historialService.obtenerHistorial(usuarioId).subscribe({
      next: (data) => this.historial = data,
      error: (err) => console.error(err)
    });
  }

  nivelNombre(nivel: number): string {
    const nombres: Record<number, string> = {
      1: 'Sumas', 2: 'Restas', 3: 'Mult/Div',
      4: 'Potencias', 5: 'Fracciones'
    };
    return nombres[nivel] ?? `Nivel ${nivel}`;
  }

  get totalCorrectos(): number   { return this.historial.filter(h => h.correcto).length; }
  get totalIncorrectos(): number { return this.historial.filter(h => !h.correcto).length; }
  get porcentaje(): number {
    if (this.historial.length === 0) return 0;
    return Math.round((this.totalCorrectos / this.historial.length) * 100);
  }
}