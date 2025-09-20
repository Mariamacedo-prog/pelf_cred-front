import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)},
    // Usuário
    { path: 'usuario/novo', loadComponent: () => import('./pages/user/user-form/user-form.component').then(c => c.UserFormComponent)},
    { path: 'usuario/lista', loadComponent: () => import('./pages/user/user-grid/user-grid.component').then(c => c.UserGridComponent) , canActivate: [authGuard]},
    { path: 'usuario/form/:id', loadComponent: () => import('./pages/user/user-form/user-form.component').then(c => c.UserFormComponent), canActivate: [authGuard] },
    { path: 'usuario/form/:id/:tela', loadComponent: () => import('./pages/user/user-form/user-form.component').then(c => c.UserFormComponent), canActivate: [authGuard] },
    // Cliente
    { path: 'cliente/novo', loadComponent: () => import('./pages/client/client-form/client-form.component').then(c => c.ClientFormComponent), canActivate: [authGuard]},
    { path: 'cliente/lista', loadComponent: () => import('./pages/client/client-grid/client-grid.component').then(c => c.ClientGridComponent), canActivate: [authGuard]},
    { path: 'cliente/form/:id', loadComponent: () => import('./pages/client/client-form/client-form.component').then(c => c.ClientFormComponent), canActivate: [authGuard]},
    { path: 'cliente/form/:id/:tela', loadComponent: () => import('./pages/client/client-form/client-form.component').then(c => c.ClientFormComponent), canActivate: [authGuard]},
    // Plano
    { path: 'plano/novo', loadComponent: () => import('./pages/plano/plano-form/plano-form.component').then(c => c.PlanoFormComponent), canActivate: [authGuard]},
    { path: 'plano/lista', loadComponent: () => import('./pages/plano/plano-grid/plano-grid.component').then(c => c.PlanoGridComponent), canActivate: [authGuard]},
    { path: 'plano/form/:id', loadComponent: () => import('./pages/plano/plano-form/plano-form.component').then(c => c.PlanoFormComponent), canActivate: [authGuard]},
    { path: 'plano/form/:id/:tela', loadComponent: () => import('./pages/plano/plano-form/plano-form.component').then(c => c.PlanoFormComponent), canActivate: [authGuard]},
];
