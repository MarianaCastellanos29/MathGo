import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly API = 'http://localhost:8080/historial';

  constructor(private http: HttpClient) {}

  obtenerHistorial(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/${usuarioId}`);
  }

  guardarResultado(usuarioId: number, pregunta: string, nivel: number, correcto: boolean): Observable<any> {
    return this.http.post(`${this.API}/guardar`, { usuarioId, pregunta, nivel, correcto });
  }
}