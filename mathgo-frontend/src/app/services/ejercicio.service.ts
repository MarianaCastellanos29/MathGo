import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RespuestaRequest, RespuestaResponse } from '../models/models';

export interface EjercicioAPI {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  private readonly API = 'http://localhost:8080/ejercicios';

  constructor(private http: HttpClient) {}

  obtenerEjerciciosAPI(nivel: number): Observable<EjercicioAPI[]> {
    return of(this.generarEjercicios(nivel));
  }

  obtenerDatoCurioso(numero: number): Observable<string> {
    return of(this.curiosidadDelNumero(numero));
  }

  explicarError(pregunta: string, respuestaCorrecta: string, respuestaUsuario: string): Observable<string> {
    return of(this.generarExplicacion(pregunta, respuestaCorrecta, respuestaUsuario));
  }

  mensajePyro(puntaje: number, total: number, nivel: number): Observable<string> {
    const pct = Math.round((puntaje / total) * 100);
    const mensajes: Record<string, string[]> = {
      alto: [
        '¡Eres un dragón matemático! 🐉🔥',
        '¡Pyro está muy orgulloso de ti! ¡Increíble! 🏆',
        '¡Fuego matemático! ¡Lo hiciste perfecto! ⭐🔥',
        '¡Eres un genio de los números! 🧠🐉',
      ],
      medio: [
        '¡Buen trabajo! ¡Sigue practicando y serás imparable! 💪🐉',
        '¡Vas muy bien! ¡Un poco más de práctica y lo dominas! 🔥',
        '¡Pyro cree en ti! ¡Inténtalo de nuevo! 🌟',
        '¡Casi perfecto! ¡La próxima vez lo logras! 🐉💫',
      ],
      bajo: [
        '¡No te rindas! ¡Cada error te hace más sabio! 🐉❤️',
        '¡Pyro también aprendió poco a poco! ¡Tú puedes! 🔥',
        '¡Los grandes matemáticos también se equivocan! ¡Sigue! 💪',
        '¡Vuelve a intentarlo! ¡Pyro te espera! 🐉🌟',
      ]
    };
    const grupo = pct >= 80 ? 'alto' : pct >= 50 ? 'medio' : 'bajo';
    const lista = mensajes[grupo];
    return of(lista[Math.floor(Math.random() * lista.length)]);
  }

