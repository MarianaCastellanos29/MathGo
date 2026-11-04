import { visualDePregunta } from './visual-ejercicio';

describe('visualDePregunta', () => {
  it('suma pequeña: puntos', () => {
    expect(visualDePregunta('¿Cuánto es 3 + 2?')).toEqual({ tipo: 'puntos', a: 3, b: 2, op: '+' });
  });

  it('resta hasta 20: puntos', () => {
    expect(visualDePregunta('¿Cuánto es 15 - 6?')).toEqual({ tipo: 'puntos', a: 15, b: 6, op: '-' });
  });

  it('suma que pasa de 20: bloques de decenas', () => {
    expect(visualDePregunta('¿Cuánto es 23 + 14?')).toEqual({ tipo: 'bloques', a: 23, b: 14, op: '+' });
  });

  it('resta de dos cifras: bloques de decenas', () => {
    expect(visualDePregunta('¿Cuánto es 47 - 23?')).toEqual({ tipo: 'bloques', a: 47, b: 23, op: '-' });
  });

  it('multiplicación de tablas: filas y columnas', () => {
    expect(visualDePregunta('¿Cuánto es 4 × 5?')).toEqual({ tipo: 'matriz', filas: 4, columnas: 5 });
  });

  it('multiplicación grande: modelo de área', () => {
    expect(visualDePregunta('¿Cuánto es 23 × 4?')).toEqual({ tipo: 'area', a: 23, b: 4 });
    expect(visualDePregunta('¿Cuánto es 12 × 12?')).toEqual({ tipo: 'area', a: 12, b: 12 });
  });

  it('tablas hasta 10 × 10 siguen usando filas y columnas', () => {
    expect(visualDePregunta('¿Cuánto es 10 × 10?')).toEqual({ tipo: 'matriz', filas: 10, columnas: 10 });
  });

  it('división, decimales y números de tres cifras: sin ayuda visual', () => {
    expect(visualDePregunta('¿Cuánto es 84 ÷ 4?')).toBeNull();
    expect(visualDePregunta('¿Cuánto es 1,5 + 2,3?')).toBeNull();
    expect(visualDePregunta('¿Cuánto es 125 × 2?')).toBeNull();
  });

  it('fracciones: suma, comparación e igualdad', () => {
    expect(visualDePregunta('¿Cuánto es 1/4 + 2/4?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 1, d: 4 }, { n: 2, d: 4 }], relacion: '+'
    });
    expect(visualDePregunta('¿Cuál fracción es mayor: 1/2 o 1/4?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 1, d: 2 }, { n: 1, d: 4 }], relacion: 'comparar'
    });
    expect(visualDePregunta('¿Qué fracción es igual a 1/2?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 1, d: 2 }], relacion: 'igual'
    });
  });

  it('porcentajes', () => {
    expect(visualDePregunta('¿Cuánto es el 25% de 80?')).toEqual({ tipo: 'porcentaje', porcentaje: 25, total: 80 });
  });

  it('geometría: cuadrado, rectángulo, jardín y triángulo', () => {
    expect(visualDePregunta('Un cuadrado tiene lados de 5 cm. ¿Cuál es su perímetro?')).toEqual({
      tipo: 'figura', figura: 'cuadrado', medida: 'perimetro', largo: 5, ancho: 5, unidad: 'cm'
    });
    expect(visualDePregunta('Un rectángulo mide 7 cm de largo y 4 cm de ancho. ¿Cuál es su área?')).toEqual({
      tipo: 'figura', figura: 'rectangulo', medida: 'area', largo: 7, ancho: 4, unidad: 'cm'
    });
    expect(visualDePregunta('Un jardín rectangular mide 15 m de largo y 6 m de ancho. ¿Cuál es su área?')).toEqual({
      tipo: 'figura', figura: 'rectangulo', medida: 'area', largo: 15, ancho: 6, unidad: 'm'
    });
    expect(visualDePregunta('Un triángulo tiene base de 8 cm y altura de 5 cm. ¿Cuál es su área?')).toEqual({
      tipo: 'figura', figura: 'triangulo', medida: 'area', largo: 8, ancho: 5, unidad: 'cm'
    });
  });

  it('preguntas en inglés: mismas ayudas visuales', () => {
    expect(visualDePregunta('What is 3 + 2?')).toEqual({ tipo: 'puntos', a: 3, b: 2, op: '+' });
    expect(visualDePregunta('What is 23 + 14?')).toEqual({ tipo: 'bloques', a: 23, b: 14, op: '+' });
    expect(visualDePregunta('What is 4 × 5?')).toEqual({ tipo: 'matriz', filas: 4, columnas: 5 });
    expect(visualDePregunta('What is 12 × 12?')).toEqual({ tipo: 'area', a: 12, b: 12 });
    expect(visualDePregunta('What is 25% of 80?')).toEqual({ tipo: 'porcentaje', porcentaje: 25, total: 80 });
    expect(visualDePregunta('What is 1/4 + 2/4?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 1, d: 4 }, { n: 2, d: 4 }], relacion: '+'
    });
    expect(visualDePregunta('Which fraction is smaller: 2/3 or 1/3?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 2, d: 3 }, { n: 1, d: 3 }], relacion: 'comparar'
    });
    expect(visualDePregunta('Which fraction is equal to 1/2?')).toEqual({
      tipo: 'fracciones', fracciones: [{ n: 1, d: 2 }], relacion: 'igual'
    });
  });

  it('geometría en inglés', () => {
    expect(visualDePregunta('A square has sides of 5 cm. What is its perimeter?')).toEqual({
      tipo: 'figura', figura: 'cuadrado', medida: 'perimetro', largo: 5, ancho: 5, unidad: 'cm'
    });
    expect(visualDePregunta('A rectangular garden is 15 m long and 6 m wide. What is its area?')).toEqual({
      tipo: 'figura', figura: 'rectangulo', medida: 'area', largo: 15, ancho: 6, unidad: 'm'
    });
    expect(visualDePregunta('A triangle has a base of 8 cm and a height of 5 cm. What is its area?')).toEqual({
      tipo: 'figura', figura: 'triangulo', medida: 'area', largo: 8, ancho: 5, unidad: 'cm'
    });
  });

  it('decimales y problemas con historia en inglés: null', () => {
    expect(visualDePregunta('What is 1.5 + 2.3?')).toBeNull();
    expect(visualDePregunta('Sofía has 24 stickers and gives away 9. How many stickers does she have left?')).toBeNull();
  });

  it('problemas con historia y entradas vacías: null', () => {
    expect(visualDePregunta('Sofía tiene 24 stickers y regala 9. ¿Cuántos stickers le quedan?')).toBeNull();
    expect(visualDePregunta('')).toBeNull();
    expect(visualDePregunta(null)).toBeNull();
  });
});
