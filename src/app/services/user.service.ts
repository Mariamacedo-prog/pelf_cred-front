import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { Store } from '@ngrx/store';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.ANGULAR_API;
  private store = inject(Store);

  token = '';

  constructor(private http: HttpClient) { 
    this.store.select(state => state.auth?.token).subscribe(
      tk => {
        this.token = tk;
      }
    );
  }

  create_user(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/novo/user`, data);
  }

  list_all_users(search = '', page = 1, items = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`,{ 
      params: {
        filtro: search,
        pagina: page,
        items: items
      },
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_user_by_id(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  delete_user(id = null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
  
  edit_user(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/user/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}
