import { TestBed } from '@angular/core/testing';
import { HistorialService } from './historial.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('HistorialService', () => {
  let service: HistorialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistorialService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HistorialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerHistorial debe hacer GET correcto', () => {
    const mockData = [
      { id: 1, pregunta: '2+3', nivel: 1, correcto: true, fechaRespuesta: '2024-01-01' }
    ];
    service.obtenerHistorial(1).subscribe(data => {
      expect(data.length).toBe(1);
    });
    const req = httpMock.expectOne('http://localhost:8080/historial/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('guardarResultado debe hacer POST correcto', () => {
    const mockResponse = { correcto: true, xp: 10, rango: 'Aprendiz', rachaActual: 1, mejorRacha: 1 };
    service.guardarResultado(1, '2+3', 1, true).subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne('http://localhost:8080/historial/guardar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ usuarioId: 1, pregunta: '2+3', nivel: 1, correcto: true });
    req.flush(mockResponse);
  });

  it('guardarResultado incorrecto debe hacer POST', () => {
    service.guardarResultado(2, '5-3', 2, false).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/historial/guardar');
    expect(req.request.body.correcto).toBeFalse();
    req.flush({});
  });
});