import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/base-app/loader.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(LoaderService);
  // busyService.showSpinner(); 
  //   return next(req).pipe(
  //   delay(200),
  //   finalize(() => busyService.hideSpinner())
  // )
  return next(req);
};
