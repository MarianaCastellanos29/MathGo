import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioLogro } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LogrosService {
  private readonly API = 'http://localhost:8080/historial';
  constructor(private http: HttpClient) {}

  obtenerLogros(usuarioId: number): Observable<UsuarioLogro[]> {
    return this.http.get<UsuarioLogro[]>(`${this.API}/${usuarioId}/logros`);
  }
}