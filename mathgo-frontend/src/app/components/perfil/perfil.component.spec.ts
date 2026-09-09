import { TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { AuthService } from '../../services/auth.service';
import { TiendaService } from '../../services/tienda.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getNombre', 'getAvatar', 'setAvatar'
    ]);
    authServiceSpy.getNombre.and.returnValue('lilo');
    authServiceSpy.getAvatar.and.returnValue('adventurer');

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar nombre y avatar en ngOnInit', () => {
    expect(component.nombre).toBe('lilo');
    expect(component.avatarSeleccionado).toBe('adventurer');
  });

  it('getAvatarUrl debe retornar URL de dicebear', () => {
    const url = component.getAvatarUrl('adventurer');
    expect(url).toContain('dicebear.com');
  });

  it('seleccionar avatar comprado debe cambiar selección', () => {
    component.seleccionar('adventurer');
    expect(component.avatarSeleccionado).toBe('adventurer');
  });

  it('guardar debe llamar setAvatar', () => {
    component.guardar();
    expect(authServiceSpy.setAvatar).toHaveBeenCalledWith('adventurer');
  });

  it('guardar debe mostrar mensaje de guardado', () => {
    component.guardar();
    expect(component.guardado).toBeTrue();
  });

  it('debe tener 8 estilos de avatar', () => {
    expect(component.estilos.length).toBe(8);
  });
});