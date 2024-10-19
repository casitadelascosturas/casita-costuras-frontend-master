import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ERRORS_FORMCONTROLS } from '../../../../../constants/errors-input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-crud-filter-input',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MatIconModule, MatTooltipModule, 
    MatButtonModule, CrudFilterInputComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './crud-filter-input.component.html',
  styleUrl: './crud-filter-input.component.scss'
})
export class CrudFilterInputComponent implements OnInit, AfterViewInit {

  @Input() options: any = {};
  @Input() iconLeft: string;
  @Input() iconRight: string;
  @Input() icon: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() form: FormGroup;
  @Input() name: string;
  @Input() type: string;
  @Input() patternHint = '';
  @Input() required = false;
  @Input() load = false;
  @Input() helpMessage: string;
  @Input() min: number = null;
  @Input() max: number = null;
  @Input() minlength: number = 0;
  @Input() maxlength: number = 0;
  @Input() counter: boolean;
  @Output() changes = new EventEmitter<string>();
  @Output() clear = new EventEmitter<boolean>();
  @Output() enter = new EventEmitter<boolean>();
  @Output() viewPassword = new EventEmitter<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    this.changes.emit(newValue);
  }

  getFormControl(): FormControl {
    const control = this.form.get(this.name) as FormControl;
    if (control) {
      return control;
    } else {
      throw new Error(`No se encontró el control con el nombre '${this.name}' en el formulario.`);
    }
  }

  isControlDisabled(): boolean {
    const control = this.getFormControl();
    return control.disabled;
  }

  getErrors() {
    const control = this.getFormControl();
    if (control) {
      const errors = control.errors;
      if (errors) {
        const errorKeys = Object.keys(errors);
        const errorLabels = [];
        errorKeys.forEach(key => {
          const error = ERRORS_FORMCONTROLS.find(item => item.key === key);

          if (error) {
            errorLabels.push(error.label);
          }
        });
        return errorLabels;
      }
    }
    return null;
  }

  getMaxLength(): number {
    const validator = this.form[this.name].validator({} as FormControl);
    if (validator) {
      const maxLengthValidator = validator?.maxLength;
      if (maxLengthValidator) {
        return maxLengthValidator.requiredLength;
      }
      return null;
    }
    return null;
  }

  getValidatorRequired(): boolean{
    return this.getFormControl().hasValidator(Validators.required);
  }

  viewPass(){
    this.viewPassword.emit(true);
  }

  onKeydownInput(event: KeyboardEvent) {

    if (event.key === 'Enter') {
      this.emitEnterPress(); 
    }
    if (event.key === 'Escape') {
      this.clearInput();
    }
  }
  
  clearInput() {
    this.getFormControl().reset();
    this.emitClear();
  }
  
  emitEnterPress() {
    this.enter.emit(true);
    this.changes.emit(this.getFormControl().value);
  }
  
  emitClear() {
    this.clear.emit(true);
  }
  
}
