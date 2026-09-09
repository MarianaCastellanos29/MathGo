import { TestBed } from '@angular/core/testing';
import { TiendaService } from './tienda.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('TiendaService', () => {
  let service: TiendaService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TiendaService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(TiendaService);
    authService = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('adventurer debe estar comprado por defecto', () => {
    expect(service.estaComprado('adventurer')).toBeTrue();
  });

  it('pixel-art no debe estar comprado por defecto', () => {
    expect(service.estaComprado('pixel-art')).toBeFalse();
  });

  it('comprar con xp suficiente debe funcionar', () => {
    localStorage.setItem('xp', '200');
    const item = service.items.find(i => i.id === 'pixel-art')!;
    const resultado = service.comprar(item);
    expect(resultado.ok).toBeTrue();
    expect(service.estaComprado('pixel-art')).toBeTrue();
  });

  it('comprar sin xp suficiente debe fallar', () => {
    localStorage.setItem('xp', '10');
    const item = service.items.find(i => i.id === 'pixel-art')!;
    const resultado = service.comprar(item);
    expect(resultado.ok).toBeFalse();
  });

  it('comprar item ya comprado debe fallar', () => {
    localStorage.setItem('xp', '500');
    const item = service.items.find(i => i.id === 'adventurer')!;
    const resultado = service.comprar(item);
    expect(resultado.ok).toBeFalse();
  });

  it('comprar debe descontar xp correctamente', () => {
    localStorage.setItem('xp', '200');
    const item = service.items.find(i => i.id === 'pixel-art')!;
    service.comprar(item);
    expect(authService.getXp()).toBe(200 - item.precio);
  });

  it('getAvatarPreview debe retornar URL de dicebear', () => {
    const url = service.getAvatarPreview('adventurer', 'lilo');
    expect(url).toContain('dicebear.com');
    expect(url).toContain('adventurer');
  });
});