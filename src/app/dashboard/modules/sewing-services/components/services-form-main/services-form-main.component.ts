import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location, NgClass } from '@angular/common';
import { CrudBaseForm } from '../../../../../shared/classes/crud/crud-base-form';
import { ModeCrud } from '../../../../../shared/enums/mode-crud.enum';
import { PossibleValueSelect } from '../../../../../shared/interfaces/components/select';
import { ResponseApi } from '../../../../../shared/interfaces/response-api';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { InputFileUploadComponent } from '../../../../../shared/components/input-file-upload/input-file-upload.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { ToggleComponent } from '../../../../../shared/components/toggle/toggle.component';
import { MatTableModule } from '@angular/material/table';
import { ServicesDetailsComponent } from '../../components/services-details/services-details.component'
import { ServiceDetailMeasure } from '../../interfaces/service-detail-measure';
import { ServicesDetailDialogComponent } from '../services-detail-dialog/services-detail-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Measure } from '../../interfaces/measure';
import { CrudBaseFormServices } from '../../../../../shared/classes/crud/crud-base-form-services';

@Component({
  selector: 'app-services-form-main',
  standalone: true,
  imports: [
    HeaderComponent, InputComponent, ToggleComponent, MatIconModule, SelectComponent, 
    InputFileUploadComponent, MatTableModule, NgClass, ServicesDetailsComponent
  ],
  templateUrl: './services-form-main.component.html',
  styleUrl: './services-form-main.component.scss'
})
export default class ServicesFormMainComponent extends CrudBaseFormServices implements OnInit {
  
  get showTitleForm(): string {
    return (this.mode === ModeCrud.CREATE) ? 'Nuevo Servicio' : 'Actualizar Servicio'; 
  }

  get modeCreate(): boolean{
    return this.mode === ModeCrud.CREATE;
  }

  get modeUpdate(): boolean{
    return this.mode === ModeCrud.UPDATE;
  }

  constructor(
    private routeActivated: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
    private breakpoint: BreakpointObserver,
    public dialog: Dialog,
    private location: Location,
    private cdr: ChangeDetectorRef) {
    super(breakpoint,routeActivated,router, utils);
    }

    ngOnChanges(changes: SimpleChanges) {
      console.log('changes', changes)
      if (changes['record'] && changes['record'].currentValue) {
        this.details = [...this.record.details];
        this.cdr.detectChanges();
      }
    }

  ngOnInit(): void {
    // this.details = this.record?.details;
    this.cdr.detectChanges();
  }

  getOptionsForColumn(fieldName: string): PossibleValueSelect[] {
    const selectList = this.possibleValueSelectList.find(list => list.name === fieldName);
    return selectList ? selectList.options : [];
  }

  back(){
    this.location.back();
  }

  getRecord(): object {
    let record = {};
    const fields = this.config.form.fields;
  
    if (fields) {
      fields.forEach(field => {
        const control = this.form.get(field.name);
        if(field.type === 'file'){
          record[field.name] = this.selectedFile;
        }else if (control) {
          let value = control.value;
            switch (field.type) {
              case 'number':
                value = parseInt(value, 10); // Convertir a número entero
                break;
              case 'float':
                value = parseFloat(parseFloat(value).toFixed(2)); // Convertir a número flotante con 2 decimales
                break;
              case 'date':
                value = new Date(value).toISOString(); // Convertir a fecha en formato ISO
                break;
              case 'select':
                value = Number(value); // Convertir a número (suponiendo que el valor del select es un ID)
                break;
              case 'boolean':
                value = Boolean(value); // Convertir a número (suponiendo que el valor del select es un ID)
                break;
              case 'text':
              case 'password':
              default:
                value = String(value); // Convertir a string
                break;
            }
            record[field.name] = value;
        }
      });
    }
  
    const defaultProperties = this.config.form.defaultProperties;
    if (defaultProperties && defaultProperties.length > 0) {
      defaultProperties.forEach(defaultProp => {
        switch (defaultProp.type) {
          case 'boolean':
            record[defaultProp.field] = Boolean(defaultProp.value);
            break;
          case 'number':
            record[defaultProp.field] = Number(defaultProp.value);
            break;
          case 'text':
          default:
            record[defaultProp.field] = String(defaultProp.value);
            break;
        }
      });
    }
    return record;
  }

