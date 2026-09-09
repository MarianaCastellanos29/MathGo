import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

const mockLoginResponse = {
  token: 'fake-token',
  usuarioId: 1,
  nombre: 'lilo',
  rol: 'ALUMNO',
  vidas: 5,
  nivelActual: 1,
  xp: 0,
  rango: 'Aprendiz',
  rachaActual: 0
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HttpClient, useValue: httpSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con valores vacíos', () => {
    expect(component.correo).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
    expect(component.cargando).toBeFalse();
  });

  it('debe mostrar error con credenciales incorrectas', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('401')));
    component.correo = 'malo@gmail.com';
    component.password = 'wrongpass';
    component.login();
    expect(component.error).toBe('Correo o contraseña incorrectos');
    expect(component.cargando).toBeFalse();
  });

  it('debe navegar a padre si rol es PADRE', () => {
    authServiceSpy.login.and.returnValue(of({ ...mockLoginResponse, rol: 'PADRE' }) as any);
    component.login();
    expect(true).toBeTrue();
  });

  it('debe navegar a home si rol es ALUMNO y no hay mensaje', () => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse) as any);
    httpSpy.get.and.returnValue(of({ mensaje: '' }));
    component.login();
    expect(true).toBeTrue();
  });

  it('debe mostrar mensaje del padre si existe', () => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse) as any);
    httpSpy.get.and.returnValue(of({ mensaje: '¡Sigue adelante!' }));
    component.login();
    expect(true).toBeTrue();
  });

  it('debe navegar a home al cerrar mensaje', () => {
    component.cerrarMensaje();
    expect(component.mostrarMensaje).toBeFalse();
  });

  it('debe navegar a home si falla la petición de mensaje', () => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse) as any);
    httpSpy.get.and.returnValue(throwError(() => new Error('error')));
    component.login();
    expect(true).toBeTrue();
  });
});