import { Injectable } from '@angular/core';
import { LoaderService } from '../base-app/loader.service';
import { GridCrudService } from '../crud/grid-crud.service';
import { ResponseApi } from '../../interfaces/response-api';
import { GridTableRequest } from '../../interfaces/request-api';
import { ToastService } from '../toast.service';
import { CrudConfig } from '../../interfaces/crud/crud';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PossibleValueSelect } from '../../interfaces/components/select';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService  extends ToastService{

  constructor(
    private loader: LoaderService,
    private http: HttpClient,
    private crud: GridCrudService, 
    private auth: AuthService) {
    super();
  }

  showLoader() {
    this.loader.showSpinner();
  }

  hideLoader() {
    this.loader.hideSpinner();
  }

  loadConfig(configName: string): Observable<CrudConfig> {
    const url = `assets/data/${configName}.json`;
    return this.http.get<CrudConfig>(url);
  }

  loadOptions(configName: string): Observable<PossibleValueSelect[]> {
    const url = `assets/data/${configName}.json`;
    return this.http.get<PossibleValueSelect[]>(url);
  }

  getPageInit(data: GridTableRequest){
    return this.crud.loadDataGrid(data.url, data.request)
  }

  create(url: string, body: any){
    return this.crud.create(url, body)
  }

  getRegister(url: string, id: number){
    return this.crud.getRegister(url, id)
  }

  update(url: string, id: number, body: any){
    return this.crud.update(url, id, body)
  }

  delete(url: string, id: number){
    return this.crud.delete(url, id)
  }

  edit(url: string, id: number){
    // return this.crud.loadDataGrid(data.url, data.request)
  }

  formateCurrency(value: number): string {
    return `Q ${value.toFixed(2)}`;
  }

  responseAPI(response: ResponseApi){
    if (response.code === 201 || response.code === 200) {
      this.success(response.message);
    }else if (response.code === 100) {
      this.info(response.message);
    } else if (response.code !== 200) {
      this.error(response.message, `Error ${response.code}`);
    }
  }

  getUserInfo(){
    return this.auth.getUserData();
  }

  getAll(url: string){
    return this.crud.getAll(url)
  }

  getCharts(url: string){
    return this.crud.getChart(url)
  }

  get themeIsDark(): boolean {
    return localStorage.getItem('theme') === 'dark';
  }
}
