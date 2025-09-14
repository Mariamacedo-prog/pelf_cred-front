import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { UserFormComponent } from './pages/user/user-form/user-form.component';
import { UserListaComponent } from './pages/user/user-lista/user-lista.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'usuario/novo', component: UserFormComponent},
    { path: 'usuario/lista', component: UserListaComponent, canActivate: [authGuard]},
    { path: 'usuario/form/:id', component: UserFormComponent, canActivate: [authGuard] },
    { path: 'usuario/form/:id/:tela', component: UserListaComponent, canActivate: [authGuard] },
];
