import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TiendaService } from '../../services/tienda.service';

import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, NavComponent, SceneComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  nombre: string = '';
  avatarSeleccionado: string = 'adventurer';
  guardado: boolean = false;

  estilos = [
    { id: 'adventurer', nombre: 'Aventurero' },
    { id: 'pixel-art',  nombre: 'Pixel Art' },
    { id: 'bottts',     nombre: 'Robot' },
    { id: 'fun-emoji',  nombre: 'Emoji Fun' },
    { id: 'lorelei',    nombre: 'Lorelei' },
    { id: 'thumbs',     nombre: 'Thumbs' },
    { id: 'micah',      nombre: 'Micah' },
    { id: 'avataaars',  nombre: 'Avataaars' },
  ];

  constructor(private auth: AuthService, public tienda: TiendaService) {}

  ngOnInit(): void {
    this.nombre = this.auth.getNombre();
    this.avatarSeleccionado = this.auth.getAvatar();
  }

  getAvatarUrl(estilo: string): string {
    return `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(this.nombre)}&backgroundColor=b6e3f4`;
  }

  estaComprado(estiloId: string): boolean {
    return this.tienda.estaComprado(estiloId);
  }

  seleccionar(estilo: string): void {
    if (!this.estaComprado(estilo)) return;
    this.avatarSeleccionado = estilo;
  }

  guardar(): void {
    this.auth.setAvatarActivo(this.avatarSeleccionado);
    this.guardado = true;
    setTimeout(() => this.guardado = false, 2000);
  }
}