import { AuthService } from './../services/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastService } from '../services/toast.service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const toastService = inject(ToastService);
  const token: string = localStorage.getItem('token');

  // Si la solicitud no es al endpoint de login, agrega el token al encabezado
  if (req.url !== `${environment.apiUrl}authentication/login` && req.url !== `${environment.apiUrl}users/verify-email`
     && req.url !== `${environment.apiUrl}authentication/forget-password`
  ) {

    if (authService.isTokenExpired()) {
      authService.logout(); // Llama al método logout si el token ha expirado
      toastService.error('Token expirado', 'vuelve a iniciar sesión');
      return throwError(() => new Error('El token ha expirado. Debe iniciar sesión nuevamente.'));
    }

    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          toastService.error('Error de servidor', 'vuelve a iniciar sesión');
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);

};
