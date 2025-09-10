import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { UserFormComponent } from './pages/user/user-form/user-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'novo/usuario', component: UserFormComponent},
    { path: 'teste', component: UserFormComponent, canActivate: [authGuard]},
];
