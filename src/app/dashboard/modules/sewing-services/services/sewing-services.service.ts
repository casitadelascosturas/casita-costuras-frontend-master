import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../../../../shared/constants/endpoints';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { Measure } from '../interfaces/measure';


@Injectable({
  providedIn: 'root'
})
export class SewingServicesService {

constructor(private http: HttpClient) { }

getAllMeasures(endpoint: string): Observable<ResponseApi<Measure[]>> {
  return this.http.get<ResponseApi>(`${API_BASE}${endpoint}/all`);
}

}
