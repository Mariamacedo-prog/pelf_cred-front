import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
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
    return this.http.post(`${this.baseUrl}/novo/cliente`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_client_by_id(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  list_all_clients(search = '', page = 1, data_cadastro: any = null, disabled = null, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(search){
      params.search = search
    }

    if(data_cadastro){
      params.data_cadastro = data_cadastro
    }

    if(disabled !== null){
      params.disabled = disabled
    }

    return this.http.get(`${this.baseUrl}/clientes`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  delete_client(id = null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cliente/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
  
  edit_client(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/cliente/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_info_by_cnpj_receita(cnpj: string): Observable<any> {
     return this.http.get(`${this.baseUrl}/receita/${cnpj}`,
      {
        headers: {
          "Accept": `*/*`
        }
      });
  }

  
  get_info_by_cnpj_cnpja(cnpj: string): Observable<any> {
     return this.http.get(`${this.baseUrl}/cnpja/${cnpj}`,
      {
        headers: {
          "Accept": `*/*`
        }
      });
  }
}
