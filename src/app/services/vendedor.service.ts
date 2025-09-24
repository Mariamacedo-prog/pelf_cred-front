import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
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

  create_client(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/novo/vendedor`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_client_by_id(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendedor/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  list_all(filtro = '', page = 1, filtro_cidade: any = null, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(filtro){
      params.filtro = filtro
    }

    if(filtro_cidade){
      params.filtro_cidade = filtro_cidade
    }

    return this.http.get(`${this.baseUrl}/vendedores`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  delete(id = null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vendedor/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
  
  edit(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/vendedor/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }


  get_city(search: string = ''): Observable<any> {
    return this.http.get(`${this.baseUrl}/cidades`, {
      params:{
        filtro: search
      },
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}
