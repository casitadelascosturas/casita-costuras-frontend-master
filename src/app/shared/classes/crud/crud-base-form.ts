
import { BreakpointObserver } from "@angular/cdk/layout";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { UtilsService } from "../../services/utils/utils.service";
import { Injectable, Input } from "@angular/core";
import { ModeCrud } from "../../enums/mode-crud.enum";
import { CrudConfig, DefaultPropertyDisplay, FormField } from "../../interfaces/crud/crud";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { PossibleValueSelect, PossibleValueSelectList } from "../../interfaces/components/select";
import { ResponseApi } from "../../interfaces/response-api";

@Injectable({
    providedIn: 'root'
  })
export class CrudBaseForm {
    mode: string = '';
    id: number = null;
    record: any = null;
    load: boolean = true;
    @Input() configName: string;
    serviceCrud: string = '';
    config: CrudConfig;
    title: string = '';
    description: string = '';
    titleForm: string = '';
    icon: string = '';
    possibleValueSelectList: PossibleValueSelectList[] = [];
    displayDefaultProperties: DefaultPropertyDisplay[] = [];
    form: FormGroup;
    selectedFile: File = null;
    fileComplete: boolean = true;
    imageUrl: string = '';

  
    constructor(
      private breakpointObserver: BreakpointObserver,
      private routeActivate: ActivatedRoute,
      private routerr: Router,
      private util: UtilsService){
        this.mode = this.routeActivate.snapshot.data['mode'];
        this.configName = this.routeActivate.snapshot.data['configName'];
        this.serviceCrud = this.routeActivate.snapshot.data['serviceCrud'];
        this.loadConfig();
      }
  
      loadConfig() {
        this.util.loadConfig(this.configName).subscribe({
          next: (config: CrudConfig) => {
            this.config = config;
            this.title = this.config.name;
            this.description = this.config.description;
            this.icon = this.config.icon;

            if(this.mode !== ModeCrud.CREATE){
              this.id = Number(this.routeActivate.snapshot.paramMap.get('id'));
              this.util.getRegister(this.config.service ,this.id).subscribe({
                next: (response: ResponseApi<any>) => {
                  if(response.code !== 200){
                    this.util.error(response.message , `Error ${response.code}`);
                  }
                  this.record = response.data;
                  this.initializeForm(config.form.fields); 
                  this.prepareDefaultProperties();
                },
                error: (error: any) => {
                  this.util.error('Ocurrio un error en el servidor!');
                },
                complete: () => {
                  this.load = false;
                }
              });
            }else{
              this.initializeForm(config.form.fields); 
            }
          },
          error: (error) => {
            this.util.error('Error del servidor!', 'Ocurrio un error en el servidor')
          },
        });
      }

      initializeForm(fields: FormField[]): void {
        const formControls = {};
        let countFiles: number = 0;
        fields.forEach(field => {
          const validators = [];
      
          if(field.resolver && field.resolver !== ''){
            const possibleValues = this.routeActivate.snapshot.data[field.resolver] as PossibleValueSelect ?? [];
            const item: PossibleValueSelectList = {
              name: field.name,
              options: possibleValues as PossibleValueSelect[] ?? []
            }
            this.possibleValueSelectList.push(item);
          }
    
          if (field.validators?.required && !(field.name === 'password' && this.mode === ModeCrud.UPDATE)) {
            validators.push(Validators.required);
          }
      
          if (field.validators?.minLength) {
            validators.push(Validators.minLength(field.validators.minLength));
          }
      
          if (field.validators?.maxLength) {
            validators.push(Validators.maxLength(field.validators.maxLength));
          }
      
          if (field.validators?.min) {
            validators.push(Validators.min(field.validators.min));
          }
      
          if (field.validators?.max) {
            validators.push(Validators.max(field.validators.max));
          }
    
          if (field.type === 'text' && field.validators?.regex) {
            const regexPattern = new RegExp(field.validators.regex);
            validators.push(Validators.pattern(regexPattern));
          }
      
          if(field.type === 'file'){
            countFiles++;
            if(this.mode === ModeCrud.UPDATE){
              this.imageUrl = this.record[field.name]; 
              this.fileComplete = true;
            }else{
              this.imageUrl = '';
              this.fileComplete = false;
            } 
          }
          
          if(field.type !== 'file'){
            formControls[field.name] = new FormControl(this.getValueForm(field.name), validators);
          }    
        });     

        if(countFiles === 0 ){
          this.fileComplete = true;
        }else if(countFiles > 0 ){
          if(this.mode === ModeCrud.UPDATE && this.imageUrl !== ''){
            this.fileComplete = true;
          }else{
            this.fileComplete = false;
          }
        }
        this.form = new FormGroup(formControls);
        this.load = false;
        this.util.hideLoader();
      }

      getValueForm(fieldName: string ): string{
        return this.mode === ModeCrud.UPDATE ? this.record[fieldName] : ''
      }

      prepareDefaultProperties() {
        const defaultProperties = this.config.form.defaultProperties;
      
        if (defaultProperties && this.record) {
          this.displayDefaultProperties = defaultProperties.map(prop => {
            let value = this.record[prop.field];
      
            if (value === undefined || value === null) {
              return null;
            }
            switch (prop.type) {
              case 'boolean':
                return {
                  label: prop.label,
                  value: value,
                  icon: value ? 'check_circle' : 'cancel',
                  type: 'boolean'
                } as DefaultPropertyDisplay;
              case 'date':
                return {
                  label: prop.label,
                  value: new Date(value).toLocaleDateString(),
                  icon: prop.icon,
                  type: 'date'
                } as DefaultPropertyDisplay;
              case 'text':
              default:
                return {
                  label: prop.label,
                  value: String(value),
                  icon: prop.icon,
                  type: 'text'
                } as DefaultPropertyDisplay;
            }
          }).filter(prop => prop !== null);
        }
      }

      getDialogWidth(): string {
        if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
          return '40%';
        } else if (this.breakpointObserver.isMatched('(min-width: 768px)')) {
          return '70%';
        } else if (this.breakpointObserver.isMatched('(min-width: 640px)')) {
          return '60%';
        } else {
          return '90%';
        }
      }
}
