import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('login debe guardar token en localStorage', () => {
    const mockRes = {
      token: 'abc123', usuarioId: 1, nombre: 'lilo',
      rol: 'ALUMNO', vidas: 5, nivelActual: 2, xp: 100,
      rango: 'Aprendiz', rachaActual: 3
    };

    service.login('lilo@gmail.com', '123456').subscribe(() => {
      expect(localStorage.getItem('token')).toBe('abc123');
      expect(localStorage.getItem('nombre')).toBe('lilo');
    });

    const req = httpMock.expectOne('http://localhost:8080/usuarios/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('getNombre debe retornar nombre del localStorage', () => {
    localStorage.setItem('nombre', 'lilo');
    expect(service.getNombre()).toBe('lilo');
  });

  it('getVidas debe retornar numero de vidas', () => {
    localStorage.setItem('vidas', '3');
    expect(service.getVidas()).toBe(3);
  });

  it('setVidas debe actualizar localStorage', () => {
    service.setVidas(4);
    expect(localStorage.getItem('vidas')).toBe('4');
  });

  it('getXp debe retornar xp del localStorage', () => {
    localStorage.setItem('xp', '380');
    expect(service.getXp()).toBe(380);
  });

  it('setXp debe actualizar localStorage', () => {
    service.setXp(500);
    expect(localStorage.getItem('xp')).toBe('500');
  });

  it('isLoggedIn debe retornar true si hay token', () => {
    localStorage.setItem('token', 'abc');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn debe retornar false si no hay token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('getRol debe retornar rol del localStorage', () => {
    localStorage.setItem('rol', 'PADRE');
    expect(service.getRol()).toBe('PADRE');
  });

  it('getNivelActual debe retornar nivel del localStorage', () => {
    localStorage.setItem('nivelActual', '2');
    expect(service.getNivelActual()).toBe(2);
  });

  it('logout debe limpiar localStorage', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('nombre', 'lilo');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});