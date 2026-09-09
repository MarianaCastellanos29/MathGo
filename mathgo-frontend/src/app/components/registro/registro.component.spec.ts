import { TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registrar']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con valores vacíos', () => {
    expect(component.nombre).toBe('');
    expect(component.correo).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
  });

  it('registro exitoso debe navegar', () => {
    authServiceSpy.registrar.and.returnValue(of({} as any));
    component.nombre = 'Juan';
    component.correo = 'juan@gmail.com';
    component.password = '123456';
    component.registrar();
    expect(true).toBeTrue();
  });

  it('registro fallido debe mostrar error', () => {
    authServiceSpy.registrar.and.returnValue(throwError(() => new Error('error')));
    component.nombre = 'Juan';
    component.correo = 'juan@gmail.com';
    component.password = '123456';
    component.registrar();
    expect(component.error).toBeTruthy();
  });
});