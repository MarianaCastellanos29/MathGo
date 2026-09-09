import { TestBed } from '@angular/core/testing';
import { ProgresoService } from './progreso.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ProgresoService', () => {
  let service: ProgresoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgresoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProgresoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerProgreso debe hacer GET correcto', () => {
    const mockProgreso = { total: 10, correctos: 8, porcentaje: 80.0 };
    service.obtenerProgreso(1).subscribe(progreso => {
      expect(progreso.total).toBe(10);
      expect(progreso.correctos).toBe(8);
      expect(progreso.porcentaje).toBe(80.0);
    });
    const req = httpMock.expectOne('http://localhost:8080/progreso/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProgreso);
  });

  it('obtenerProgreso sin resultados debe retornar cero', () => {
    const mockProgreso = { total: 0, correctos: 0, porcentaje: 0.0 };
    service.obtenerProgreso(1).subscribe(progreso => {
      expect(progreso.porcentaje).toBe(0.0);
    });
    const req = httpMock.expectOne('http://localhost:8080/progreso/1');
    req.flush(mockProgreso);
  });

  it('obtenerProgreso para diferente usuario', () => {
    service.obtenerProgreso(5).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/progreso/5');
    expect(req.request.method).toBe('GET');
    req.flush({ total: 5, correctos: 3, porcentaje: 60.0 });
  });
});