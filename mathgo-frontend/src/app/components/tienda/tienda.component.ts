import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TiendaService, ItemTienda } from '../../services/tienda.service';

import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';
import { HeartsComponent } from '../../shared/hearts/hearts.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, NavComponent, HeartsComponent, SceneComponent],
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

  readonly PRECIO_VIDA = 50;
  readonly MAX_VIDAS = 5;

  pistas = [
    { emoji: '➕', texto: 'Responde sumas correctamente y gana 10 monedas cada una' },
    { emoji: '➖', texto: 'En el nivel 2 de restas ganas 15 monedas por respuesta' },
    { emoji: '✖️', texto: 'El nivel 3 es el más difícil pero da 20 monedas por acierto' },
    { emoji: '🔥', texto: 'Completa todos los ejercicios sin fallar para juntar más rápido' },
    { emoji: '🪙', texto: 'Cada vida cuesta 50 monedas — ¡cuida tus corazones!' },
    { emoji: '⭐', texto: 'Los avatares más raros cuestan más, ¡ahorra y desbloquéalos!' },
  ];

  constructor(
    private auth: AuthService,
    public tienda: TiendaService,
    private router: Router
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
    this.mensaje = resultado.mensaje;
    this.mensajeOk = resultado.ok;
    this.mostrarToast();
  }

  usar(item: ItemTienda): void {
    this.auth.setAvatarActivo(item.estilo);
    this.avatarActual = item.estilo;
    this.mensaje = `¡Usando ${item.nombre}!`;
    this.mensajeOk = true;
    this.mostrarToast();
  }

  comprarVida(): void {
    if (this.vidas >= this.MAX_VIDAS) {
      this.mensaje = '¡Ya tienes todas las vidas!';
      this.mensajeOk = false;
      this.mostrarToast();
      return;
    }
    if (this.xp < this.PRECIO_VIDA) {
      this.mensaje = `Te faltan ${this.PRECIO_VIDA - this.xp} monedas para una vida`;
      this.mensajeOk = false;
      this.mostrarToast();
      return;
    }
    this.auth.guardarProgreso({ xp: this.xp - this.PRECIO_VIDA, vidas: this.vidas + 1 }).subscribe();
    this.xp = this.auth.getXp();
    this.vidas = this.auth.getVidas();
    this.mensaje = `❤️ ¡Vida restaurada! Te quedan ${this.vidas} vidas`;
    this.mensajeOk = true;
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