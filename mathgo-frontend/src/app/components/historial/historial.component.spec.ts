import { TestBed } from '@angular/core/testing';
import { HistorialComponent } from './historial.component';
import { AuthService } from '../../services/auth.service';
import { HistorialService } from '../../services/historial.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { of, throwError } from 'rxjs';
import { HistorialItem } from '../../models/models';

describe('HistorialComponent', () => {
  let component: HistorialComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let historialServiceSpy: jasmine.SpyObj<HistorialService>;

  const historialMock: HistorialItem[] = [
    { id: 1, pregunta: '2+3', nivel: 1, correcto: true, fechaRespuesta: '2024-01-01' },
    { id: 2, pregunta: '5-2', nivel: 2, correcto: false, fechaRespuesta: '2024-01-02' },
    { id: 3, pregunta: '3x4', nivel: 3, correcto: true, fechaRespuesta: '2024-01-03' },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioId']);
    authServiceSpy.getUsuarioId.and.returnValue(1);

    historialServiceSpy = jasmine.createSpyObj('HistorialService', ['obtenerHistorial', 'guardarResultado']);
    historialServiceSpy.obtenerHistorial.and.returnValue(of(historialMock));

    await TestBed.configureTestingModule({
      imports: [HistorialComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HistorialService, useValue: historialServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar historial en ngOnInit', () => {
    expect(component.historial.length).toBe(3);
  });

  it('totalCorrectos debe contar correctamente', () => {
    expect(component.totalCorrectos).toBe(2);
  });

  it('totalIncorrectos debe contar correctamente', () => {
    expect(component.totalIncorrectos).toBe(1);
  });

  it('porcentaje debe calcularse correctamente', () => {
    expect(component.porcentaje).toBe(67);
  });

  it('porcentaje con historial vacio debe ser 0', () => {
    component.historial = [];
    expect(component.porcentaje).toBe(0);
  });

  it('nivelNombre debe retornar nombre correcto', () => {
    expect(component.nivelNombre(1)).toBe('Sumas');
    expect(component.nivelNombre(2)).toBe('Restas');
    expect(component.nivelNombre(3)).toBe('Mult/Div');
  });

  it('nivelNombre desconocido debe retornar Nivel X', () => {
    expect(component.nivelNombre(99)).toBe('Nivel 99');
  });

  it('debe manejar error en historial', async () => {
    historialServiceSpy.obtenerHistorial.and.returnValue(throwError(() => new Error('Error')));
    const fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.historial.length).toBe(0);
  });
});