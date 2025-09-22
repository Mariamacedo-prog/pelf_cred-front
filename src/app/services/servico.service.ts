import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
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
  get_by_id(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/servico/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_all_info(search = '', page = 1, items = 10000): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(search){
      params.filtro = search
    }

    return this.http.get(`${this.baseUrl}/servicos/info`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_all(search = '', page = 1, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(search){
      params.filtro = search
    }

    return this.http.get(`${this.baseUrl}/servicos`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/novo/servico`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }


  delete(id = null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/servico/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
  
  edit(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/servico/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}
