import { TestBed } from '@angular/core/testing';
import { LogrosService } from './logros.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('LogrosService', () => {
  let service: LogrosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogrosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LogrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerLogros debe hacer GET correcto', () => {
    const mockLogros = [
      { id: 1, logro: { id: 1, nombre: 'Primera racha', descripcion: 'desc', icono: '🔥', tipo: 'RACHA', valorRequerido: 3 }, fechaObtenido: '2024-01-01' }
    ];
    service.obtenerLogros(1).subscribe(logros => {
      expect(logros.length).toBe(1);
    });
    const req = httpMock.expectOne('http://localhost:8080/historial/1/logros');
    expect(req.request.method).toBe('GET');
    req.flush(mockLogros);
  });

  it('obtenerLogros sin logros debe retornar array vacio', () => {
    service.obtenerLogros(2).subscribe(logros => {
      expect(logros.length).toBe(0);
    });
    const req = httpMock.expectOne('http://localhost:8080/historial/2/logros');
    req.flush([]);
  });
});