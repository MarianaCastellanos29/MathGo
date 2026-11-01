import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { IdiomaService } from '../../services/idioma.service';
import { HeartsComponent } from '../hearts/hearts.component';
import { SelectorIdiomaComponent } from '../selector-idioma/selector-idioma.component';

/** Barra superior compartida por todas las pantallas del niño. */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule, HeartsComponent, SelectorIdiomaComponent],
  template: `
  <header class="mg-nav">
    <a routerLink="/home" class="mg-brand" [attr.aria-label]="'NAV.MARCA_ARIA' | translate"><img src="assets/img/logo.png" alt="MathGo" /></a>
    <nav class="mg-links" [attr.aria-label]="'NAV.PRINCIPAL' | translate">
      <a routerLink="/home" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg><em>{{ 'NAV.INICIO' | translate }}</em></a>
      <a routerLink="/progreso" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20v-9M12 20V5M19 20v-8"/></svg><em>{{ 'NAV.PROGRESO' | translate }}</em></a>
      <a routerLink="/logros" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14l-2 7 5.5-3 5.5 3-2-7"/></svg><em>{{ 'NAV.LOGROS' | translate }}</em></a>
      <a routerLink="/tienda" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/></svg><em>{{ 'NAV.TIENDA' | translate }}</em></a>
      <a routerLink="/juegos" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="15.5" cy="11.5" r="1"/><circle cx="17.5" cy="13.5" r="1"/></svg><em>{{ 'NAV.JUEGOS' | translate }}</em></a>
      <a routerLink="/apoyo" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5v13z"/><path d="M4 19.5V6.5"/></svg><em>{{ 'NAV.APOYO' | translate }}</em></a>
      <a routerLink="/perfil" routerLinkActive="on"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-6 8-6s8 2 8 6"/></svg><em>{{ 'NAV.PERFIL' | translate }}</em></a>
    </nav>
    <div class="mg-nav-right">
      <span class="mg-pill mg-coins"><i class="mg-coin"></i>{{ xp | number:'1.0-0':idiomaService.locale() }}</span>
      <app-hearts class="mg-nav-hearts" [vidas]="vidas"></app-hearts>
      <button class="mg-user" (click)="ir('/perfil')" [attr.aria-label]="'NAV.MI_PERFIL' | translate">
        <img [src]="avatarUrl" [alt]="nombre" /><span>{{ nombre }}</span>
      </button>
      <button class="mg-pill mg-exit" style="white-space: nowrap" (click)="logout()">{{ 'NAV.SALIR' | translate }}</button>
      <app-selector-idioma></app-selector-idioma>
    </div>
  </header>`
})
export class NavComponent {
  readonly idiomaService = inject(IdiomaService);

  nombre = this.auth.getNombre();
  xp = this.auth.getXp();
  vidas = this.auth.getVidas();
  nivelActual = this.auth.getNivelActual();
  avatarUrl = this.auth.getAvatarUrl();

  constructor(private auth: AuthService, private router: Router) {}
  ir(ruta: string) { this.router.navigate([ruta]); }
  logout() { this.auth.logout(); }
}
