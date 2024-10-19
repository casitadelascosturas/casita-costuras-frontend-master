import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { CrudConfig, FormField } from '../../../../../interfaces/crud/crud';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CrudBaseForm } from '../../../../../classes/crud/crud-base-form';
import { HeaderComponent } from "../../../../header/header.component";
import { InputComponent } from "../../../../input/input.component";
import { ToggleComponent } from "../../../../toggle/toggle.component";
import { ModeCrud } from '../../../../../enums/mode-crud.enum';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectComponent } from "../../../../select/select.component";
import { PossibleValueSelect, PossibleValueSelectList } from '../../../../../interfaces/components/select';
import { Location } from '@angular/common';
import { ResponseApi } from '../../../../../interfaces/response-api';
import { InputFileUploadComponent } from '../../../../input-file-upload/input-file-upload.component';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [HeaderComponent, InputComponent, ToggleComponent, MatIconModule, SelectComponent, InputFileUploadComponent],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss'
})
export default class CrudFormComponent extends CrudBaseForm implements OnInit{

  get showTitleForm(): string {
    return (this.mode === ModeCrud.CREATE) ? 'Nuevo Registro' : 'Actualizar Registro'; 
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
    private location: Location) {
    super(breakpoint,routeActivated,router, utils);
    }

  ngOnInit(): void {}

  getOptionsForColumn(fieldName: string): PossibleValueSelect[] {
    const selectList = this.possibleValueSelectList.find(list => list.name === fieldName);
    return selectList ? selectList.options : [];
  }

  save(){
    this.load = true;
    const record = this.getRecord();
    this.utils.create(this.config.service, record).subscribe({
      next: (response: ResponseApi<any>) => this.utils.responseAPI(response),
      error: (error: any) => {
        this.utils.error('Error', 'Ocurrio un error en el servidor!');
      },
      complete: () => {
        this.load = false;
        this.back();
      }
    });
  }

  update(){
    this.load = true;
    const record = this.getRecordUpdate();
    this.utils.update(this.config.service,this.id, record).subscribe({
      next: (response: ResponseApi<any>) => this.utils.responseAPI(response),
      error: (error: any) => {
        this.utils.error('Error', 'Ocurrio un error en el servidor!');
      },
      complete: () => {
        this.load = false;
        this.back();
      }
    });
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
                value = value; // Convertir a número (suponiendo que el valor del select es un ID)
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
              value = value;
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
}
