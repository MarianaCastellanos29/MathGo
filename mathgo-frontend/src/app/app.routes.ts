import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ejercicios/:nivel',
    loadComponent: () => import('./components/ejercicios/ejercicios.component').then(m => m.EjerciciosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'progreso',
    loadComponent: () => import('./components/progreso/progreso.component').then(m => m.ProgresoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'logros',
    loadComponent: () => import('./components/logros/logros.component').then(m => m.LogrosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'historial',
    loadComponent: () => import('./components/historial/historial.component').then(m => m.HistorialComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tienda',
    loadComponent: () => import('./components/tienda/tienda.component').then(m => m.TiendaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/padre/padre.component').then(m => m.PadreComponent),
    canActivate: [authGuard]
  },
  {
    path: 'padre',
    loadComponent: () => import('./components/padre/padre.component').then(m => m.PadreComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];