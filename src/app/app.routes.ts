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
    // Serviço
    { path: 'servico/novo', loadComponent: () => import('./pages/servico/servico-form/servico-form.component').then(c => c.ServicoFormComponent), canActivate: [authGuard]},
    { path: 'servico/lista', loadComponent: () => import('./pages/servico/servico-grid/servico-grid.component').then(c => c.ServicoGridComponent), canActivate: [authGuard]},
    { path: 'servico/form/:id', loadComponent: () => import('./pages/servico/servico-form/servico-form.component').then(c => c.ServicoFormComponent), canActivate: [authGuard]},
    { path: 'servico/form/:id/:tela', loadComponent: () => import('./pages/servico/servico-form/servico-form.component').then(c => c.ServicoFormComponent), canActivate: [authGuard]},

    // Vendedor
    { path: 'vendedor/novo', loadComponent: () => import('./pages/vendedor/vendedor-form/vendedor-form.component').then(c => c.VendedorFormComponent), canActivate: [authGuard]},
    { path: 'vendedor/lista', loadComponent: () => import('./pages/vendedor/vendedor-grid/vendedor-grid.component').then(c => c.VendedorGridComponent), canActivate: [authGuard]},
    { path: 'vendedor/form/:id', loadComponent: () => import('./pages/vendedor/vendedor-form/vendedor-form.component').then(c => c.VendedorFormComponent), canActivate: [authGuard]},
    { path: 'vendedor/form/:id/:tela', loadComponent: () => import('./pages/vendedor/vendedor-form/vendedor-form.component').then(c => c.VendedorFormComponent), canActivate: [authGuard]},
];