  getRecordUpdate(){
    const fields = this.config.form.fields;
    if (fields.length > 0) {
      fields.forEach(field => {
        const control = this.form.get(field.name);
        if(field.type === 'file'){
          this.record[field.name] = this.selectedFile;
        }else if (control) {
          let value = (control.value && control.value !== '') ? control.value : '';
          switch (field.type) {
            case 'number':
              value = parseInt(value, 10);
              break;
            case 'float':
              value = parseFloat(parseFloat(value).toFixed(2));
              break;
            case 'date':
              value = new Date(value).toISOString();
              break;
            case 'select':
              value = Number(value);
              break;
            case 'boolean':
              value = Boolean(value);
              break;
            case 'text':
            case 'password':
            default:
              value = (value && value !== '')? String(value) : null;
              break;
          }
  
          this.record[field.name] = value;
        }
      });
    }
    return this.record;
  }
  
  onFileDropped(file: File) {
    this.selectedFile = file;
    this.fileComplete = true;
  }

  onFileDeleted() {
    this.selectedFile = null;
    this.fileComplete = false;
  }

  // FUNCIONALIDAD PARA AGREGAR MÁS DETALLES O MEDIDAS AL SERVICIO.

  async addServiceDetail() {
    try{
      const darkmode = localStorage.getItem('theme');
      const dialogRef = this.dialog.open(ServicesDetailDialogComponent, {
        backdropClass: ['bg-black/60', 'dark:bg-white'],
        panelClass: (darkmode === 'dark') ?
                    ['bg-slate-900', 'rounded-lg', 'text-gray-500', 'p-4', 'border-gray-500'] :
                    ['bg-white', 'rounded-lg', 'text-gray-300', 'p-4', 'border-b', 'border-gray-300'],
        width: this.getDialogWidth(),
        closeOnDestroy: true,
        data: {}
        });
  
      const result = await firstValueFrom(dialogRef.closed);
      if(result){
        const exists = this.details.some(detail => detail.id === (result as Measure).id);
        if (!exists) {
          this.details.push(result as Measure);
          this.details = [...this.details]; // Reasignar el array completo para forzar la detección de cambios
          this.utils.success('Detalle agregado!');
        } else {
          this.utils.info('Este detalle ya fue agregado.');
        }
      }
    }catch (error: any) {
      this.utils.error('Error al obtener detalle!');
    }
  }

  deleteServiceDetail(measure: Measure){
    const index = this.details.findIndex(item => item.id === measure.id);
    if (index !== -1) {
      this.details.splice(index, 1);
      this.details = [...this.details]; // Reasignar el array completo para forzar la detección de cambios
      this.utils.success('Detalle eliminado!');
    }
  }

  save(){
    let record = {
      id: null,
      name: this.form.controls['name'].value,
      image: '',
      cost: this.form.controls['cost'].value,
      cost_material: this.form.controls['cost_material'].value,
      init_price: this.form.controls['init_price'].value,
      end_price: this.form.controls['end_price'].value,
      details: this.details.map(detail => ({ id: detail.id }))
    };
    console.log('this.mode: ', this.mode)

    if(this.mode !== ModeCrud.CREATE){
      record.id = this.id
      this.utils.update(this.config.service, this.id, record).subscribe({
        next: (response: ResponseApi<any>) => this.utils.responseAPI(response),
        error: (error: any) => this.utils.error('Error', 'Ocurrio un error en el servidor!'),
        complete: () => {
          this.load = false;
          this.back();
        }
      });
    }else{
      this.utils.create(this.config.service, record).subscribe({
        next: (response: ResponseApi<any>) => this.utils.responseAPI(response),
        error: (error: any) => this.utils.error('Error', 'Ocurrio un error en el servidor!'),
        complete: () => {
          this.load = false;
          this.back();
        }
      });
    }   

  }
}
