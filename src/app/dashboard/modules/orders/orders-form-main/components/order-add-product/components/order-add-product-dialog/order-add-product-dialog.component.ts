import { NgClass, NgStyle } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { CrudFilterInputComponent } from '../../../../../../../../shared/components/crud-main/components/filters/crud-filter-input/crud-filter-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogData } from '../../../../../../../../shared/interfaces/dialog-data';
import { AuthService } from '../../../../../../../../shared/services/auth.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CrudService } from '../../../../../../../../shared/services/crud.service';
import { UtilsService } from '../../../../../../../../shared/services/utils/utils.service';
import { REGUEX_INT } from '../../../../../../../../shared/constants/reguex';
import { URL_SERVICES } from '../../../../../../../../shared/constants/endpoints';
import { tap, catchError, throwError, finalize } from 'rxjs';
import { ResponseApi, PaginatedResponse } from '../../../../../../../../shared/interfaces/response-api';

@Component({
  selector: 'app-order-add-product-dialog',
  standalone: true,
  imports: [
    CrudFilterInputComponent, MatIconModule, MatTableModule, MatPaginatorModule, MatTooltipModule, 
    NgClass, NgStyle, MatSortModule, MatButtonModule
  ],
  templateUrl: './order-add-product-dialog.component.html',
  styleUrl: './order-add-product-dialog.component.scss'
})
export class OrderAddProductDialogComponent {

  load: boolean = false;
  form: FormGroup;
  
  displayedColumns: string[] = ['id', 'name'];
  pageSize: number = 10;
  currentPage: number = 0
  totalItems: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  position: TooltipPosition = 'above';
  filters: any = {};
  dataList: any[] = [];
  

  constructor(@Inject(DIALOG_DATA) public data: DialogData,
  public dialogRef: DialogRef, public authService: AuthService,
  private crud: CrudService, private utils: UtilsService){
    this.form = new FormGroup({
      id: new FormControl('', Validators.pattern(REGUEX_INT)),
      name: new FormControl('', []),
    });
    this.crud.baseUrl = URL_SERVICES;
  }

  ngOnInit(): void {
  this.loadData();
  }

  loadData() {
    this.load = true;
    this.dataList = [];
    this.utils.getPageInit({
      url: 'products',
      request: {
        page: this.currentPage,
        size: 10,
        orderBy: 'name',
        sort: 'asc',
        filters: this.filters || {}
      }
    })
    .pipe(
      tap((res: ResponseApi<PaginatedResponse>) => {
        const { content, total, pageSize, currentPage } = res.data;
    
        if (content.length === 0) {
          this.utils.error('No se encontraron registros');
        }
        // Asignar los datos al dataSource y actualizar paginación
        this.dataList = content;
        this.totalItems = total;
        this.pageSize = pageSize;
        this.currentPage = currentPage;
    
        // Sincronizar la paginación
        if (this.paginator) {
          this.paginator.pageIndex = currentPage;
          this.paginator.length = total;
        }
      }),
      catchError((error) => {
        this.utils.error('Ocurrió un error en el servidor');
        return throwError(error); // Propagar el error si es necesario
      }),
      finalize(() => {
        this.load = false;
      })
    )
    .subscribe();
    
  }

  enter(event: any){
    
    if(this.form.controls['id'].value !== ''){
      this.filters.id = this.form.controls['id'].value;
    }else{
      this.filters.id = null;
    }

    if(this.form.controls['name'].value !== ''){
      this.filters.name = this.form.controls['name'].value;
    }else{
      this.filters.name = null;
    }
    this.loadData()

  }

  changesName(event: any){
    if(event && event !== ''){
      this.form.controls['id'].disable();
    }
  }

  changesId(event: any){
    if(event && event !== ''){
      this.form.controls['name'].disable();
    }
  }

  clear(event: any){
    this.form.controls['id'].setValue('');
    this.form.controls['name'].setValue('');
    this.form.controls['id'].enable();
    this.form.controls['name'].enable();
    this.filters = {};
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex; // `pageIndex` ahora es 0-based, directamente se utiliza
    this.pageSize = event.pageSize;
    this.loadData(); 
  }

  get themeDark(): boolean{
    const storedTheme = localStorage.getItem('theme') === 'dark';
   return storedTheme;
  }

  close(){
    this.dialogRef.close();
  }

  selectItem(item: any){
    this.dialogRef?.close(item);
  }
}
