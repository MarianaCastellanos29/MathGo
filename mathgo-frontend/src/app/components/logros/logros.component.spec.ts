import { TestBed } from '@angular/core/testing';
import { LogrosComponent } from './logros.component';
import { AuthService } from '../../services/auth.service';
import { LogrosService } from '../../services/logros.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { of } from 'rxjs';
import { HttpTestingController } from '@angular/common/http/testing';
import { UsuarioLogro, Logro } from '../../models/models';

describe('LogrosComponent', () => {
  let component: LogrosComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let logrosServiceSpy: jasmine.SpyObj<LogrosService>;
  let httpMock: HttpTestingController;

  const logrosMock: UsuarioLogro[] = [
    {
      id: 1,
      logro: { id: 1, nombre: 'Primera racha', descripcion: 'Racha de 3', icono: '🔥', tipo: 'RACHA', valorRequerido: 3 },
      fechaObtenido: '2024-01-01'
    }
  ];

  const todosLogrosMock: Logro[] = [
    { id: 1, nombre: 'Primera racha', descripcion: 'Racha de 3', icono: '🔥', tipo: 'RACHA', valorRequerido: 3 },
    { id: 2, nombre: 'Racha de fuego', descripcion: 'Racha de 5', icono: '🔥🔥', tipo: 'RACHA', valorRequerido: 5 },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsuarioId', 'getXp', 'getRango', 'getRachaActual'
    ]);
    authServiceSpy.getUsuarioId.and.returnValue(1);
    authServiceSpy.getXp.and.returnValue(180);
    authServiceSpy.getRango.and.returnValue('Estudiante');
    authServiceSpy.getRachaActual.and.returnValue(3);

    logrosServiceSpy = jasmine.createSpyObj('LogrosService', ['obtenerLogros']);
    logrosServiceSpy.obtenerLogros.and.returnValue(of(logrosMock));

    await TestBed.configureTestingModule({
      imports: [LogrosComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LogrosService, useValue: logrosServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(LogrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8080/logros').flush(todosLogrosMock);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar xp, rango y racha', () => {
    expect(component.xp).toBe(180);
    expect(component.rango).toBe('Estudiante');
    expect(component.rachaActual).toBe(3);
  });

  it('debe cargar logros obtenidos', () => {
    expect(component.logrosObtenidos.length).toBe(1);
  });

  it('debe cargar todos los logros', () => {
    expect(component.todosLosLogros.length).toBe(2);
  });

  it('estaObtenido debe retornar true para logro obtenido', () => {
    expect(component.estaObtenido(1)).toBeTrue();
  });

  it('estaObtenido debe retornar false para logro no obtenido', () => {
    expect(component.estaObtenido(99)).toBeFalse();
  });

  it('fechaObtenido debe retornar fecha correcta', () => {
    expect(component.fechaObtenido(1)).toBe('2024-01-01');
  });

  it('fechaObtenido sin logro debe retornar vacio', () => {
    expect(component.fechaObtenido(99)).toBe('');
  });

  it('rangoEmoji debe retornar emoji correcto', () => {
    expect(component.rangoEmoji).toBe('📚');
    component.rango = 'Genio';
    expect(component.rangoEmoji).toBe('🏆');
    component.rango = 'Matematico';
    expect(component.rangoEmoji).toBe('🎓');
    component.rango = 'Aprendiz';
    expect(component.rangoEmoji).toBe('🌱');
  });

  it('porcentajeProgreso debe calcularse correctamente', () => {
    expect(component.porcentajeProgreso).toBe(50);
  });

  it('porcentajeProgreso sin logros debe ser 0', () => {
    component.todosLosLogros = [];
    expect(component.porcentajeProgreso).toBe(0);
  });
});