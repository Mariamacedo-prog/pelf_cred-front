import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
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

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/novo/contrato`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  get_by_id(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/contrato/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  list_all(filtro = '', page = 1, items = 10): Observable<any> {
    let params: any = {
      pagina: page,
      items: items
    }

    if(filtro){
      params.filtro = filtro
    }

    return this.http.get(`${this.baseUrl}/contratos`,{ 
      params: params,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  downloadPdf(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pdf/contrato/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      responseType: 'blob'
    });
  }

  downloadWord(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/word/contrato/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      responseType: 'blob' as 'json' 
    });
  }

  delete(id = null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/contrato/${id}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
  
  edit(id: string, data: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/contrato/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  send_to_signature(id: string): Observable<any> {
     return this.http.put(`${this.baseUrl}/contrato/${id}/enviar-para-assinatura`, null,{
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  send_to_edict(id: string): Observable<any> {
     return this.http.put(`${this.baseUrl}/contrato/${id}/enviar-para-edicao`, null,{
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  signature_mutuario(id: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contrato/${id}/assinar/cliente`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  signature_mutuante(id: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contrato/${id}/assinar/responsavel`, data, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}
