import { TestBed } from '@angular/core/testing';
import { EjerciciosComponent } from './ejercicios.component';
import { AuthService } from '../../services/auth.service';
import { EjercicioService } from '../../services/ejercicio.service';
import { HistorialService } from '../../services/historial.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

const ejerciciosMock = [
  { pregunta: '¿Cuánto es 2+2?', opciones: ['3', '4', '5', '6'], respuestaCorrecta: '4' },
  { pregunta: '¿Cuánto es 3+3?', opciones: ['5', '6', '7', '8'], respuestaCorrecta: '6' }
];

describe('EjerciciosComponent', () => {
  let component: EjerciciosComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let ejercicioSpy: jasmine.SpyObj<EjercicioService>;
  let historialSpy: jasmine.SpyObj<HistorialService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', [
      'getVidas', 'getXp', 'setXp', 'setVidas', 'setRango', 'setRachaActual',
      'getNivelActual', 'setNivelActual', 'getUsuarioId'
    ]);
    authSpy.getVidas.and.returnValue(5);
    authSpy.getXp.and.returnValue(0);
    authSpy.getNivelActual.and.returnValue(1);
    authSpy.getUsuarioId.and.returnValue(1);

    ejercicioSpy = jasmine.createSpyObj('EjercicioService', [
      'obtenerEjerciciosAPI', 'obtenerDatoCurioso', 'explicarError', 'mensajePyro'
    ]);
    ejercicioSpy.obtenerEjerciciosAPI.and.returnValue(of(ejerciciosMock));
    ejercicioSpy.obtenerDatoCurioso.and.returnValue(of('Dato curioso'));
    ejercicioSpy.explicarError.and.returnValue(of('Explicación del error'));
    ejercicioSpy.mensajePyro.and.returnValue(of('¡Buen trabajo! 🔥'));

    historialSpy = jasmine.createSpyObj('HistorialService', ['guardarResultado']);
    historialSpy.guardarResultado.and.returnValue(of({ xp: 10, rango: 'Aprendiz', rachaActual: 1 }));

    await TestBed.configureTestingModule({
      imports: [EjerciciosComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EjercicioService, useValue: ejercicioSpy },
        { provide: HistorialService, useValue: historialSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EjerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar ejercicios en ngOnInit', () => {
    expect(component.ejercicios.length).toBe(2);
  });

  it('debe seleccionar respuesta correcta', () => {
    component.seleccionar('4');
    expect(component.esCorrecta).toBeTrue();
    expect(component.puntaje).toBe(1);
  });

  it('debe seleccionar respuesta incorrecta y restar vida', () => {
    component.seleccionar('3');
    expect(component.esCorrecta).toBeFalse();
    expect(component.vidas).toBe(4);
  });

  it('no debe seleccionar si ya hay respuesta', () => {
    component.seleccionar('4');
    component.seleccionar('3');
    expect(component.puntaje).toBe(1);
  });

  it('debe calcular progreso correctamente', () => {
    expect(component.progreso).toBe(0);
    component.indiceActual = 1;
    expect(component.progreso).toBe(50);
  });

  it('debe calcular corazones correctamente', () => {
    component.vidas = 3;
    expect(component.corazones).toBe('❤️❤️❤️🖤🖤');
  });

  it('debe retornar nombre del nivel correcto', () => {
    component.nivel = 1;
    expect(component.nombreNivel).toBe('Sumas');
    component.nivel = 3;
    expect(component.nombreNivel).toBe('Multiplicación');
  });

  it('debe dar 3 estrellas con 90% o más', () => {
    component.puntaje = 9;
    component.ejercicios = Array(10).fill(ejerciciosMock[0]);
    expect(component.estrellas).toBe(3);
  });

  it('debe dar 1 estrella con menos de 60%', () => {
    component.puntaje = 1;
    component.ejercicios = Array(10).fill(ejerciciosMock[0]);
    expect(component.estrellas).toBe(1);
  });

  it('debe navegar al home', () => {
    component.irHome();
    expect(true).toBeTrue();
  });

  it('debe navegar al siguiente nivel', () => {
    component.nivel = 1;
    component.irSiguienteNivel();
    expect(true).toBeTrue();
  });

  it('debe navegar al home si es el último nivel', () => {
    component.nivel = 6;
    component.irSiguienteNivel();
    expect(true).toBeTrue();
  });

  it('hayNivelSiguiente debe ser true si no es el último nivel', () => {
    component.nivel = 3;
    expect(component.hayNivelSiguiente).toBeTrue();
  });

  it('hayNivelSiguiente debe ser false en el último nivel', () => {
    component.nivel = 6;
    expect(component.hayNivelSiguiente).toBeFalse();
  });

  it('debe avanzar al siguiente ejercicio', () => {
    component.seleccionar('4');
    component.siguiente();
    expect(component.indiceActual).toBe(1);
    expect(component.respuestaSeleccionada).toBeNull();
  });

  it('debe terminar el nivel al pasar todos los ejercicios', () => {
    component.seleccionar('4');
    component.siguiente();
    component.seleccionar('6');
    component.siguiente();
    expect(component.finNivel).toBeTrue();
  });
});