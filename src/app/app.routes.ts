import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { UserFormComponent } from './pages/user/user-form/user-form.component';
import { UserGridComponent } from './pages/user/user-grid/user-grid.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'usuario/novo', component: UserFormComponent},
    { path: 'usuario/lista', component: UserGridComponent, canActivate: [authGuard]},
    { path: 'usuario/form/:id', component: UserFormComponent, canActivate: [authGuard] },
    { path: 'usuario/form/:id/:tela', component: UserGridComponent, canActivate: [authGuard] },
];
