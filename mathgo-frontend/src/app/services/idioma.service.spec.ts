import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IdiomaService } from './idioma.service';

describe('IdiomaService', () => {
  let service: IdiomaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    service = TestBed.inject(IdiomaService);
  });

  it('cambia el idioma, lo guarda y actualiza el atributo lang', () => {
    service.cambiar('en');

    expect(service.idioma()).toBe('en');
    expect(localStorage.getItem('idioma')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('usa el locale es-CO para español y en-US para inglés', () => {
    service.cambiar('es');
    expect(service.locale()).toBe('es-CO');

    service.cambiar('en');
    expect(service.locale()).toBe('en-US');
  });

  it('al iniciar recupera el idioma guardado', () => {
    localStorage.setItem('idioma', 'en');
    service.iniciar();

    expect(service.idioma()).toBe('en');
  });

  it('ignora un idioma guardado que no existe y usa español', () => {
    localStorage.setItem('idioma', 'fr');
    service.iniciar();

    expect(service.idioma()).toBe('es');
  });
});
