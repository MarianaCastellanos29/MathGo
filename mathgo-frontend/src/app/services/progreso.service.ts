import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private readonly API = 'http://localhost:8080/progreso';
  constructor(private http: HttpClient) {}

  obtenerProgreso(usuarioId: number): Observable<ProgresoResponse> {
    return this.http.get<ProgresoResponse>(`${this.API}/${usuarioId}`);
  }
}