  private curiosidadDelNumero(n: number): string {
    const especiales: Record<number, string> = {
      0:   '¡El 0 fue inventado en la India hace más de 1500 años! Sin él no existirían las computadoras. 🖥️',
      1:   '¡El 1 es el único número que no es primo ni compuesto! Es único en todo el universo. 🌟',
      2:   '¡El 2 es el único número primo que es par! Todos los demás primos son impares. 🔢',
      3:   '¡El 3 aparece en todo: 3 lados del triángulo, 3 colores primarios, 3 estados del agua! 💧',
      4:   '¡Las 4 patas de una silla, los 4 puntos cardinales y las 4 estaciones del año! 🧭',
      5:   '¡Tenemos 5 dedos en cada mano porque nuestros ancestros hace 375 millones de años también los tenían! 🖐️',
      6:   '¡El 6 es un número perfecto: 1+2+3 = 6 y 1×2×3 = 6! Solo hay 4 números perfectos menores a un millón. ✨',
      7:   '¡El 7 es considerado el número de la suerte en muchas culturas! Hay 7 colores en el arcoíris. 🌈',
      8:   '¡Un pulpo tiene 8 brazos y una araña 8 patas! El 8 volteado es el símbolo del infinito ∞. 🐙',
      9:   '¡Si multiplicas 9 por cualquier número y sumas sus dígitos, siempre obtienes 9! Pruébalo. 🔮',
      10:  '¡Usamos el sistema decimal (base 10) porque tenemos 10 dedos en las manos! 🖐️🖐️',
      11:  '¡El 11 × 11 = 121, el 111 × 111 = 12321! ¡Los palíndromos matemáticos son mágicos! 🪄',
      12:  '¡Hay 12 meses en el año, 12 horas en el reloj y 12 en una docena! El número más usado en la historia. 📅',
      13:  '¡El 13 es primo y aparece 13 veces en los billetes de dólar de EE.UU.! 💵',
      14:  '¡El 14 de febrero es el Día de San Valentín! Y también es un número par perfecto para compartir. 💝',
      15:  '¡15 minutos es un cuarto de hora! Los relojes se dividen en 4 partes de 15 minutos cada una. ⏰',
      16:  '¡16 es 2⁴! Las computadoras usan el sistema hexadecimal (base 16) para procesar información. 💻',
      17:  '¡El 17 es el número primo más "aleatorio" según encuestas! Muchas personas lo eligen al azar. 🎲',
      18:  '¡En muchos países a los 18 años eres adulto! Y 18 hoyos tiene un campo de golf completo. ⛳',
      19:  '¡El 19 es primo y es el número de años que tarda la Luna en repetir sus fases exactamente! 🌙',
      20:  '¡Tenemos 20 dedos entre manos y pies! Los mayas usaban un sistema vigesimal (base 20). 🦶',
      24:  '¡Hay 24 horas en el día! Los babilonios inventaron el sistema de 24 horas hace 3500 años. ☀️',
      25:  '¡25 es 5²! Es el número de letras del abecedario español. 🔤',
      28:  '¡Febrero tiene 28 días normalmente porque el calendario romano original empezaba en marzo! 📆',
      30:  '¡30 días tienen septiembre, abril, junio y noviembre! ¿Ya lo sabías? 🗓️',
      36:  '¡36 = 6² y también es la suma de los primeros 8 números impares! Los números tienen secretos. 🔐',
      42:  '¡En el libro "Guía del autoestopista galáctico", 42 es la respuesta al sentido de la vida! 🚀',
      48:  '¡48 horas son exactamente 2 días! Y 48 es divisible por 1, 2, 3, 4, 6, 8, 12, 16, 24 y 48. 🌍',
      50:  '¡50 estados tiene EE.UU. y 50 es la mitad de 100! En Roma lo escribían como "L". 🗽',
      60:  '¡60 segundos en un minuto y 60 minutos en una hora! Los babilonios inventaron el sistema de base 60. ⏱️',
      64:  '¡64 = 2⁶! Un tablero de ajedrez tiene exactamente 64 casillas. ♟️',
      72:  '¡72 ÷ tasa de interés = años para duplicar tu dinero! Se llama la "regla del 72" en finanzas. 💰',
      80:  '¡En 80 días Phileas Fogg dio la vuelta al mundo según Julio Verne! ¿Tú cuánto tardarías? 🌍',
      81:  '¡81 = 9² y también 3⁴! Es el único número de 2 cifras que es potencia de dos bases distintas. 🔢',
      90:  '¡Un ángulo recto mide exactamente 90°! Es la base de toda la geometría y arquitectura. 📐',
      100: '¡100 años es un siglo! El sistema métrico usa el 100 como base: 100 cm = 1 metro. 📏',
      121: '¡121 = 11²! Es un palíndromo numérico, se lee igual al derecho y al revés. 🪄',
      144: '¡144 = 12²! Se llama una "gruesa" y era la unidad de medida favorita de los comerciantes medievales. 🏺',
    };

    if (especiales[n]) return especiales[n];

    if (this.esPrimo(n)) {
      return `¡El ${n} es un número primo! Solo puede dividirse entre 1 y entre sí mismo. 🌟`;
    }
    if (Number.isInteger(Math.sqrt(n))) {
      return `¡${n} es un cuadrado perfecto! Su raíz cuadrada exacta es ${Math.sqrt(n)}. ✨`;
    }
    if (n % 2 === 0) {
      return `¡El ${n} es un número par! Todos los números pares son divisibles entre 2. 🔢`;
    }
    if (n % 10 === 0) {
      return `¡El ${n} es múltiplo de 10! En el sistema decimal es un número muy especial. 🔟`;
    }
    if (n % 5 === 0) {
      return `¡El ${n} es múltiplo de 5! Siempre termina en 0 o 5, como los dedos de la mano. 🖐️`;
    }
    const divisores = this.contarDivisores(n);
    return `¡El número ${n} tiene exactamente ${divisores} divisores! Los matemáticos los llaman "factores". 🔍`;
  }

