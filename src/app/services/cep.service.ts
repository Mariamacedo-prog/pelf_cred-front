import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  getAddressByCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getCitiesByState(uf: string): Observable<any> {
    return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  }
}
