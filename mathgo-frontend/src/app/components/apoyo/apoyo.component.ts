import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavComponent } from '../../shared/nav/nav.component';
import { SceneComponent } from '../../shared/scene/scene.component';

interface Recurso {
  titulo: string;
  canal: string;
  descripcion: string;
  url: string;
}

interface TemaApoyo {
  emoji: string;
  nombre: string;
  recursos: Recurso[];
}

/**
 * Los enlaces apuntan a resultados de búsqueda de YouTube filtrados por canal
 * (no a un video puntual), para que nunca queden rotos si un video se borra o
 * un canal reorganiza su contenido. Todos son canales educativos reconocidos
 * en español.
 */
function buscarEnYoutube(canal: string, tema: string): string {
  const q = encodeURIComponent(`${canal} ${tema}`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

@Component({
  selector: 'app-apoyo',
  standalone: true,
  imports: [CommonModule, NavComponent, SceneComponent],
  templateUrl: './apoyo.component.html',
  styleUrls: ['./apoyo.component.scss'],
})
export class ApoyoComponent {
  nombre: string;

  temas: TemaApoyo[] = [
    {
      emoji: '🌱',
      nombre: 'Sumas y restas',
      recursos: [
        {
          titulo: 'Sumas y restas explicadas paso a paso',
          canal: 'Happy Learning Español',
          descripcion: 'Videos animados que explican de forma sencilla cómo sumar y restar.',
          url: buscarEnYoutube('Happy Learning Español', 'sumas y restas para niños'),
        },
        {
          titulo: 'Clases de sumas y restas de primaria',
          canal: 'unProfesor',
          descripcion: 'Explicaciones tipo clase, con ejemplos resueltos.',
          url: buscarEnYoutube('unProfesor', 'sumas y restas primaria'),
        },
      ],
    },
    {
      emoji: '⭐',
      nombre: 'Multiplicación',
      recursos: [
        {
          titulo: 'Tablas de multiplicar fácil',
          canal: 'unProfesor',
          descripcion: 'Trucos y ejemplos para aprenderse las tablas sin sufrir.',
          url: buscarEnYoutube('unProfesor', 'tablas de multiplicar para niños'),
        },
        {
          titulo: 'Multiplicación paso a paso',
          canal: 'JulioProfe',
          descripcion: 'El profe colombiano más visto explicando multiplicaciones.',
          url: buscarEnYoutube('JulioProfe', 'multiplicación básica'),
        },
      ],
    },
    {
      emoji: '✖️',
      nombre: 'División',
      recursos: [
        {
          titulo: 'Cómo dividir paso a paso',
          canal: 'unProfesor',
          descripcion: 'Divisiones explicadas desde cero, con ejemplos.',
          url: buscarEnYoutube('unProfesor', 'división para niños paso a paso'),
        },
        {
          titulo: 'Ejercicios de división resueltos',
          canal: 'Math2Me',
          descripcion: 'Problemas de división resueltos con explicación clara.',
          url: buscarEnYoutube('Math2Me', 'división básica'),
        },
      ],
    },
    {
      emoji: '√',
      nombre: 'Fracciones',
      recursos: [
        {
          titulo: 'Fracciones para niños',
          canal: 'Happy Learning Español',
          descripcion: 'Qué son las fracciones, explicado con ejemplos visuales.',
          url: buscarEnYoutube('Happy Learning Español', 'fracciones para niños'),
        },
        {
          titulo: 'Sumar y restar fracciones',
          canal: 'unProfesor',
          descripcion: 'Cómo sumar y restar fracciones paso a paso.',
          url: buscarEnYoutube('unProfesor', 'fracciones primaria'),
        },
      ],
    },
    {
      emoji: '🏆',
      nombre: 'Geometría',
      recursos: [
        {
          titulo: 'Figuras geométricas para niños',
          canal: 'Happy Learning Español',
          descripcion: 'Triángulos, cuadrados, círculos y sus propiedades.',
          url: buscarEnYoutube('Happy Learning Español', 'figuras geométricas para niños'),
        },
        {
          titulo: 'Geometría básica de primaria',
          canal: 'unProfesor',
          descripcion: 'Perímetro, área y clasificación de figuras.',
          url: buscarEnYoutube('unProfesor', 'geometría primaria'),
        },
      ],
    },
  ];

  constructor(private auth: AuthService, private router: Router) {
    this.nombre = auth.getNombre();
  }

  abrir(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}
