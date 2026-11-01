import { Injectable } from '@angular/core';

export type TipoSonido = 'acierto' | 'error' | 'victoria' | 'pista';

interface Nota {
  f: number;
  d: number;
  tipo?: OscillatorType;
}

const CLAVE_SONIDO = 'sonido';

const NOTAS: Record<TipoSonido, Nota[]> = {
  acierto: [{ f: 523.25, d: 0.12 }, { f: 659.25, d: 0.12 }, { f: 783.99, d: 0.24 }],
  error: [{ f: 220, d: 0.18, tipo: 'triangle' }, { f: 165, d: 0.3, tipo: 'triangle' }],
  victoria: [{ f: 523.25, d: 0.14 }, { f: 659.25, d: 0.14 }, { f: 783.99, d: 0.14 }, { f: 1046.5, d: 0.45 }],
  pista: [{ f: 880, d: 0.1 }]
};

/** Sonidos cortos generados con Web Audio (sin archivos). Se pueden silenciar. */
@Injectable({ providedIn: 'root' })
export class SonidoService {
  private ctx: AudioContext | null = null;
  private encendido = SonidoService.leerPreferencia();

  get activo(): boolean {
    return this.encendido;
  }

  /** Activa o silencia los sonidos y recuerda la elección. */
  alternar(): boolean {
    this.encendido = !this.encendido;
    try {
      localStorage.setItem(CLAVE_SONIDO, this.encendido ? '1' : '0');
    } catch {
      /* sin almacenamiento: solo dura la sesión */
    }
    return this.encendido;
  }

  reproducir(tipo: TipoSonido): void {
    if (!this.encendido) return;
    try {
      const ctx = this.contexto();
      if (!ctx) return;
      let t = ctx.currentTime;
      for (const nota of NOTAS[tipo]) {
        const osc = ctx.createOscillator();
        const ganancia = ctx.createGain();
        osc.type = nota.tipo ?? 'sine';
        osc.frequency.value = nota.f;
        ganancia.gain.setValueAtTime(0.0001, t);
        ganancia.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
        ganancia.gain.exponentialRampToValueAtTime(0.0001, t + nota.d);
        osc.connect(ganancia);
        ganancia.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + nota.d + 0.02);
        t += nota.d * 0.85;
      }
    } catch {
      /* si el navegador no permite audio, simplemente no suena */
    }
  }

  private contexto(): AudioContext | null {
    if (!this.ctx) {
      const Clase = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Clase) return null;
      this.ctx = new Clase() as AudioContext;
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private static leerPreferencia(): boolean {
    try {
      return localStorage.getItem(CLAVE_SONIDO) !== '0';
    } catch {
      return true;
    }
  }
}
