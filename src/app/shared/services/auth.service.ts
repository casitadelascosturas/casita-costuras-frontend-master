import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';
import { ResponseApi, ResponseLogin } from '../interfaces/response-api';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin: boolean = false;

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> =new BehaviorSubject<String>("");
  private tokenExpiredSubject = new BehaviorSubject<boolean>(false);
  tokenExpired$ = this.tokenExpiredSubject.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.currentUserLoginOn = new BehaviorSubject<boolean>(localStorage.getItem('token') !== null);
    this.currentUserData = new BehaviorSubject<string>(localStorage.getItem('token') || '');

  }

  login(credentials: LoginRequest): Observable<any> {
    const url: string = `${environment.apiUrl}authentication/login`;

    return this.http.post<ResponseApi<ResponseLogin>>(url, credentials).pipe(
      tap((response: ResponseApi<ResponseLogin>) => {
        if (response.code !== 200) {
          throw { code: response.code, message: response.message };
        }

        const token = response.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
          this.currentUserData.next(token);
          this.currentUserLoginOn.next(true);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    // localStorage.clear();
    this.currentUserLoginOn.next(false);
    this.currentUserData.next('');
    this.tokenExpired$.subscribe().unsubscribe();
    this.isLogin = false;
  }

  private handleError(error: any): Observable<never> {
    let errorTitle = 'Error';
    let errorMessage = 'Ha ocurrido un error inesperado';
  
    if (error.code && error.message) {
      errorMessage = `Error  ${error.code}`;
      errorTitle = error.message;
    } else if (error instanceof HttpErrorResponse) {
      errorMessage = error.message;
    }
  
    this.toastService.error(errorTitle, errorMessage);
    
    return throwError(() => new Error(errorMessage));
  }

  get userData():Observable<String>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn;
  }

  get userToken():String{
    return this.currentUserData.value;
  }

  getTokenStorage(): boolean{
    const token: string = localStorage.getItem('token');
    return (token !== null && token !== '' && token !== undefined) ? true : false;
  }

  decodeToken(): any {
    const token: string = localStorage.getItem('token');
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  decodeTokenVerify(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const existToken: boolean = this.getTokenStorage();
    if(!existToken){
      return true;
    }
    const tokenData = this.decodeToken();
    const expirationDate = new Date(tokenData.exp * 1000); // Convertir a milisegundos
    return expirationDate <= new Date();

  }

  checkTokenExpiration() {
    const isExpired = this.isTokenExpired();
    this.tokenExpiredSubject.next(isExpired);
  }

  getUserData(){
    return this.decodeToken();
  }

  verifyUser(email: string){
    return this.http.post(`${environment.apiUrl}users/verify-email`, {email: email});
  }

}
