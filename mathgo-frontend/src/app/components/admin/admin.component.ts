import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgresoService } from '../../services/progreso.service';
import { Usuario, ProgresoResponse } from '../../models/models';

interface AlumnoConProgreso extends Usuario {
  progreso?: ProgresoResponse;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  alumnos: AlumnoConProgreso[] = [];
  nombre: string;
  rol: string;
  cargando = true;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private progresoService: ProgresoService,
    private router: Router
  ) {
    this.nombre = auth.getNombre();
    this.rol = auth.getRol();
  }

  ngOnInit(): void {
    this.http.get<Usuario[]>('http://localhost:8080/usuarios').subscribe({
      next: (usuarios) => {
        this.alumnos = usuarios.filter(u => u.rol === 'ALUMNO');
        this.alumnos.forEach(alumno => {
          this.progresoService.obtenerProgreso(alumno.id!).subscribe({
            next: (p) => alumno.progreso = p
          });
        });
        this.cargando = false;
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
