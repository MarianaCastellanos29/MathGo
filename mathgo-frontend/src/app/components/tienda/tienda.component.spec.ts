import { TestBed } from '@angular/core/testing';
import { TiendaComponent } from './tienda.component';
import { AuthService } from '../../services/auth.service';
import { TiendaService, ItemTienda } from '../../services/tienda.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('TiendaComponent', () => {
  let component: TiendaComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tiendaServiceSpy: jasmine.SpyObj<TiendaService>;

  const itemsMock: ItemTienda[] = [
    { id: 'adventurer', nombre: 'Aventurero', descripcion: 'Clásico', precio: 0, estilo: 'adventurer', emoji: '🧙' },
    { id: 'pixel-art', nombre: 'Pixel Art', descripcion: 'Retro', precio: 50, estilo: 'pixel-art', emoji: '🎮' }
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getNombre', 'getXp', 'setXp', 'getAvatar', 'setAvatar', 'getVidas', 'setVidas'
    ]);
    authServiceSpy.getNombre.and.returnValue('lilo');
    authServiceSpy.getXp.and.returnValue(200);
    authServiceSpy.getAvatar.and.returnValue('adventurer');
    authServiceSpy.getVidas.and.returnValue(3);

    tiendaServiceSpy = jasmine.createSpyObj('TiendaService', [
      'estaComprado', 'comprar', 'getAvatarPreview'
    ], {
      items: itemsMock
    });
    tiendaServiceSpy.estaComprado.and.returnValue(false);
    tiendaServiceSpy.comprar.and.returnValue({ ok: true, mensaje: '¡Comprado!' });
    tiendaServiceSpy.getAvatarPreview.and.returnValue('http://preview.url');

    await TestBed.configureTestingModule({
      imports: [TiendaComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TiendaService, useValue: tiendaServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(TiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos en ngOnInit', () => {
    expect(component.nombre).toBe('lilo');
    expect(component.xp).toBe(200);
    expect(component.vidas).toBe(3);
  });

  it('comprar debe llamar al servicio', () => {
    component.comprar(itemsMock[1]);
    expect(tiendaServiceSpy.comprar).toHaveBeenCalled();
  });

  it('usar debe cambiar avatar actual', () => {
    component.usar(itemsMock[0]);
    expect(authServiceSpy.setAvatar).toHaveBeenCalledWith('adventurer');
  });

  it('getPreview debe retornar URL', () => {
    const url = component.getPreview('adventurer');
    expect(url).toBe('http://preview.url');
  });

  it('corazones debe mostrar corazones', () => {
    expect(component.corazones).toContain('❤️');
  });

  it('comprarVida con vidas llenas debe mostrar mensaje', () => {
    component.vidas = 5;
    component.comprarVida();
    expect(component.mensaje).toBe('¡Ya tienes todas las vidas!');
  });

  it('comprarVida sin monedas debe mostrar mensaje', () => {
    component.vidas = 3;
    component.xp = 10;
    component.comprarVida();
    expect(component.mensaje).toContain('monedas');
  });

  it('comprarVida con monedas suficientes debe agregar vida', () => {
    component.vidas = 3;
    component.xp = 200;
    authServiceSpy.getXp.and.returnValue(150);
    authServiceSpy.getVidas.and.returnValue(4);
    component.comprarVida();
    expect(authServiceSpy.setVidas).toHaveBeenCalled();
  });
});