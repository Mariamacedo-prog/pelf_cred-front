import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { AuthState, loginSuccess, logOutSuccess } from './storage.service';
import { Store } from '@ngrx/store';
import { ToastService } from './toast';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string; 
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.ANGULAR_API;
  private store = inject(Store);
  redirectUrl: string | null = null;

  permissions$: Observable<any>;
  user$: Observable<any>;
  isLoggedIn$: Observable<boolean>;


  constructor(private http: HttpClient, private toastService:ToastService, private router: Router) {
    this.permissions$ = this.store.select(state => state.auth?.permissions);
    this.user$ = this.store.select(state => state.auth?.user);
    this.isLoggedIn$ = this.store.select(state => state.auth?.isLoggedIn);
  }

  auth_login(credentials: {login: string, senha: string}) {
    if (!credentials.login || !credentials.senha) {
      this.toastService.show('error', 'Erro!', 'Login e senha são obrigatórios!');
      return;
    }

    this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(take(1))  
      .subscribe({
        next: (response) => {
          if(response.access_token){
            let user = this.decodeJWT(response.access_token);
            this.router.navigate(['/usuario/lista']);
            this.store.dispatch(loginSuccess({ user: user, token: response.access_token || '' }));
          }
        },
        error: (err) => {
          this.toastService.show('error', 'Erro!', err.error.detail || "Ocorreu um erro!")
        }
    })
  }

  decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }


  logout() {
    this.store.dispatch(logOutSuccess());
    this.router.navigate(['/login']);
  }
}