import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse, ResponseApi } from '../../interfaces/response-api';
import { API_BASE } from '../../constants/endpoints';
import { GridRequest } from '../../interfaces/request-api';
import { RoleAll } from '../../interfaces/role/role';
import { PossibleValueSelect } from '../../interfaces/components/select';

@Injectable({
  providedIn: 'root'
})
export class GridCrudService {

  constructor(private http: HttpClient) { }

  loadDataGrid(endpoint: string, body: GridRequest): Observable<ResponseApi<PaginatedResponse>> {
    return this.http.post<ResponseApi<PaginatedResponse>>(`${API_BASE}${endpoint}/page`, body);
  }

  create(url: string, body: any): Observable<ResponseApi> {

    let formData: FormData | any = body;
    const existFileBody = this.existFile(body);
    
    if (existFileBody) {
      formData = this.toFormData(body);
    }
    return this.http.post<ResponseApi>(`${API_BASE}${url}`, existFileBody ? formData : body);
  }

  getRegister(url: string, id: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${API_BASE}${url}/${id}`);
  }

  update(url: string, id: number, body: any): Observable<ResponseApi> {

    let formData: FormData | any = body;
    const existFileBody = this.existFile(body);
    if (existFileBody) {
      formData = this.toFormData(body);
    }
    return this.http.put<ResponseApi>(`${API_BASE}${url}/${id}`, existFileBody ? formData : body);
  }

  delete(url: string, id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${API_BASE}${url}/${id}`);
  }

  getAllRoles(endpoint: string): Observable<ResponseApi<RoleAll[]>> {
    return this.http.get<ResponseApi<RoleAll[]>>(`${API_BASE}${endpoint}/all`);
  }

  getAll(endpoint: string): Observable<ResponseApi<PossibleValueSelect[]>> {
    return this.http.get<ResponseApi<PossibleValueSelect[]>>(`${API_BASE}${endpoint}/all`);
  }

  existFile(body: any): boolean {
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const value = body[key];
        if (value instanceof File) {
          return true;
          break;
        }
      }
    }
    return false;
  }

  toFormData(body: any): FormData {
    const formData = new FormData();
  
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const value = body[key];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          // Convierte booleanos a cadenas, el servidor debe convertirlos de nuevo
          formData.append(key, value ? 'true' : 'false');
        } else if (typeof value === 'number') {
          // Convierte los números a su representación de cadena
          formData.append(key, value.toString());
        } else {
          // Para cualquier otro tipo (string, etc.)
          formData.append(key, value);
        }
      }
    }
  
    return formData;
  }
  
  getChart(endpoint: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${API_BASE}${endpoint}`);
  }
}
