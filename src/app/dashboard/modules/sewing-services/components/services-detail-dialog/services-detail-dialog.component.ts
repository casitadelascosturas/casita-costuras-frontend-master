import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { SewingServicesService } from '../../services/sewing-services.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { NgClass } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { MEASURES, URL_MEASURES } from '../../../../../shared/constants/endpoints';
import { Measure } from '../../interfaces/measure';
import { ResponseApi } from '../../../../../shared/interfaces/response-api';
import { CardImageDialogComponent } from '../card-image-dialog/card-image-dialog.component';

@Component({
  selector: 'app-services-detail-dialog',
  standalone: true,
  imports: [InputComponent, FormsModule, ReactiveFormsModule, SelectComponent, DatePickerComponent, NgClass,
    NgOptimizedImage, CardImageDialogComponent
  ],
  templateUrl: './services-detail-dialog.component.html',
  styleUrl: './services-detail-dialog.component.scss'
})
export class ServicesDetailDialogComponent implements OnInit{

  load: boolean = true;
  form: FormGroup;
  url: string = MEASURES;
  measuresList: Measure[] = [];

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef, 
    private utils: UtilsService,
    private service: SewingServicesService){
      this.form = new FormGroup({
        name: new FormControl(null, [
          Validators.minLength(1),
          Validators.maxLength(30)
        ])
      });
    }


  ngOnInit(): void {
    this.service.getAllMeasures(this.url)
    .subscribe({
      next: (response: ResponseApi<Measure[]>) => {
        this.measuresList = response.data ?? [];
      },
      error: (error) => console.log(error),
      complete: () => this.load = false
    });    
  }

  search() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }

  get themeDark(){
    return localStorage.getItem('theme') === 'dark';
  }

  selectMeasure(measure: Measure){
    this.dialogRef.close(measure);
  }
  
}