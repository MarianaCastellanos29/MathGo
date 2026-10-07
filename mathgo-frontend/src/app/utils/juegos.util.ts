// src/app/utils/juegos.util.ts
// Generador de operaciones matemáticas para los mini-juegos (Memorama y Carrera).

export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface OperacionGenerada {
  texto: string;
  resultado: number;
}

function entero(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Genera UNA operación aleatoria según la dificultad. */
export function generarOperacion(dificultad: Dificultad): OperacionGenerada {
  switch (dificultad) {
    case 'facil': {
      const usarSuma = Math.random() < 0.5;
      const a = entero(1, 10);
      const b = entero(1, 10);
      return usarSuma
        ? { texto: `${a} + ${b}`, resultado: a + b }
        : { texto: `${a + b} - ${b}`, resultado: a };
    }
    case 'medio': {
      const tipo = entero(0, 2);
      if (tipo === 0) {
        const a = entero(5, 20);
        const b = entero(1, 15);
        return { texto: `${a} + ${b}`, resultado: a + b };
      }
      if (tipo === 1) {
        const a = entero(10, 20);
        const b = entero(1, a);
        return { texto: `${a} - ${b}`, resultado: a - b };
      }
      const a = entero(2, 5);
      const b = entero(2, 5);
      return { texto: `${a} × ${b}`, resultado: a * b };
    }
    case 'dificil':
    default: {
      const tipo = entero(0, 2);
      if (tipo === 0) {
        const a = entero(2, 9);
        const b = entero(2, 9);
        return { texto: `${a} × ${b}`, resultado: a * b };
      }
      if (tipo === 1) {
        const b = entero(2, 9);
        const resultado = entero(2, 9);
        const a = b * resultado;
        return { texto: `${a} ÷ ${b}`, resultado };
      }
      const a = entero(15, 50);
      const b = entero(1, 20);
      return { texto: `${a} - ${b}`, resultado: a - b };
    }
  }
}

/**
 * Genera `cantidad` operaciones con resultados ÚNICOS entre sí (necesario para
 * el memorama, para que nunca haya dos parejas con el mismo resultado).
 */
export function generarSetUnico(cantidad: number, dificultad: Dificultad): OperacionGenerada[] {
  const set: OperacionGenerada[] = [];
  const resultadosUsados = new Set<number>();
  let intentos = 0;

  while (set.length < cantidad && intentos < cantidad * 40) {
    intentos++;
    const op = generarOperacion(dificultad);
    if (!resultadosUsados.has(op.resultado)) {
      resultadosUsados.add(op.resultado);
      set.push(op);
    }
  }
  return set;
}

/** Genera 3 opciones (1 correcta + 2 distractores cercanos) para preguntas de opción múltiple. */
export function generarOpciones(resultado: number): string[] {
  const opciones = new Set<number>([resultado]);
  while (opciones.size < 3) {
    const variacion = entero(-5, 5) || 1;
    const candidato = resultado + variacion;
    if (candidato >= 0) opciones.add(candidato);
  }
  return Array.from(opciones)
    .sort(() => Math.random() - 0.5)
    .map((n) => n.toString());
}
