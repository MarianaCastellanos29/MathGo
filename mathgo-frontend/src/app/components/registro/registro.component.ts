import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { SelectorIdiomaComponent } from '../../shared/selector-idioma/selector-idioma.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, SelectorIdiomaComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  password = '';
  rol = 'ALUMNO';
  /** Claves de traduccion (se traducen en la plantilla, asi cambian con el idioma). */
  error = '';
  exito = '';
  cargando = false;

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.error = '';
    this.exito = '';
    this.cargando = true;
    this.auth.registrar({ nombre: this.nombre, correo: this.correo, password: this.password, rol: this.rol }).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = 'REGISTRO.CUENTA_CREADA';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.cargando = false;
        this.error = 'REGISTRO.ERROR_REGISTRO';
      }
    });
  }
}
