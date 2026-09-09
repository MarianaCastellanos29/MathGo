import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo = '';
  password = '';
  error = '';
  cargando = false;
  mensajePadre = '';
  mostrarMensaje = false;
  rolLogin = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.correo, this.password).subscribe({
      next: (res) => {
        this.cargando = false;
        this.rolLogin = res.rol;

        if (res.rol === 'ALUMNO') {
          // Verificar si hay mensaje del padre
          this.http.get<any>(`http://localhost:8080/usuarios/${res.usuarioId}/mensaje`).subscribe({
            next: (data) => {
              if (data.mensaje && data.mensaje.trim() !== '') {
                this.mensajePadre = data.mensaje;
                this.mostrarMensaje = true;
              } else {
                this.router.navigate(['/home']);
              }
            },
            error: () => this.router.navigate(['/home'])
          });
        } else {
          this.router.navigate(['/padre']);
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Correo o contraseña incorrectos';
      }
    });
  }

  cerrarMensaje() {
    this.mostrarMensaje = false;
    this.router.navigate(['/home']);
  }
}