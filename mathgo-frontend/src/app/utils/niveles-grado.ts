/**
 * Catálogo de niveles por grado (1° a 5° de primaria).
 * Cada grado tiene 3 niveles, igual que los ejercicios de la base de datos
 * (sql/02_ejercicios_por_grado.sql) y NIVEL_MAXIMO = 3 del backend.
 */
export interface NivelGrado {
  id: number;
  nombre: string;       // "Nivel 1"
  tema: string;         // "Sumas"
  descripcion: string;  // frase corta para el niño
  emoji: string;
  img?: string;         // ilustración opcional (assets/img/...)
}

export const MAX_NIVELES_GRADO = 3;

export const NIVELES_POR_GRADO: Record<number, NivelGrado[]> = {
  1: [
    { id: 1, nombre: 'Nivel 1', tema: 'Sumas', descripcion: 'Suma hasta 10', emoji: '🌱', img: 'assets/img/plus.png' },
    { id: 2, nombre: 'Nivel 2', tema: 'Restas', descripcion: 'Resta hasta 10', emoji: '🍎', img: 'assets/img/star.png' },
    { id: 3, nombre: 'Nivel 3', tema: 'Sumas y restas', descripcion: 'Con números hasta 20', emoji: '🎈' },
  ],
  2: [
    { id: 1, nombre: 'Nivel 1', tema: 'Sumas grandes', descripcion: 'Sumas de dos cifras', emoji: '🐣', img: 'assets/img/plus.png' },
    { id: 2, nombre: 'Nivel 2', tema: 'Restas grandes', descripcion: 'Restas de dos cifras', emoji: '🧩', img: 'assets/img/star.png' },
    { id: 3, nombre: 'Nivel 3', tema: 'Multiplicación', descripcion: 'Las primeras tablas', emoji: '✖️' },
  ],
  3: [
    { id: 1, nombre: 'Nivel 1', tema: 'Multiplicación', descripcion: 'Tablas del 4 al 9', emoji: '🚀' },
    { id: 2, nombre: 'Nivel 2', tema: 'División', descripcion: 'Reparte en partes iguales', emoji: '➗', img: 'assets/img/divide.png' },
    { id: 3, nombre: 'Nivel 3', tema: 'Problemas', descripcion: 'Historias con operaciones', emoji: '🧠' },
  ],
  4: [
    { id: 1, nombre: 'Nivel 1', tema: 'Multiplicación grande', descripcion: 'Números más grandes', emoji: '🦁' },
    { id: 2, nombre: 'Nivel 2', tema: 'Fracciones', descripcion: 'Sumas, restas y comparación', emoji: '🍕' },
    { id: 3, nombre: 'Nivel 3', tema: 'División y problemas', descripcion: 'Divide y resuelve', emoji: '🧮', img: 'assets/img/divide.png' },
  ],
  5: [
    { id: 1, nombre: 'Nivel 1', tema: 'Decimales', descripcion: 'Operaciones con comas', emoji: '🏆' },
    { id: 2, nombre: 'Nivel 2', tema: 'Porcentajes', descripcion: 'El 10%, el 25%, el 50%', emoji: '💯' },
    { id: 3, nombre: 'Nivel 3', tema: 'Geometría', descripcion: 'Área y perímetro', emoji: '📐' },
  ],
};

/** Devuelve los niveles del grado (si no hay grado, usa los de 1°). */
export function nivelesDeGrado(grado: number | null | undefined): NivelGrado[] {
  return NIVELES_POR_GRADO[grado ?? 1] ?? NIVELES_POR_GRADO[1];
}

export function temaDeNivel(grado: number | null | undefined, nivel: number): string {
  return nivelesDeGrado(grado).find(n => n.id === nivel)?.tema ?? `Nivel ${nivel}`;
}

export function etiquetaGrado(grado: number | null | undefined): string {
  const nombres: Record<number, string> = { 1: 'Primer', 2: 'Segundo', 3: 'Tercer', 4: 'Cuarto', 5: 'Quinto' };
  return grado ? `${nombres[grado] ?? grado + '°'} grado` : 'Tu grado';
}

/** Lee el grado guardado por la pantalla de selección (localStorage). */
export function gradoGuardado(): number | null {
  const g = Number(localStorage.getItem('grado'));
  return g >= 1 && g <= 5 ? g : null;
}
