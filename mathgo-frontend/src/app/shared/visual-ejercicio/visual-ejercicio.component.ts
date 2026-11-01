import { Component, Input } from '@angular/core';
import { VisualEjercicio, visualDePregunta } from '../../utils/visual-ejercicio';

interface Rebanada { d: string; llena: boolean; }
interface Pastel { etiqueta: string; rebanadas: Rebanada[]; }
interface BloquesNumero { decenas: number[]; unidades: number[]; }
interface Etiqueta { texto: string; x: number; y: number; ancla: 'start' | 'middle' | 'end'; }
interface FiguraVm {
  forma: 'cuadrado' | 'rectangulo' | 'triangulo';
  x: number; y: number; w: number; h: number;
  puntos: string; apexX: number; area: boolean;
  etiquetas: Etiqueta[];
}

interface CeldaArea { x: number; y: number; w: number; h: number; texto: string; alt: boolean; }
interface AreaVm { celdas: CeldaArea[]; etiquetas: Etiqueta[]; }

/**
 * Ayuda visual de un ejercicio (puntos, bloques, filas y columnas, pasteles, figuras, barra).
 * Uso: <app-visual-ejercicio [pregunta]="ejercicio.pregunta"></app-visual-ejercicio>
 */
@Component({
  selector: 'app-visual-ejercicio',
  standalone: true,
  template: `
    @if (tipo === 'puntos') {
      <div class="vis" aria-hidden="true">
        @for (grupo of gruposPuntos; track $index) {
          @if ($index > 0) { <span class="op">{{ operador }}</span> }
          <span class="grupo" [class.g1]="$index === 1">
            @for (p of grupo; track $index) { <i class="pt" [class.fuera]="p === 0"></i> }
          </span>
        }
      </div>
    }

    @if (tipo === 'bloques') {
      <div class="vis" aria-hidden="true">
        @for (numero of bloques; track $index) {
          @if ($index > 0) { <span class="op">{{ operador }}</span> }
          <span class="grupo bloques" [class.g1]="$index === 1">
            <span class="decenas">@for (d of numero.decenas; track $index) { <i class="dec"></i> }</span>
            <span class="unidades">@for (u of numero.unidades; track $index) { <i class="uni"></i> }</span>
          </span>
        }
      </div>
    }

    @if (tipo === 'matriz') {
      <div class="vis" aria-hidden="true">
        <span class="matriz" [style.grid-template-columns]="'repeat(' + columnas + ', auto)'">
          @for (c of celdas; track $index) { <i class="pt" [class.chico]="columnas > 6"></i> }
        </span>
      </div>
    }

    @if (tipo === 'fracciones') {
      <div class="vis" aria-hidden="true">
        @for (pastel of pasteles; track $index) {
          @if ($index > 0) { <span class="op">{{ operador }}</span> }
          <span class="pastel">
            <svg viewBox="0 0 100 100" width="88" height="88">
              @for (r of pastel.rebanadas; track $index) { <path [attr.d]="r.d" [class.llena]="r.llena"></path> }
            </svg>
            <small>{{ pastel.etiqueta }}</small>
          </span>
        }
      </div>
    }

    @if (tipo === 'figura' && figura) {
      <div class="vis" aria-hidden="true">
        <svg class="figura" viewBox="0 0 240 150" width="340" height="212">
          @if (figura.forma === 'triangulo') {
            <polygon [attr.points]="figura.puntos" [class.relleno]="figura.area"></polygon>
            <line class="altura" [attr.x1]="figura.apexX" [attr.y1]="figura.y"
                  [attr.x2]="figura.apexX" [attr.y2]="figura.y + figura.h"></line>
          } @else {
            <rect [attr.x]="figura.x" [attr.y]="figura.y" [attr.width]="figura.w" [attr.height]="figura.h"
                  rx="4" [class.relleno]="figura.area"></rect>
          }
          @for (e of figura.etiquetas; track $index) {
            <text [attr.x]="e.x" [attr.y]="e.y" [attr.text-anchor]="e.ancla">{{ e.texto }}</text>
          }
        </svg>
      </div>
    }

    @if (tipo === 'area' && area) {
      <div class="vis" aria-hidden="true">
        <svg class="area" viewBox="0 0 300 150" width="340" height="170">
          @for (c of area.celdas; track $index) {
            <rect [attr.x]="c.x" [attr.y]="c.y" [attr.width]="c.w" [attr.height]="c.h" rx="4" [class.alt]="c.alt"></rect>
            <text text-anchor="middle" [attr.x]="c.x + c.w / 2" [attr.y]="c.y + c.h / 2 + 5">{{ c.texto }}</text>
          }
          @for (e of area.etiquetas; track $index) {
            <text class="eti" [attr.x]="e.x" [attr.y]="e.y" [attr.text-anchor]="e.ancla">{{ e.texto }}</text>
          }
        </svg>
      </div>
    }

    @if (tipo === 'porcentaje') {
      <div class="vis col" aria-hidden="true">
        <div class="barra"><i [style.width.%]="porcentaje"></i><b>{{ porcentaje }}%</b></div>
        <div class="leyenda"><span>0</span><span>{{ total }} = 100%</span></div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .vis { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 14px; animation: entra .4s ease-out; }
    .vis.col { flex-direction: column; gap: 6px; }
    .op { font: 800 1.8rem var(--mg-display, inherit); color: #e6deff; }
    .grupo { display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 6px; max-width: 250px; padding: 8px 12px; border-radius: 16px; background: rgba(255,255,255,.08); }
    .pt { width: 22px; height: 22px; border-radius: 50%; background: #34e6a4; box-shadow: inset 0 -3px 0 rgba(0,0,0,.18); display: inline-block; }
    .g1 .pt { background: #ffc83d; }
    .pt.fuera { background: transparent; border: 2px dashed #ff7aa8; box-shadow: none; position: relative; }
    .pt.fuera::after { content: '✕'; position: absolute; inset: 0; display: grid; place-items: center; color: #ff7aa8; font-size: .8rem; font-weight: 900; }
    .pt.chico { width: 16px; height: 16px; }
    .matriz { display: inline-grid; gap: 6px; padding: 10px 14px; border-radius: 16px; background: rgba(255,255,255,.08); }
    .bloques { align-items: flex-end; gap: 10px; }
    .decenas, .unidades { display: inline-flex; align-items: flex-end; gap: 4px; flex-wrap: wrap; }
    .unidades { max-width: 80px; }
    .dec { width: 14px; height: 56px; border-radius: 3px; background: #34e6a4; box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); background-image: repeating-linear-gradient(0deg, transparent 0 5px, rgba(0,0,0,.18) 5px 6px); }
    .uni { width: 14px; height: 14px; border-radius: 3px; background: #34e6a4; }
    .g1 .dec, .g1 .uni { background-color: #ffc83d; }
    .pastel { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
    .pastel path { fill: rgba(255,255,255,.12); stroke: #fff; stroke-width: 2; }
    .pastel path.llena { fill: #34e6a4; }
    .pastel small { font: 800 1.1rem var(--mg-display, inherit); }
    .figura rect, .figura polygon { fill: rgba(52,230,164,.12); stroke: #34e6a4; stroke-width: 3; }
    .figura .relleno { fill: rgba(52,230,164,.45); }
    .figura .altura { stroke: #ffc83d; stroke-width: 2; stroke-dasharray: 5 4; }
    .figura text { fill: #fff; font: 800 14px var(--mg-display, sans-serif); }
    .area rect { fill: rgba(52,230,164,.22); stroke: #34e6a4; stroke-width: 2; }
    .area rect.alt { fill: rgba(255,200,61,.22); stroke: #ffc83d; }
    .area text { fill: #fff; font: 800 14px var(--mg-display, sans-serif); }
    .area .eti { fill: #e6deff; font-size: 15px; }
    .barra { position: relative; width: min(420px, 80vw); height: 30px; border-radius: 15px; background: rgba(255,255,255,.12); overflow: hidden; }
    .barra i { position: absolute; inset: 0 auto 0 0; background: #34e6a4; border-radius: 15px; }
    .barra b { position: absolute; inset: 0; display: grid; place-items: center; font: 800 1rem var(--mg-display, inherit); }
    .leyenda { display: flex; justify-content: space-between; width: min(420px, 80vw); font-weight: 700; font-size: .9rem; color: #e6deff; }
    @keyframes entra { from { opacity: 0; transform: translateY(8px); } }
  `]
})
export class VisualEjercicioComponent {
  tipo: VisualEjercicio['tipo'] | null = null;

