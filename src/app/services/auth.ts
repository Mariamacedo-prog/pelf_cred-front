import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.ANGULAR_API;

  constructor(private http: HttpClient) {}

  auth_login(credentials: {login: string, senha: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
}