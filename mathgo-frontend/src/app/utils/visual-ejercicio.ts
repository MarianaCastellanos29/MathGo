/**
 * Deduce, a partir del texto de la pregunta, una ayuda visual para el niño
 * (puntos, bloques de decenas, filas y columnas, pasteles de fracciones, figuras, barras).
 * Devuelve null cuando no hay una ayuda sencilla para esa pregunta.
 */
export interface Fraccion {
  n: number;
  d: number;
}

export type VisualEjercicio =
  | { tipo: 'puntos'; a: number; b: number; op: '+' | '-' }
  | { tipo: 'bloques'; a: number; b: number; op: '+' | '-' }
  | { tipo: 'matriz'; filas: number; columnas: number }
  | { tipo: 'area'; a: number; b: number }
  | { tipo: 'fracciones'; fracciones: Fraccion[]; relacion: '+' | '-' | 'comparar' | 'igual' }
  | {
      tipo: 'figura';
      figura: 'cuadrado' | 'rectangulo' | 'triangulo';
      medida: 'perimetro' | 'area';
      /** cuadrado: lado; rectangulo: largo; triangulo: base */
      largo: number;
      /** cuadrado: lado; rectangulo: ancho; triangulo: altura */
      ancho: number;
      unidad: string;
    }
  | { tipo: 'porcentaje'; porcentaje: number; total: number };

const RE_ARITMETICA = /^¿Cuánto es (\d+) ([+\-×÷]) (\d+)\?$/;
const RE_FRACCION_OP = /^¿Cuánto es (\d+)\/(\d+) ([+\-]) (\d+)\/(\d+)\?$/;
const RE_FRACCION_COMPARAR = /^¿Cuál fracción es (?:mayor|menor): (\d+)\/(\d+) o (\d+)\/(\d+)\?$/;
const RE_FRACCION_IGUAL = /^¿Qué fracción es igual a (\d+)\/(\d+)\?$/;
const RE_PORCENTAJE = /^¿Cuánto es el (\d+)% de (\d+)\?$/;
const RE_CUADRADO = /^Un cuadrado tiene lados de (\d+) (cm|m)\. ¿Cuál es su (perímetro|área)\?$/;
const RE_RECTANGULO =
  /^Un (?:rectángulo|jardín rectangular) mide (\d+) (cm|m) de largo y (\d+) (?:cm|m) de ancho\. ¿Cuál es su (perímetro|área)\?$/;
const RE_TRIANGULO =
  /^Un triángulo tiene base de (\d+) (cm|m) y altura de (\d+) (?:cm|m)\. ¿Cuál es su (perímetro|área)\?$/;

function fraccionValida(f: Fraccion): boolean {
  return f.d >= 2 && f.d <= 12 && f.n >= 0 && f.n <= f.d;
}

function medidaDe(texto: string): 'perimetro' | 'area' {
  return texto === 'área' ? 'area' : 'perimetro';
}

export function visualDePregunta(pregunta: string | null | undefined): VisualEjercicio | null {
  if (!pregunta) return null;
  const p = pregunta.normalize('NFC').trim();

  const arit = RE_ARITMETICA.exec(p);
  if (arit) {
    const a = Number(arit[1]);
    const op = arit[2];
    const b = Number(arit[3]);
    if (op === '+' || op === '-') {
      const cabeEnPuntos = a <= 20 && b <= 20 && (op === '+' ? a + b <= 20 : b <= a);
      if (cabeEnPuntos) return { tipo: 'puntos', a, b, op };
      if (a <= 99 && b <= 99) return { tipo: 'bloques', a, b, op };
      return null;
    }
    if (op === '×' && a >= 1 && b >= 1 && a <= 10 && b <= 10) {
      return { tipo: 'matriz', filas: a, columnas: b };
    }
    // Multiplicaciones más grandes: modelo de área (cada factor se separa en decenas y unidades)
    if (op === '×' && a >= 2 && b >= 2 && a <= 99 && b <= 99) {
      return { tipo: 'area', a, b };
    }
    return null;
  }

  const fop = RE_FRACCION_OP.exec(p);
  if (fop) {
    const fracciones = [
      { n: Number(fop[1]), d: Number(fop[2]) },
      { n: Number(fop[4]), d: Number(fop[5]) }
    ];
    if (!fracciones.every(fraccionValida)) return null;
    return { tipo: 'fracciones', fracciones, relacion: fop[3] === '+' ? '+' : '-' };
  }

  const fcomp = RE_FRACCION_COMPARAR.exec(p);
  if (fcomp) {
    const fracciones = [
      { n: Number(fcomp[1]), d: Number(fcomp[2]) },
      { n: Number(fcomp[3]), d: Number(fcomp[4]) }
    ];
    if (!fracciones.every(fraccionValida)) return null;
    return { tipo: 'fracciones', fracciones, relacion: 'comparar' };
  }

  const figual = RE_FRACCION_IGUAL.exec(p);
  if (figual) {
    const fracciones = [{ n: Number(figual[1]), d: Number(figual[2]) }];
    if (!fracciones.every(fraccionValida)) return null;
    return { tipo: 'fracciones', fracciones, relacion: 'igual' };
  }

  const porc = RE_PORCENTAJE.exec(p);
  if (porc) {
    const porcentaje = Number(porc[1]);
    const total = Number(porc[2]);
    if (porcentaje >= 1 && porcentaje <= 100 && total >= 1) {
      return { tipo: 'porcentaje', porcentaje, total };
    }
    return null;
  }

  const cuad = RE_CUADRADO.exec(p);
  if (cuad) {
    const lado = Number(cuad[1]);
    return { tipo: 'figura', figura: 'cuadrado', medida: medidaDe(cuad[3]), largo: lado, ancho: lado, unidad: cuad[2] };
  }

  const rect = RE_RECTANGULO.exec(p);
  if (rect) {
    return {
      tipo: 'figura', figura: 'rectangulo', medida: medidaDe(rect[4]),
      largo: Number(rect[1]), ancho: Number(rect[3]), unidad: rect[2]
    };
  }

  const tri = RE_TRIANGULO.exec(p);
  if (tri && tri[4] === 'área') {
    return {
      tipo: 'figura', figura: 'triangulo', medida: 'area',
      largo: Number(tri[1]), ancho: Number(tri[3]), unidad: tri[2]
    };
  }

  return null;
}
