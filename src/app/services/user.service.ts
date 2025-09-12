import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.ANGULAR_API;

  constructor(private http: HttpClient) { }

  create_user(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/novo/user`, data);
  }
}