  gruposPuntos: number[][] = [];
  bloques: BloquesNumero[] = [];
  celdas: number[] = [];
  columnas = 0;
  pasteles: Pastel[] = [];
  figura: FiguraVm | null = null;
  area: AreaVm | null = null;
  porcentaje = 0;
  total = 0;
  operador = '+';

  @Input() set pregunta(valor: string | null | undefined) {
    this.aplicar(visualDePregunta(valor));
  }

  private aplicar(m: VisualEjercicio | null): void {
    this.tipo = m ? m.tipo : null;
    this.gruposPuntos = [];
    this.bloques = [];
    this.celdas = [];
    this.pasteles = [];
    this.figura = null;
    this.area = null;
    if (!m) return;

    switch (m.tipo) {
      case 'puntos':
        if (m.op === '+') {
          this.operador = '+';
          this.gruposPuntos = [Array(m.a).fill(1), Array(m.b).fill(1)];
        } else {
          // Se muestran los a objetos y se tachan los b que se quitan
          this.gruposPuntos = [[...Array(m.a - m.b).fill(1), ...Array(m.b).fill(0)]];
        }
        break;
      case 'bloques':
        this.operador = m.op === '+' ? '+' : '−';
        this.bloques = [m.a, m.b].map(n => ({
          decenas: Array(Math.floor(n / 10)).fill(0),
          unidades: Array(n % 10).fill(0)
        }));
        break;
      case 'matriz':
        this.columnas = m.columnas;
        this.celdas = Array(m.filas * m.columnas).fill(0);
        break;
      case 'fracciones':
        this.operador = m.relacion === '+' ? '+' : m.relacion === '-' ? '−' : 'vs';
        this.pasteles = m.fracciones.map(f => ({
          etiqueta: `${f.n}/${f.d}`,
          rebanadas: VisualEjercicioComponent.rebanadas(f.n, f.d)
        }));
        break;
      case 'figura':
        this.figura = VisualEjercicioComponent.construirFigura(m);
        break;
      case 'area':
        this.area = VisualEjercicioComponent.construirArea(m.a, m.b);
        break;
      case 'porcentaje':
        this.porcentaje = m.porcentaje;
        this.total = m.total;
        break;
    }
  }

