import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../../shared/services/utils/utils.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../../../../shared/components/input/input.component";
import { DatePickerComponent } from "../../../../../../shared/components/date-picker/date-picker.component";
import {NgxMaterialTimepickerModule, NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import moment from 'moment';
import { ToggleComponent } from "../../../../../../shared/components/toggle/toggle.component";
import { InputAutocompleteComponent } from '../../../../../../shared/components/input-autocomplete/input-autocomplete.component';
import { PossibleValueSelect } from '../../../../../../shared/interfaces/components/select';
import { ResponseApi } from '../../../../../../shared/interfaces/response-api';
import { MatIconModule } from '@angular/material/icon';
import { REGUEX_DECIMAL_INT, REGUEX_EMAIL } from '../../../../../../shared/constants/reguex';

@Component({
  selector: 'app-order-add-general-info',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputComponent, DatePickerComponent, NgxMaterialTimepickerModule, 
    ToggleComponent, InputAutocompleteComponent, MatIconModule],
  templateUrl: './order-add-general-info.component.html',
  styleUrl: './order-add-general-info.component.scss'
})
export class OrderAddGeneralInfoComponent implements OnInit{

  load: boolean = false;
  form: FormGroup;
  formNewClient: FormGroup;
  today: Date = new Date();
  currentTheme: NgxMaterialTimepickerTheme;
  deliverDate: Date = null;
  clientSelect: any;
  // Tema para modo claro
  lightTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#ffffff',  // Fondo blanco
      buttonColor: '#000000'           // Texto negro
    },
    dial: {
      dialBackgroundColor: '#10b981',  // Color claro para el fondo del dial
    },
    clockFace: {
      clockFaceBackgroundColor: '#e5e7eb',  // Fondo claro del reloj
      clockHandColor: '#10b981',            // Color de la manecilla
      clockFaceTimeInactiveColor: '#374151', // Números inactivos en gris oscuro
    }
  };

  // Tema para modo oscuro
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#0f172a',  // Fondo oscuro
      buttonColor: '#ffffff'           // Texto blanco
    },
    dial: {
      dialBackgroundColor: '#10b981',  // Color oscuro para el fondo del dial
    },
    clockFace: {
      clockFaceBackgroundColor: '#020617',  // Fondo oscuro del reloj
      clockHandColor: '#10b981',            // Manecilla gris clara
      clockFaceTimeInactiveColor: '#d1d5db', // Números inactivos claros
    }
  };

  constructor(private utils: UtilsService, private cdr: ChangeDetectorRef){
    this.form = new FormGroup({
      description: new FormControl('', [Validators.minLength(1), Validators.maxLength(200)]),
      deliver_date: new FormControl('', Validators.required),
      deliver_hour: new FormControl('', [Validators.required, Validators.pattern('^(0?[1-9]|1[0-2]):[0-5][0-9](\\s)?(AM|PM)$' )]),
      advance_payment: new FormControl('', [Validators.min(1), Validators.pattern(REGUEX_DECIMAL_INT)]),
      telephone: new FormControl({ value: '', disabled: true }, [Validators.minLength(8), Validators.maxLength(10)]),
      client: new FormControl('', [Validators.required]),
      newClient: new FormControl('')
    });

    this.formNewClient = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.pattern(REGUEX_EMAIL)]),
      location: new FormControl(''),
      telephone: new FormControl('', [Validators.minLength(8), Validators.maxLength(10)]),
      whatsapp: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }
  
  onDeliverHourChange(event) {
    this.updateDeliverDateTime(event);
  }

  onDeliverDateChange(event) {
    const date = moment(event).toDate();  // Convertir el objeto `moment` a `Date`
    this.form.get('deliver_date')?.setValue(date);
  }

  updateDeliverDateTime(time?: string) {
    const date = this.form.get('deliver_date')?.value;
    const timeValue = time || this.form.get('deliver_hour')?.value;

    if (date && timeValue) {
      const [rawHours, rawMinutes] = timeValue.split(':');
      let hours = parseInt(rawHours, 10);
      const minutes = parseInt(rawMinutes.slice(0, 2), 10);
      const isPM = rawMinutes.includes('PM');

      if (isPM && hours < 12) {
        hours += 12;
      } else if (!isPM && hours === 12) {
        hours = 0;
      }

      const fullDate = new Date(date);
      fullDate.setHours(hours, minutes);
      this.deliverDate = fullDate;
      this.form.get('deliverDateTime')?.setValue(fullDate.toISOString());
    }
  }

  get themeDark(){
    return localStorage.getItem('theme') === 'dark';
  }

  getFormControl(name: string): FormControl{
    return this.form.get(name) as FormControl;
  }

  changeClient($event: PossibleValueSelect){
    const id: number = $event.value;
    this.utils.getRegister('clients', id).subscribe({
      next:(response: ResponseApi<any>) => {
        this.clientSelect = response.data;
        if(this.clientSelect?.telephone && this.clientSelect?.telephone !== ''){
          this.form.controls['telephone'].enable();
          this.form.controls['telephone'].setValue(this.clientSelect?.telephone);
        }
      },
      error:(error: any) => {
        this.utils.error('Error en el servidor!');
      },
      complete: () => {
      }
    });
  }

  areAllFormsValid(): boolean {
    return this.form.controls['newClient'].value 
            ? this.form.controls['deliver_date'].valid && this.form.controls['deliver_hour'].valid && this.formNewClient.valid
            : this.form.valid && this.clientSelect !== null && this.deliverDate !== null;
  }

  changeNewClient(event){
    const value: boolean = event.target.checked;
    if(value){
      this.form.controls['client'].reset();
      this.form.controls['telephone'].reset();
      this.form.controls['telephone'].disable();
      this.clientSelect = null;
    }
  }

  generateJsonData(){
    return {
      telephone: this.form.controls['telephone'].value ?? '',
      description: this.form.controls['description'].value ?? '',
      notify: 0,
      creation_date: this.today.toISOString(),
      deliver_date: this.deliverDate.toISOString(),
      advance_payment: Number(this.form.controls['advance_payment'].value) ?? 0,
      idUser: this.utils.getUserInfo()?.id,
      idClient: Number(this.clientSelect.id) ?? null
    }
  }

}
