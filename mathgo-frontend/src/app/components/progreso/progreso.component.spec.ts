import { TestBed } from '@angular/core/testing';
import { ProgresoComponent } from './progreso.component';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('ProgresoComponent', () => {
  let component: ProgresoComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsuarioId', 'getNombre', 'getXp', 'getRango', 'getRachaActual', 'getVidas', 'getNivelActual'
    ]);
    authServiceSpy.getUsuarioId.and.returnValue(1);
    authServiceSpy.getNombre.and.returnValue('lilo');
    authServiceSpy.getXp.and.returnValue(100);
    authServiceSpy.getRango.and.returnValue('Aprendiz');
    authServiceSpy.getRachaActual.and.returnValue(5);
    authServiceSpy.getVidas.and.returnValue(3);
    authServiceSpy.getNivelActual.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [ProgresoComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar nombre del usuario', () => {
    expect(component.nombre).toBe('lilo');
  });

  it('debe cargar vidas del usuario', () => {
    expect(component.vidas).toBe(3);
  });

  it('debe cargar nivel actual', () => {
    expect(component.nivelActual).toBe(1);
  });

  it('corazones debe mostrar corazones', () => {
    expect(component.corazones).toContain('❤️');
  });
});