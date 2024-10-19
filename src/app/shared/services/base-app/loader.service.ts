import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) { }

  showSpinner() {
    this.busyRequestCount++;
    this.spinner;
    this.spinner.show(undefined, {
      type: 'square-jelly-box',
      bdColor: 'rgb(2,6,23)',
      color: '#ffffff',
      size: 'large',
      fullScreen: true
    });
  }

  hideSpinner() {
    this.busyRequestCount--;
    this.spinner;
    if(this.busyRequestCount<=0){
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
