import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private baseUrl = environment.ANGULAR_API_V1;
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
    return this.http.get(`${this.baseUrl}/transacao/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  list_all(filtro = '', contrato_id = null,  page = 1, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(filtro){
      params.filtro = filtro
    }

    if(contrato_id){
      params.contrato_id = contrato_id
    }

    return this.http.get(`${this.baseUrl}/transacoes`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  list_all_overdue(filtro = '',  page = 1, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(filtro){
      params.filtro = filtro
    }

    return this.http.get(`${this.baseUrl}/transacoes/atraso`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  total_all(data_inicio = null, data_fim = null): Observable<any> {
    let params: any = {
    }

    if(data_inicio){
      params.data_inicio = data_inicio
    }

    if(data_fim){
      params.data_fim = data_fim
    }

    return this.http.get(`${this.baseUrl}/transacoes/dashboard/resumo`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  edit(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/transacao/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}
