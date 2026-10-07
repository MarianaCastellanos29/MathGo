import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginResponse, Usuario } from '../models/models';

/** Campos de progreso que se pueden guardar en el backend (usuario NINO). */
export interface ProgresoGuardable {
  vidas?: number;
  nivelActual?: number;
  xp?: number;
  rango?: string;
  rachaActual?: number;
  mejorRacha?: number;
  avatar?: string;
  itemsComprados?: string;
}

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
        localStorage.setItem('avatar', res.avatar ?? 'adventurer');
        localStorage.setItem('itemsComprados', JSON.stringify(
          (res.itemsComprados ?? 'adventurer').split(',').map(s => s.trim()).filter(Boolean)
        ));
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

  getItemsComprados(): string[] {
    const raw = localStorage.getItem('itemsComprados');
    const comprados: string[] = raw ? JSON.parse(raw) : ['adventurer'];
    if (!comprados.includes('adventurer')) comprados.push('adventurer');
    return comprados;
  }

  getAvatar(): string {
    return localStorage.getItem('avatar') ?? 'adventurer';
  }

  getAvatarUrl(): string {
    const estilo = this.getAvatar();
    const nombre = this.getNombre();
    return `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(nombre)}&backgroundColor=b6e3f4`;
  }

  /**
   * Actualiza el progreso en localStorage (para que la UI reaccione al instante)
   * y lo envía al backend para que quede guardado de verdad en la base de datos.
   * Si no hay conexión, el cambio se queda en localStorage y no rompe la sesión
   * actual, aunque no haya podido sincronizarse.
   */
  guardarProgreso(datos: ProgresoGuardable): Observable<any> {
    if (datos.vidas !== undefined) localStorage.setItem('vidas', datos.vidas.toString());
    if (datos.nivelActual !== undefined) localStorage.setItem('nivelActual', datos.nivelActual.toString());
    if (datos.xp !== undefined) localStorage.setItem('xp', datos.xp.toString());
    if (datos.rango !== undefined) localStorage.setItem('rango', datos.rango);
    if (datos.rachaActual !== undefined) localStorage.setItem('rachaActual', datos.rachaActual.toString());
    if (datos.avatar !== undefined) localStorage.setItem('avatar', datos.avatar);
    if (datos.itemsComprados !== undefined) {
      localStorage.setItem('itemsComprados', JSON.stringify(datos.itemsComprados.split(',').filter(Boolean)));
    }

    const id = this.getUsuarioId();
    if (!id) return of(null);
    return this.http.put(`${this.API}/${id}/progreso`, datos).pipe(
      catchError(err => {
        console.error('No se pudo guardar el progreso en el servidor', err);
        return of(null);
      })
    );
  }

  /** Compra un avatar: lo agrega a la lista de comprados y lo guarda en el backend. */
  comprarAvatar(itemId: string): void {
    const comprados = this.getItemsComprados();
    if (!comprados.includes(itemId)) comprados.push(itemId);
    this.guardarProgreso({ itemsComprados: comprados.join(',') }).subscribe();
  }

  /** Selecciona el avatar activo y lo guarda en el backend. */
  setAvatarActivo(estilo: string): void {
    this.guardarProgreso({ avatar: estilo }).subscribe();
  }
}
