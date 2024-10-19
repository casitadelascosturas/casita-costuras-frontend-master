import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PossibleValueSelect } from '../../interfaces/components/select';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../constants/endpoints';
import { ResponseApi } from '../../interfaces/response-api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule
  ],
  templateUrl: './input-autocomplete.component.html',
  styleUrl: './input-autocomplete.component.scss'
})
export class InputAutocompleteComponent implements OnInit {

  @Input() iconLeft: string;
  @Input() iconRight: string;
  @Input() icon: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() form: FormGroup;
  @Input() name: string;
  @Input() patternHint = '';
  @Input() required = false;
  @Input() load = false;
  @Input() helpMessage: string;
  @Input() min: number = null;
  @Input() max: number = null;
  @Input() minlength: number = 0;
  @Input() maxlength: number = 0;
  @Input() counter: boolean;
  @Input() service: string;
  @Input() itemSelect: PossibleValueSelect;
  @Input() options: PossibleValueSelect[] = [];
  @Output() changes = new EventEmitter<PossibleValueSelect>();
  
  filteredOptions$: Observable<PossibleValueSelect[]>;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit(): void {
    this.filteredOptions$ = this.form.get(this.name).valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filterOptions(value))
    );
  }

  displayFn(option: PossibleValueSelect): string | undefined {
    return option ? option.label : undefined;
  }

  getOption(value: any): PossibleValueSelect{
    return (this.options && this.options.length > 0) ? this.options.find((option: PossibleValueSelect) => option.value === value) : undefined;
  }

  private _filterOptions(value: string): Observable<PossibleValueSelect[]> {
    if (typeof value !== 'string') {
      return of([]);  // Si el valor no es una cadena, no filtrar
    }
  
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      return of([]);  // No mostrar opciones si no hay entrada
    }
  
    let body = {};
    body[this.name] = filterValue;
  
    if (this.service && this.service !== '') {
      return this.http.post<ResponseApi>(`${API_BASE}${this.service}`, body).pipe(
        map((response: ResponseApi<PossibleValueSelect[]>) => Array.isArray(response.data) ? response.data : [])
      );
    } else {
      const filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(filterValue));
      return of(filteredOptions);
    }
  }

  changeOptionsSelect(option: MatAutocompleteSelectedEvent){
    this.itemSelect = option.option.value;
    this.changes.emit(option.option.value);
  }

  getFormControl(): FormControl {
    const control = this.form.get(this.name) as FormControl;
    if (control) {
      return control;
    } else {
      throw new Error(`No se encontró el control con el nombre '${this.name}' en el formulario.`);
    }
  }

  getValidatorRequired(): boolean {
    return this.getFormControl().hasValidator(Validators.required);
  }

  changeInput($event){
    const value = $event.target.value;
    if(value === ''){
      this.itemSelect = null;
    } else if(value !== this.itemSelect?.label){
      this.itemSelect = null;
    }
  }
}
