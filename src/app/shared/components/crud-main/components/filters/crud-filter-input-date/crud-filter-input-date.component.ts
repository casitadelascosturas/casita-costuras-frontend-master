import { Component, Input, Output, EventEmitter, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapXCircle } from '@ng-icons/bootstrap-icons';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }, 
};

@Component({
  selector: 'app-crud-filter-input-date',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, CommonModule, NgIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './crud-filter-input-date.component.html',
  styleUrl: './crud-filter-input-date.component.scss'
})
export class CrudFilterInputDateComponent implements OnInit {

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  @Input() form: FormGroup;
  @Input() name: string;
  @Input() icon: string;
  @Input() label: string = 'Selecciona fecha';
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Input() patternHint = '';
  @Input() load = false;
  
  @Output() changes = new EventEmitter<string>();
  // @Output() changes = new EventEmitter<MatDatepickerInputEvent<Date> | null>();
  @Output() clear = new EventEmitter<boolean>();

  ngOnInit(): void {}

  getFormControl(): FormControl {
    const control = this.form.get(this.name) as FormControl;
    if (control) {
      return control;
    } else {
      throw new Error(`No se encontró el control con el nombre '${this.name}' en el formulario.`);
    }
  }

  clearDate(event: MouseEvent) {
    event.stopPropagation(); // Detener la propagación del evento
    this.getFormControl().setValue(null);
    this.clear.emit(true);
  }

  getFloatLabelValue(): FloatLabelType {
    return this.getFormControl().value || 'auto';
  }

  change(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
  if (selectedDate) {
    const isoDateString = selectedDate.toISOString();
    this.changes.emit(isoDateString);
  } else {
    this.changes.emit(null);
  }
  
  }
}
