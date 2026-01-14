import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface ExportColumn {
  field: string;
  header: string;
  width: number;
}

export interface BodyExport {
  endpoint_url?: string;
  excel_name?: string;
  method?: string;
  columns?: ExportColumn[];
  authorization?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
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

  generate_excel(endpoint: string, columns: ExportColumn[], params: any = {}): Observable<any> {
      const data = {
        endpoint_url: `${this.baseUrl}/${endpoint}`,
        excel_name: "planilha",
        method: "GET",
        columns,
        authorization: `Bearer ${this.token}`,
        params
      };

      return this.http.post(
        `${this.baseUrl}/export-excel`,
        data,
        {
          responseType: 'blob' as 'json',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );
  }
}
