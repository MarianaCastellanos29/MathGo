import { TestBed } from '@angular/core/testing';
import { SonidoService } from './sonido.service';

describe('SonidoService', () => {
  beforeEach(() => {
    localStorage.removeItem('sonido');
  });

  it('empieza con el sonido activo', () => {
    expect(TestBed.inject(SonidoService).activo).toBeTrue();
  });

  it('se puede silenciar y recuerda la elección', () => {
    const servicio = TestBed.inject(SonidoService);

    expect(servicio.alternar()).toBeFalse();
    expect(servicio.activo).toBeFalse();
    expect(localStorage.getItem('sonido')).toBe('0');

    expect(servicio.alternar()).toBeTrue();
    expect(localStorage.getItem('sonido')).toBe('1');
  });

  it('no falla al reproducir con el sonido silenciado', () => {
    const servicio = TestBed.inject(SonidoService);
    servicio.alternar();

    expect(() => servicio.reproducir('acierto')).not.toThrow();
  });
});
