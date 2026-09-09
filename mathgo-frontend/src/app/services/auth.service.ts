import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API}/registro`, usuario);
  }

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, { correo, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuarioId', res.usuarioId.toString());
        localStorage.setItem('nombre', res.nombre);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('vidas', res.vidas.toString());
        localStorage.setItem('nivelActual', res.nivelActual.toString());
        localStorage.setItem('xp', (res.xp ?? 0).toString());
        localStorage.setItem('rango', res.rango ?? 'Aprendiz');
        localStorage.setItem('rachaActual', (res.rachaActual ?? 0).toString());
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioId(): number {
    return Number(localStorage.getItem('usuarioId'));
  }

  getNombre(): string {
    return localStorage.getItem('nombre') ?? '';
  }

  getRol(): string {
    return localStorage.getItem('rol') ?? '';
  }

  getVidas(): number {
    return Number(localStorage.getItem('vidas'));
  }

  getNivelActual(): number {
    return Number(localStorage.getItem('nivelActual'));
  }

  getXp(): number {
    return Number(localStorage.getItem('xp'));
  }

  getRango(): string {
    return localStorage.getItem('rango') ?? 'Aprendiz';
  }

  getRachaActual(): number {
    return Number(localStorage.getItem('rachaActual'));
  }

  setVidas(v: number): void {
    localStorage.setItem('vidas', v.toString());
  }

  setNivelActual(nivel: number): void {
    localStorage.setItem('nivelActual', nivel.toString());
  }

  setXp(xp: number): void {
    localStorage.setItem('xp', xp.toString());
  }

  setRango(rango: string): void {
    localStorage.setItem('rango', rango);
  }

  setRachaActual(racha: number): void {
    localStorage.setItem('rachaActual', racha.toString());
  }

  getAvatar(): string {
    return localStorage.getItem('avatar') ?? 'adventurer';
  }

  setAvatar(estilo: string): void {
    localStorage.setItem('avatar', estilo);
  }

  getAvatarUrl(): string {
    const estilo = this.getAvatar();
    const nombre = this.getNombre();
    return `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(nombre)}&backgroundColor=b6e3f4`;
  }
}