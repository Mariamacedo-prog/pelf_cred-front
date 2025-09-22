import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { logOutSuccess } from './storage.service';
import { Store } from '@ngrx/store';
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


  constructor(private http: HttpClient, private router: Router) {
    this.permissions$ = this.store.select(state => state.auth?.permissions);
    this.user$ = this.store.select(state => state.auth?.user);
    this.isLoggedIn$ = this.store.select(state => state.auth?.isLoggedIn);
  }

  auth_login(credentials: {login: string, senha: string}) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
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