import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface ItemTienda {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estilo: string;
  emoji: string;
}

/** Resultado de una compra. "clave" y "params" sirven para mostrar el mensaje en el idioma elegido. */
export interface ResultadoCompra {
  ok: boolean;
  /** Mensaje en español (se conserva por compatibilidad). */
  mensaje: string;
  clave: string;
  params: Record<string, string | number>;
}

@Injectable({ providedIn: 'root' })
export class TiendaService {

  /** nombre y descripcion están en español; la pantalla los traduce con AVATARES.<id>.NOMBRE y .DESCRIPCION. */
  readonly items: ItemTienda[] = [
    { id: 'adventurer',       nombre: 'Aventurero',    descripcion: 'El avatar clásico',          precio: 0,   estilo: 'adventurer',       emoji: '🧙' },
    { id: 'pixel-art',        nombre: 'Pixel Art',     descripcion: 'Estilo retro pixelado',      precio: 50,  estilo: 'pixel-art',        emoji: '🎮' },
    { id: 'bottts',           nombre: 'Robot',         descripcion: 'Un robot genial',            precio: 80,  estilo: 'bottts',           emoji: '🤖' },
    { id: 'fun-emoji',        nombre: 'Emoji Fun',     descripcion: 'Divertido y colorido',       precio: 100, estilo: 'fun-emoji',        emoji: '😄' },
    { id: 'lorelei',          nombre: 'Lorelei',       descripcion: 'Estilo elegante',            precio: 120, estilo: 'lorelei',          emoji: '🧝' },
    { id: 'thumbs',           nombre: 'Thumbs',        descripcion: 'Simpático y amigable',       precio: 150, estilo: 'thumbs',           emoji: '👍' },
    { id: 'micah',            nombre: 'Micah',         descripcion: 'Arte minimalista',           precio: 200, estilo: 'micah',            emoji: '🎨' },
    { id: 'avataaars',        nombre: 'Avataaars',     descripcion: 'El más popular',             precio: 250, estilo: 'avataaars',        emoji: '⭐' },
  ];

  constructor(private auth: AuthService) {}

  getItemsComprados(): string[] {
    return this.auth.getItemsComprados();
  }

  estaComprado(itemId: string): boolean {
    return this.getItemsComprados().includes(itemId);
  }

  comprar(item: ItemTienda): ResultadoCompra {
    if (this.estaComprado(item.id)) {
      return { ok: false, mensaje: 'Ya tienes este avatar', clave: 'TIENDA.YA_TIENES_AVATAR', params: {} };
    }
    const xp = this.auth.getXp();
    if (xp < item.precio) {
      return {
        ok: false,
        mensaje: `Te faltan ${item.precio - xp} monedas`,
        clave: 'TIENDA.FALTAN_MONEDAS',
        params: { faltan: item.precio - xp }
      };
    }
    const nuevaXp = xp - item.precio;
    const comprados = [...this.getItemsComprados(), item.id];
    this.auth.guardarProgreso({ xp: nuevaXp, itemsComprados: comprados.join(',') }).subscribe();
    return {
      ok: true,
      mensaje: `¡${item.nombre} desbloqueado!`,
      clave: 'TIENDA.AVATAR_DESBLOQUEADO',
      params: { avatar: item.id }
    };
  }

  getAvatarPreview(estilo: string, nombre: string): string {
    return `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(nombre)}&backgroundColor=b6e3f4`;
  }
}
