import { TestBed } from '@angular/core/testing';
import { EjercicioService } from './ejercicio.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('EjercicioService', () => {
  let service: EjercicioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EjercicioService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EjercicioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerEjerciciosAPI nivel 1 debe retornar sumas', (done) => {
    service.obtenerEjerciciosAPI(1).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      ejercicios.forEach(e => expect(e.pregunta).toContain('+'));
      done();
    });
  });

  it('obtenerEjerciciosAPI nivel 2 debe retornar restas', (done) => {
    service.obtenerEjerciciosAPI(2).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      ejercicios.forEach(e => expect(e.pregunta).toContain('-'));
      done();
    });
  });

  it('obtenerEjerciciosAPI nivel 3 debe retornar multiplicaciones', (done) => {
    service.obtenerEjerciciosAPI(3).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      ejercicios.forEach(e => expect(e.pregunta).toContain('×'));
      done();
    });
  });

  it('obtenerEjerciciosAPI nivel 4 debe retornar divisiones', (done) => {
    service.obtenerEjerciciosAPI(4).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      ejercicios.forEach(e => expect(e.pregunta).toContain('÷'));
      done();
    });
  });

  it('obtenerEjerciciosAPI nivel 5 debe retornar raices', (done) => {
    service.obtenerEjerciciosAPI(5).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      ejercicios.forEach(e => expect(e.pregunta).toContain('raíz'));
      done();
    });
  });

  it('obtenerEjerciciosAPI nivel 6 debe retornar 10 ejercicios', (done) => {
    service.obtenerEjerciciosAPI(6).subscribe(ejercicios => {
      expect(ejercicios.length).toBe(10);
      done();
    });
  });

  it('cada ejercicio debe tener 4 opciones', (done) => {
    service.obtenerEjerciciosAPI(1).subscribe(ejercicios => {
      ejercicios.forEach(e => expect(e.opciones.length).toBe(4));
      done();
    });
  });

  it('la respuesta correcta debe estar en las opciones', (done) => {
    service.obtenerEjerciciosAPI(1).subscribe(ejercicios => {
      ejercicios.forEach(e => expect(e.opciones).toContain(e.respuestaCorrecta));
      done();
    });
  });

  it('obtenerDatoCurioso debe retornar string', (done) => {
    service.obtenerDatoCurioso(7).subscribe(dato => {
      expect(typeof dato).toBe('string');
      expect(dato.length).toBeGreaterThan(0);
      done();
    });
  });

  it('obtenerDatoCurioso para numero primo debe mencionarlo', (done) => {
    service.obtenerDatoCurioso(11).subscribe(dato => {
      expect(dato).toBeTruthy();
      done();
    });
  });

  it('obtenerDatoCurioso para cuadrado perfecto', (done) => {
    service.obtenerDatoCurioso(49).subscribe(dato => {
      expect(dato).toContain('cuadrado perfecto');
      done();
    });
  });

  it('obtenerDatoCurioso para numero par', (done) => {
    service.obtenerDatoCurioso(22).subscribe(dato => {
      expect(dato).toContain('par');
      done();
    });
  });

  it('obtenerDatoCurioso para multiplo de 10', (done) => {
    service.obtenerDatoCurioso(40).subscribe(dato => {
      expect(dato).toBeTruthy();
      expect(dato.length).toBeGreaterThan(0);
      done();
    });
  });

  it('obtenerDatoCurioso para multiplo de 5', (done) => {
    service.obtenerDatoCurioso(35).subscribe(dato => {
      expect(dato).toContain('múltiplo de 5');
      done();
    });
  });

  it('explicarError con suma debe retornar explicacion', (done) => {
    service.explicarError('¿Cuánto es 3 + 4?', '7', '5').subscribe(exp => {
      expect(exp).toContain('sumar');
      done();
    });
  });

  it('explicarError con resta debe retornar explicacion', (done) => {
    service.explicarError('¿Cuánto es 10 - 3?', '7', '5').subscribe(exp => {
      expect(exp).toContain('restar');
      done();
    });
  });

  it('explicarError con multiplicacion debe retornar explicacion', (done) => {
    service.explicarError('¿Cuánto es 3 × 4?', '12', '9').subscribe(exp => {
      expect(exp).toContain('Multiplicar');
      done();
    });
  });

  it('explicarError con division debe retornar explicacion', (done) => {
    service.explicarError('¿Cuánto es 12 ÷ 3?', '4', '3').subscribe(exp => {
      expect(exp).toContain('Dividir');
      done();
    });
  });

  it('explicarError con raiz debe retornar explicacion', (done) => {
    service.explicarError('¿Cuál es la raíz de 9?', '3', '2').subscribe(exp => {
      expect(exp).toContain('raíz');
      done();
    });
  });

  it('explicarError con porcentaje debe retornar explicacion', (done) => {
    service.explicarError('¿Cuánto es el 50% de 100?', '50', '40').subscribe(exp => {
      expect(exp).toContain('%');
      done();
    });
  });

  it('explicarError generico debe retornar diferencia', (done) => {
    service.explicarError('pregunta desconocida', '10', '7').subscribe(exp => {
      expect(exp).toContain('diferencia');
      done();
    });
  });

  it('mensajePyro con puntaje alto debe retornar mensaje positivo', (done) => {
    service.mensajePyro(9, 10, 1).subscribe(msg => {
      expect(msg).toBeTruthy();
      done();
    });
  });

  it('mensajePyro con puntaje medio debe retornar mensaje', (done) => {
    service.mensajePyro(6, 10, 1).subscribe(msg => {
      expect(msg).toBeTruthy();
      done();
    });
  });

  it('mensajePyro con puntaje bajo debe retornar mensaje', (done) => {
    service.mensajePyro(2, 10, 1).subscribe(msg => {
      expect(msg).toBeTruthy();
      done();
    });
  });
});