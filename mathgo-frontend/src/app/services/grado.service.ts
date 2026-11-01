import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { obtenerToken } from './grado-utils';

// Si tu frontend usa otra URL para el backend, cámbiala aquí.
export const API_URL = 'http://localhost:8080';

export interface GradoRespuesta {
  id: number;
  rol: string | null;
  grado: number | null;
  /** Nivel que le toca jugar en su grado actual (1 a 3). */
  nivelActual: number;
  /** Niveles ya terminados en su grado actual (0 a 3). */
  nivelesCompletados?: number;
  gradoCompletado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GradoService {
  private http = inject(HttpClient);

  private cabeceras(): HttpHeaders {
    const token = obtenerToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  consultarGrado(usuarioId: number): Observable<GradoRespuesta> {
    return this.http.get<GradoRespuesta>(`${API_URL}/usuarios/${usuarioId}/grado`, { headers: this.cabeceras() });
  }

  actualizarGrado(usuarioId: number, grado: number): Observable<GradoRespuesta> {
    return this.http.put<GradoRespuesta>(`${API_URL}/usuarios/${usuarioId}/grado`, { grado }, { headers: this.cabeceras() });
  }

  /** Anota en el servidor que el niño terminó un nivel de su grado actual. */
  registrarNivelCompletado(usuarioId: number, nivel: number): Observable<GradoRespuesta> {
    return this.http.post<GradoRespuesta>(
      `${API_URL}/usuarios/${usuarioId}/grado/nivel-completado`, { nivel }, { headers: this.cabeceras() });
  }
}