  private generarExplicacion(pregunta: string, correcta: string, usuario: string): string {
    const c = Number.parseFloat(correcta);
    const u = Number.parseFloat(usuario);

    if (pregunta.includes('+')) {
      const partes = pregunta.match(/(\d+)\s*\+\s*(\d+)/);
      if (partes) {
        const a = Number.parseInt(partes[1], 10);
        const b = Number.parseInt(partes[2], 10);
        return `🐉 Para sumar ${a} + ${b}, cuenta ${b} lugares hacia adelante desde ${a}. ${a} + ${b} = ${c}. ¡Tú puedes! 💪`;
      }
    }

    if (pregunta.includes('-')) {
      const partes = pregunta.match(/(\d+)\s*-\s*(\d+)/);
      if (partes) {
        const a = Number.parseInt(partes[1], 10);
        const b = Number.parseInt(partes[2], 10);
        return `🐉 Para restar ${a} - ${b}, retrocede ${b} lugares desde ${a}. ${a} - ${b} = ${c}. ¡Casi! 🔥`;
      }
    }

    if (pregunta.includes('×')) {
      const partes = pregunta.match(/(\d+)\s*×\s*(\d+)/);
      if (partes) {
        const a = Number.parseInt(partes[1], 10);
        const b = Number.parseInt(partes[2], 10);
        const pasos = Array.from({ length: Math.min(b, 5) }, (_, i) => a * (i + 1)).join(', ');
        return `🐉 Multiplicar ${a} × ${b} es sumar ${a} exactamente ${b} veces: ${pasos}${b > 5 ? '...' : ''}. ¡El resultado es ${c}! ⭐`;
      }
    }

    if (pregunta.includes('÷')) {
      const partes = pregunta.match(/(\d+)\s*÷\s*(\d+)/);
      if (partes) {
        const a = Number.parseInt(partes[1], 10);
        const b = Number.parseInt(partes[2], 10);
        return `🐉 Dividir ${a} ÷ ${b} es preguntar: ¿cuántas veces cabe ${b} en ${a}? ¡Cabe exactamente ${c} veces! 🔥`;
      }
    }

    if (pregunta.includes('^')) {
      const partes = pregunta.match(/(\d+)\^(\d+)/);
      if (partes) {
        const base = Number.parseInt(partes[1], 10);
        const exp = Number.parseInt(partes[2], 10);
        const pasos = Array.from({ length: exp }, () => base).join(' × ');
        return `🐉 ${base}^${exp} significa multiplicar ${base} por sí mismo ${exp} veces: ${pasos} = ${c}. ✨`;
      }
    }

    if (pregunta.includes('raíz')) {
      return `🐉 La raíz cuadrada busca qué número multiplicado por sí mismo da el resultado. ${c} × ${c} = ${c * c}. ¡Por eso la raíz es ${c}! 🌟`;
    }

    if (pregunta.includes('/') && pregunta.includes('de')) {
      return `🐉 Para calcular una fracción: divide el total entre el denominador y multiplica por el numerador. ¡La respuesta era ${c}! 💪`;
    }

    if (pregunta.includes('%')) {
      const partes = pregunta.match(/(\d+)%\s*de\s*(\d+)/);
      if (partes) {
        const pct = Number.parseInt(partes[1], 10);
        const total = Number.parseInt(partes[2], 10);
        return `🐉 El ${pct}% de ${total} se calcula: ${total} ÷ 100 × ${pct} = ${c}. ¡Los porcentajes son partes de 100! 🔥`;
      }
    }

    const diferencia = Math.abs(c - u);
    return `🐉 ¡Casi! Tu respuesta fue ${u} pero la correcta es ${c}. ¡La diferencia era solo ${diferencia}! La próxima la tienes. 💪`;
  }