  private static rebanadas(n: number, d: number): Rebanada[] {
    const r = 46;
    const c = 50;
    const salida: Rebanada[] = [];
    for (let i = 0; i < d; i++) {
      const a0 = ((-90 + (360 / d) * i) * Math.PI) / 180;
      const a1 = ((-90 + (360 / d) * (i + 1)) * Math.PI) / 180;
      const x0 = (c + r * Math.cos(a0)).toFixed(2);
      const y0 = (c + r * Math.sin(a0)).toFixed(2);
      const x1 = (c + r * Math.cos(a1)).toFixed(2);
      const y1 = (c + r * Math.sin(a1)).toFixed(2);
      salida.push({ d: `M ${c} ${c} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`, llena: i < n });
    }
    return salida;
  }

  /** Modelo de área: cada factor se separa en decenas y unidades (23 = 20 + 3) y se dibuja un rectángulo. */
  private static construirArea(a: number, b: number): AreaVm {
    const partes = (n: number): number[] =>
      n >= 10 ? [Math.floor(n / 10) * 10, n % 10].filter(p => p > 0) : [n];
    const columnas = partes(a);
    const filas = partes(b);

    // Cada parte ocupa un espacio proporcional, con un mínimo para que quepa el texto
    const reparto = (p: number[], largo: number): number[] => {
      if (p.length === 1) return [largo];
      const total = p.reduce((s, x) => s + x, 0);
      const cuotas = p.map(x => Math.max(x / total, 0.3));
      const suma = cuotas.reduce((s, x) => s + x, 0);
      return cuotas.map(c => (c / suma) * largo);
    };

    const izquierda = 34;
    const arriba = 28;
    const anchos = reparto(columnas, 300 - izquierda - 8);
    const altos = reparto(filas, 150 - arriba - 8);

    const celdas: CeldaArea[] = [];
    const etiquetas: Etiqueta[] = [];
    let y = arriba;
    filas.forEach((fila, j) => {
      let x = izquierda;
      columnas.forEach((col, i) => {
        celdas.push({ x, y, w: anchos[i], h: altos[j], texto: `${col} × ${fila}`, alt: (i + j) % 2 === 1 });
        x += anchos[i];
      });
      etiquetas.push({ texto: `${fila}`, x: izquierda - 8, y: y + altos[j] / 2 + 5, ancla: 'end' });
      y += altos[j];
    });
    let xe = izquierda;
    columnas.forEach((col, i) => {
      etiquetas.push({ texto: `${col}`, x: xe + anchos[i] / 2, y: arriba - 8, ancla: 'middle' });
      xe += anchos[i];
    });
    return { celdas, etiquetas };
  }

  private static construirFigura(m: Extract<VisualEjercicio, { tipo: 'figura' }>): FiguraVm {
    const ancho = 240;
    const alto = 150;
    const escala = Math.min(130 / m.largo, 84 / m.ancho);
    const w = m.largo * escala;
    const h = m.ancho * escala;
    const x = (ancho - w) / 2;
    const y = (alto - h) / 2;
    const u = m.unidad;
    const apexX = x + w * 0.3;

    const etiquetas: Etiqueta[] =
      m.figura === 'triangulo'
        ? [
            { texto: `${m.largo} ${u}`, x: x + w / 2, y: y + h + 18, ancla: 'middle' },
            { texto: `${m.ancho} ${u}`, x: apexX + 6, y: y + h / 2 + 5, ancla: 'start' }
          ]
        : [
            { texto: `${m.largo} ${u}`, x: x + w / 2, y: y - 8, ancla: 'middle' },
            { texto: `${m.ancho} ${u}`, x: x + w + 8, y: y + h / 2 + 5, ancla: 'start' }
          ];

    return {
      forma: m.figura,
      x, y, w, h, apexX,
      puntos: `${x},${y + h} ${x + w},${y + h} ${apexX},${y}`,
      area: m.medida === 'area',
      etiquetas
    };
  }
}
