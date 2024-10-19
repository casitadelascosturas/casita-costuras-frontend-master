import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../../interfaces/dialog-data';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TableColumn, ValueConfig } from '../../../../../interfaces/crud/crud';
import { DialogDataCrud } from '../../../../../interfaces/crud/dialog-data-crud';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../input/input.component';
import { DatePickerComponent } from '../../../../date-picker/date-picker.component';
import { SelectComponent } from '../../../../select/select.component';
import { PossibleValueSelect, PossibleValueSelectList } from '../../../../../interfaces/components/select';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { InputAutocompleteComponent } from '../../../../input-autocomplete/input-autocomplete.component';

@Component({
  selector: 'app-crud-filter-dialog',
  standalone: true,
  imports: [CommonModule, InputComponent, FormsModule, ReactiveFormsModule, SelectComponent, DatePickerComponent, InputAutocompleteComponent],
  templateUrl: './crud-filter-dialog.component.html',
  styleUrl: './crud-filter-dialog.component.scss'
})
export class CrudFilterDialogComponent implements OnInit {

  load: boolean = false;
  filterForm: FormGroup;
  filterableColumns: TableColumn[] = [];
  possibleValueSelectList: PossibleValueSelectList[];
  
  constructor(@Inject(DIALOG_DATA) public data: DialogDataCrud, 
  private fb: FormBuilder, private utils: UtilsService,
  private route: ActivatedRoute, public dialogRef: DialogRef) {
    console.log('data: ', data);
  }

  ngOnInit(): void {
    
    const { filterableColumns, columnsWithResolvers, controls } = this.data.filtersList.reduce(
      (acc, column) => {
        
        if (column.filterable) {
          acc.filterableColumns.push(column);
          acc.controls[column.name] = new FormControl('');
  
          if (column.resolver && column.resolver !== '' || column.type === 'boolean' && !column.resolver) {
            acc.columnsWithResolvers.push(column);
          }
        }
        return acc;
      },
      { filterableColumns: [], columnsWithResolvers: [], controls: {} }
    );

    this.filterableColumns = filterableColumns;
    this.filterForm = this.fb.group(controls);
  
    if (columnsWithResolvers.length > 0) {
      this.getDataListSelect(columnsWithResolvers);
    }
  }

  ok() {
    const filters = {};
  
    this.filterableColumns.forEach(column => {
      let formControlValue = this.filterForm.get(column.name)?.value;

      if (formControlValue !== undefined && formControlValue !== null && formControlValue !== '') {
        switch (column.type) {
          case 'number':
            formControlValue = Number(formControlValue);
            break;
          case 'boolean':
            formControlValue = this.getValueBoolean(formControlValue);
            break;
          case 'date':
            const dateValue = new Date(formControlValue);
            if (!isNaN(dateValue.getTime())) {
              formControlValue = dateValue.toISOString();
            } else {
              this.utils.error('Error', `Fecha inválida para: ${column.label}`);
              formControlValue = '';
            }
            break;
          case 'text':
          default:
            formControlValue = String(formControlValue);
            break;
        }

        filters[column.name] = formControlValue;
      }
    });
    const hasFilters: boolean = Object.keys(filters).length > 0;
    this.dialogRef.close(hasFilters ? filters : null);
  
  }

  getValueBoolean(formControlValue: string): boolean | string{
    if(formControlValue === 'true'){
      return true;
    } else if(formControlValue === 'false'){
      return false;
    }else{
      return formControlValue
    }
  }


  getDataListSelect(columnsWithResolvers: TableColumn[]) {
    this.possibleValueSelectList = columnsWithResolvers.map((column: TableColumn) => {
  
      if (column.type === 'boolean') {
        const values: ValueConfig[] = column.values;
        const optionsList: PossibleValueSelect[] = values.map((value: ValueConfig) => ({
          label: value.label,
          value: value.value
        }));
  
        return {
          name: column.name,
          options: optionsList
        };
  
      } else {
        const possibleValues = this.data.resolvers[column.resolver] || [];
  
        return {
          name: column.name,
          options: Array.isArray(possibleValues) ? possibleValues : []
        };
      }
  
    });
  }
  

  getOptionsForColumn(columnName: string): PossibleValueSelect[] {
    const selectList = this.possibleValueSelectList.find(list => list.name === columnName);
    return selectList ? selectList.options : [];
  }

  
  closeDialog() {
    this.dialogRef.close();
  }

  getDynamicDate(key: string): Date {
    const today = new Date();

    switch (key) {
      case 'today':
        return new Date(today.setHours(0, 0, 0, 0));

      case 'endMonth': {
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        return lastDayOfMonth;
      }

      case 'initMonth': {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        return firstDayOfMonth;
      }
      case null:
      case undefined:
      case '': {
        return null;
      }

      default: {
        const specificDate = new Date(key);

        if (isNaN(specificDate.getTime())) {
          this.utils.error("Fecha de filtro invalida!")
          return null;
        }

        specificDate.setHours(0, 0, 0, 0);
        return specificDate;
      }
    }

  }
}