  private esPrimo(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  private contarDivisores(n: number): number {
    let count = 0;
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) count++;
    }
    return count;
  }

  responder(req: RespuestaRequest): Observable<RespuestaResponse> {
    return this.http.post<RespuestaResponse>(`${this.API}/responder`, req);
  }

  private generarEjercicios(nivel: number): EjercicioAPI[] {
    const ejercicios: EjercicioAPI[] = [];

    if (nivel === 1) {
      for (let i = 0; i < 10; i++) {
        const a = this.rand(1, 20);
        const b = this.rand(1, 20);
        ejercicios.push(this.crearEjercicio(`¿Cuánto es ${a} + ${b}?`, a + b));
      }
    } else if (nivel === 2) {
      for (let i = 0; i < 10; i++) {
        const a = this.rand(10, 40);
        const b = this.rand(1, a);
        ejercicios.push(this.crearEjercicio(`¿Cuánto es ${a} - ${b}?`, a - b));
      }
    } else if (nivel === 3) {
      for (let i = 0; i < 10; i++) {
        const a = this.rand(2, 12);
        const b = this.rand(2, 12);
        ejercicios.push(this.crearEjercicio(`¿Cuánto es ${a} × ${b}?`, a * b));
      }
    } else if (nivel === 4) {
      for (let i = 0; i < 10; i++) {
        const b = this.rand(2, 10);
        const c = this.rand(2, 10);
        ejercicios.push(this.crearEjercicio(`¿Cuánto es ${b * c} ÷ ${b}?`, c));
      }
    } else if (nivel === 5) {
      for (let i = 0; i < 10; i++) {
        const raiz = this.rand(2, 12);
        ejercicios.push(this.crearEjercicio(`¿Cuál es la raíz cuadrada de ${raiz * raiz}?`, raiz));
      }
    } else if (nivel === 6) {
      const fracciones = [
        { num: 1, den: 2, desc: '1/2' }, { num: 1, den: 4, desc: '1/4' },
        { num: 3, den: 4, desc: '3/4' }, { num: 1, den: 3, desc: '1/3' },
        { num: 2, den: 3, desc: '2/3' },
      ];
      for (let i = 0; i < 5; i++) {
        const f = fracciones[i];
        const total = this.rand(2, 5) * f.den;
        const resultado = (total * f.num) / f.den;
        ejercicios.push(this.crearEjercicio(`¿Cuánto es ${f.desc} de ${total}?`, resultado));
      }
      for (let i = 0; i < 5; i++) {
        const pct = [10, 20, 25, 50, 75][i];
        const total = this.rand(2, 8) * (100 / pct);
        ejercicios.push(this.crearEjercicio(`¿Cuánto es el ${pct}% de ${total}?`, total * pct / 100));
      }
    }

    return ejercicios.sort(() => Math.random() - 0.5);
  }

  private crearEjercicio(pregunta: string, correcta: number): EjercicioAPI {
    const incorrectas = new Set<number>();
    let intentos = 0;
    while (incorrectas.size < 3 && intentos < 50) {
      intentos++;
      const offset = this.rand(-8, 8);
      const incorrecta = correcta + offset;
      if (incorrecta !== correcta && incorrecta > 0) incorrectas.add(incorrecta);
    }
    const opciones = [correcta.toString(), ...[...incorrectas].map(n => n.toString())]
      .sort(() => Math.random() - 0.5);
    return { pregunta, opciones, respuestaCorrecta: correcta.toString() };
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}