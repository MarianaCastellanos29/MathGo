import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PadreService {
  private readonly API = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  loginNino(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}/login-nino`, { correo, password });
  }

  darVidas(id: number, vidas: number): Observable<any> {
    return this.http.post(`${this.API}/${id}/dar-vidas`, { vidas });
  }

  enviarMensaje(id: number, mensaje: string): Observable<any> {
    return this.http.post(`${this.API}/${id}/mensaje`, { mensaje });
  }

  reporteSemanal(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}/reporte-semanal`);
  }

  obtenerHistorial(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/historial/${id}`);
  }

  obtenerLogros(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/historial/${id}/logros`);
  }
}