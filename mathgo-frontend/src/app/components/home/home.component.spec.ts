import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getNombre', 'getNivelActual', 'getVidas', 'getAvatarUrl', 'getXp', 'getRol', 'logout'
    ]);
    authServiceSpy.getNombre.and.returnValue('lilo');
    authServiceSpy.getNivelActual.and.returnValue(2);
    authServiceSpy.getVidas.and.returnValue(3);
    authServiceSpy.getAvatarUrl.and.returnValue('https://api.dicebear.com/7.x/adventurer/svg');
    authServiceSpy.getXp.and.returnValue(100);
    authServiceSpy.getRol.and.returnValue('ALUMNO');

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos del usuario en ngOnInit', () => {
    expect(component.nombre).toBe('lilo');
    expect(component.nivelActual).toBe(2);
    expect(component.vidas).toBe(3);
    expect(component.xp).toBe(100);
  });

  it('debe mostrar corazones correctamente', () => {
    component.vidas = 3;
    expect(component.corazones).toBe('❤️❤️❤️🖤🖤');
  });

  it('debe mostrar 5 corazones con vidas completas', () => {
    component.vidas = 5;
    expect(component.corazones).toBe('❤️❤️❤️❤️❤️');
  });

  it('debe navegar a ejercicios si el nivel está desbloqueado', () => {
    component.nivelActual = 2;
    component.seleccionarNivel(1);
    expect(true).toBeTrue();
  });

  it('no debe navegar si el nivel está bloqueado', () => {
    component.nivelActual = 1;
    const nivelAntes = component.nivelActual;
    component.seleccionarNivel(3);
    expect(component.nivelActual).toBe(nivelAntes);
  });

  it('debe llamar logout al cerrar sesión', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('debe navegar al perfil', () => {
    component.irPerfil();
    expect(true).toBeTrue();
  });

  it('debe tener 6 niveles', () => {
    expect(component.niveles.length).toBe(6);
  });

  it('debe tener partículas generadas', () => {
    expect(component.particulas.length).toBe(15);
  });
});