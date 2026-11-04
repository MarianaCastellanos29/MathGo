import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { IdiomaService } from '../../services/idioma.service';
import { TiendaService, ItemTienda } from '../../services/tienda.service';

import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, TranslateModule, NavComponent, HeartsComponent, SceneComponent],
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  nombre: string = '';
  xp: number = 0;
  vidas: number = 5;
  avatarActual: string = '';
  items: ItemTienda[] = [];
  mensaje: string = '';
  mensajeOk: boolean = false;
  mostrarMensaje: boolean = false;

  readonly idiomaService = inject(IdiomaService);

  readonly PRECIO_VIDA = 50;
  readonly MAX_VIDAS = 5;

  /** Consejos para ganar monedas. Se ganan nivel × 10 monedas por respuesta correcta. */
  pistas: { emoji: string; clave: string; params: Record<string, number> }[] = [
    { emoji: '➕', clave: 'TIENDA.PISTA_1', params: {} },
    { emoji: '➖', clave: 'TIENDA.PISTA_2', params: {} },
    { emoji: '✖️', clave: 'TIENDA.PISTA_3', params: {} },
    { emoji: '🔥', clave: 'TIENDA.PISTA_4', params: {} },
    { emoji: '🪙', clave: 'TIENDA.PISTA_5', params: { precio: this.PRECIO_VIDA } },
    { emoji: '⭐', clave: 'TIENDA.PISTA_6', params: {} },
  ];

  constructor(
    private auth: AuthService,
    public tienda: TiendaService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.nombre = this.auth.getNombre();
    this.xp = this.auth.getXp();
    this.vidas = this.auth.getVidas();
    this.avatarActual = this.auth.getAvatar();
    this.items = this.tienda.items;
  }

  comprar(item: ItemTienda): void {
    const resultado = this.tienda.comprar(item);
    this.xp = this.auth.getXp();
    this.avisar(resultado.clave, resultado.params, resultado.ok);
  }

  usar(item: ItemTienda): void {
    this.auth.setAvatarActivo(item.estilo);
    this.avatarActual = item.estilo;
    this.avisar('TIENDA.USANDO', { avatar: item.id }, true);
  }

  comprarVida(): void {
    if (this.vidas >= this.MAX_VIDAS) {
      this.avisar('TIENDA.TODAS_VIDAS', {}, false);
      return;
    }
    if (this.xp < this.PRECIO_VIDA) {
      this.avisar('TIENDA.FALTAN_PARA_VIDA', { faltan: this.PRECIO_VIDA - this.xp }, false);
      return;
    }
    this.auth.guardarProgreso({ xp: this.xp - this.PRECIO_VIDA, vidas: this.vidas + 1 }).subscribe();
    this.xp = this.auth.getXp();
    this.vidas = this.auth.getVidas();
    this.avisar('TIENDA.VIDA_RESTAURADA', { n: this.vidas }, true);
  }

  /** Muestra un aviso traducido al idioma elegido. Si trae "avatar", añade su nombre traducido. */
  private avisar(clave: string, params: Record<string, string | number>, ok: boolean): void {
    const parametros: Record<string, string | number> = { ...params };
    const avatar = parametros['avatar'];
    if (typeof avatar === 'string') {
      parametros['nombre'] = this.translate.instant(`AVATARES.${avatar}.NOMBRE`);
    }
    this.mensaje = this.translate.instant(clave, parametros);
    this.mensajeOk = ok;
    this.mostrarToast();
  }

  mostrarToast(): void {
    this.mostrarMensaje = true;
    setTimeout(() => this.mostrarMensaje = false, 2500);
  }

  getPreview(estilo: string): string {
    return this.tienda.getAvatarPreview(estilo, this.nombre);
  }

  irHome(): void {
    this.router.navigate(['/home']);
  }

  get corazones(): string {
    return '❤️'.repeat(this.vidas) + '🖤'.repeat(Math.max(0, this.MAX_VIDAS - this.vidas));
  }
}
