import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CrudConfig, TableAction, TableColumn, TableConfig } from '../../../../../interfaces/crud/crud';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginatedResponse, ResponseApi } from '../../../../../interfaces/response-api';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { InputComponent } from '../../../../input/input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REGUEX_INT } from '../../../../../constants/reguex';
import { SearchInputTextComponent } from '../../../../search-input-text/search-input-text.component';
import { CrudFilterInputComponent } from '../../filters/crud-filter-input/crud-filter-input.component';
import { CrudFilterDialogComponent } from '../../filters/crud-filter-dialog/crud-filter-dialog.component';
import { CrudFilterInputDateComponent } from '../../filters/crud-filter-input-date/crud-filter-input-date.component';
import { catchError, finalize, tap, throwError, firstValueFrom } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import CrudBase from '../../../../../classes/crud/crud-base';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuService } from '../../../../../services/menu.service';
import { MenuItem, SubMenuItem } from '../../../../../interfaces/menu.model';
import { ModeCrud } from '../../../../../enums/mode-crud.enum';
import { HeaderComponent } from '../../../../header/header.component';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
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
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatTooltipModule, HeaderComponent,
    MatButtonModule, MatSortModule, CrudFilterInputComponent, CrudFilterInputDateComponent
  ],
  providers:[
    DatePipe,
    provideMomentDateAdapter(MY_FORMATS)
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class CrudComponent extends CrudBase implements OnInit, AfterViewInit {
  
  @Input() configName: string;
  config: CrudConfig;
  dataSource = new MatTableDataSource<any>([]);
  fakeDataSource = new MatTableDataSource<any>([]);
  filters: any = {};
  load: boolean = false;
  pageSize: number = 10;
  currentPage: number = 0
  totalItems: number = 0;
  serviceCrud: string = '';
  orderBy: string = 'desc';
  sort: string = 'id';
  displayedColumns: string[] = []; // Aquí almacenamos las columnas a mostrar
  filterForm: FormGroup;
  groups: Array<MenuItem> = [];
  develop: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sortHeader: MatSort; 
  position: TooltipPosition = 'above';

  constructor(
    private datePipe: DatePipe,
    public dialog: Dialog,
    private routeActivated: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
    private breakpoint: BreakpointObserver,
    private menuService: MenuService) {
    super(breakpoint,routeActivated,router, utils);
    }

    async ngOnInit(): Promise<void> {
    this.configName = this.routeActivated.snapshot.data['configName'];
    this.serviceCrud = this.routeActivated.snapshot.data['serviceCrud'];
    this.groups = this.menuService.pagesMenu;
    this.loadConfig(); // Continuar con la configuración una vez que el menú esté disponible
    this.initializeFakeDataSource(); 
    this.utils.hideLoader();
  }

  ngAfterViewInit() {
    // Asigna el sort al datasource después de que la vista esté inicializada
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortHeader;
  }

  loadConfig() {
    this.utils.loadConfig(this.configName).subscribe({
      next: (config: CrudConfig) => {
        console.log('config: ', config);
        this.develop = config.develop ?? false;
        this.config = config;
        this.pageSize = this.config.table.pagination[0];
        this.sort = this.config.sort;
        this.orderBy = this.config.orderBy;
        this.displayedColumns = this.config.table.columns.map(c => c.name).concat('actions');
        const filterField = config.table.filter.field;
        this.filterForm = new FormGroup({
          [filterField]: new FormControl(''),
        });
        console.log(this.getPermissionAction('read'));
        if(this.getPermissionAction('read')){
          this.loadData();
        }else{
          this.utils.info('Permisos insuficientes!',`Módulo de ${this.config.name}`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.utils.error('Error del servidor!', 'Ocurrio un error en el servidor')
      },
    });
  }
  
  loadData() {
    this.load = true;
    this.utils.getPageInit({
      url: this.config.service,
      request: {
        page: this.currentPage,
        size: this.pageSize,
        orderBy: this.orderBy,
        sort: this.sort as 'asc' | 'desc',
        filters: this.filters || {}
      }
    })
    .pipe(
      tap((res: ResponseApi<PaginatedResponse>) => {
        const { content, total, pageSize, currentPage } = res.data;
    
        if (content.length === 0) {
          this.utils.error('No se encontraron registros');
          return; // Termina el flujo si no hay registros
        }
    
        // Asignar los datos al dataSource y actualizar paginación
        this.dataSource.data = content;
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

  handleAction(action: TableAction, item: any) {

    if(action.value === 'delete'){
      this.delete(item.id)
    }else{
      this.navigateOtherAction(action.value, item.id);
    }
  }

  delete(id: number) {
    this.utils.confirm('Confirmación', null, null, `¿Estás seguro de que deseas eliminar el registro con ID: ${id}?`, 'question')
      .then(async (result) => {
        
        if (!result.isConfirmed) { return; }

        this.load = true;
        this.utils.delete(this.config.service, id).subscribe({
          next: (response: ResponseApi) => this.utils.responseAPI(response),
          error: () => {
            this.utils.error('Ocurrió un error al eliminar el registro. Inténtalo nuevamente.');
          },
          complete: () => {
            this.loadData();
            this.load = false;
          }
        });
      }).catch(() => {
        this.load = false;
      });
  }  

  navigateOtherAction(action: string, id: number){
    const url: string = this.router.url;
    this.router.navigate([`${url}/${action}/${id}`]);
  }

  newItem(){
    const url: string = this.router.url;
    this.router.navigate([`${url}/nuevo`]);
  }

  refreshData() {
    if (this.config.refresh) {
      this.loadData();
    }
  }

  getValueFromPath(item: any, path: string): any {
    // Divide el path por puntos para acceder a propiedades anidadas
    const properties = path.split('.');
    let value = item;

    for (const prop of properties) {
      value = value[prop];
      if (value === undefined || value === null) {
        return '--'; // Maneja el caso donde el valor es indefinido o nulo
      }
    }
    return value;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex; // `pageIndex` ahora es 0-based, directamente se utiliza
    this.pageSize = event.pageSize;
    this.loadData(); 
  }

  onSortChange(event: Sort) {
    this.orderBy = event.active; // Campo seleccionado
    // Alterna manualmente solo entre 'asc' y 'desc'
    this.sort = (this.sort === 'asc') ? 'desc' : 'asc';
    this.loadData();
  }

  applyFilters() {
    const filterValue = this.filters.value[this.config.table.filter.field];
  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (this.config.table.filter.isObject) {
        // Si es un objeto, busca en la ruta definida
        const path = this.config.table.filter.location;
        const value = this.getValueFromPath(data, path);
        return value ? value.toString().toLowerCase().includes(filter.toLowerCase()) : false;
      } else {
        // Si no es un objeto, busca directamente en el campo
        return data[this.config.table.filter.field].toString().toLowerCase().includes(filter.toLowerCase());
      }
    };
  
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplicar el filtro
  }

  async openDialogFilters(){
    try{
      const resolversData = this.routeActivated.snapshot.data;
      const filters: TableColumn[] = this.config.table.columns;
      const darkmode = localStorage.getItem('theme');
      const dialogRef = this.dialog.open(CrudFilterDialogComponent, {
        backdropClass: ['bg-black/60', 'dark:bg-white'],
        panelClass: (darkmode === 'dark') ?
                    ['bg-slate-900', 'rounded-lg', 'text-gray-500', 'p-4'] :
                    ['bg-white', 'rounded-lg', 'text-gray-300', 'p-4', 'border-b', 'border-slate-900'],
        width: this.getDialogWidth(),
        closeOnDestroy: true,
        data: {
          filtersList: filters,
          resolvers: resolversData
        },
        });
  
      const result = await firstValueFrom(dialogRef.closed);

      if(result){
        this.filters = result;
        this.loadData();
      }


    }catch (error: any) {
      this.utils.error('Error al filtrar!');
    }
  }

  getValueNumber(value: string): number{
    return Number(value);
  }

  getDynamicDate(key: string): Date {
    const today = new Date();

    if(key && key !== ''){
      switch (key) {
        case 'today':
          // Devuelve la fecha de hoy con hora 00:00:00
          return new Date(today.setHours(0, 0, 0, 0));
  
        case 'endMonth': {
          // Devuelve el último día del mes actual con hora 23:59:59
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          lastDayOfMonth.setHours(23, 59, 59, 999);
          return lastDayOfMonth;
        }
  
        case 'initMonth': {
          // Devuelve el primer día del mes actual con hora 00:00:00
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          firstDayOfMonth.setHours(0, 0, 0, 0);
          return firstDayOfMonth;
        }
  
        default: {
          // Devuelve una fecha específica pasada en formato 'yyyy-mm-dd'
          const specificDate = new Date(key);
          specificDate.setHours(0, 0, 0, 0);
          return specificDate;
        }
      }
    }

    return null;
  }

  clear(ev: boolean){
    if(ev){
      const filterField = this.config.table.filter.field;
      this.filters = {};
      this.filterForm.get(filterField).setValue('');
      this.loadData();
    }
  }

  changes(ev: string){
    const filterField = this.config.table.filter.field;
    this.filterForm.get(filterField).setValue(ev);
  }

  enter(ev: boolean){

    const filterField = this.config.table.filter.field;
    let filters = {};
    if(this.filterForm.get(filterField).value && this.filterForm.get(filterField).value !== ''){
      filters[filterField] = this.filterForm.get(filterField).value;
      this.filters = filters;
      this.loadData();
    }    

    if(this.filterForm.get(filterField).value === ''){
      this.clear(true);
    }
  }
  
  initializeFakeDataSource(): void {
    const placeholderData = Array(10).fill({}); // Creamos un array de 10 elementos vacíos
    this.fakeDataSource.data = placeholderData;
  }

  getPermissionAction(action: string): boolean {
    // console.log('this.menuService.pagesMenu: ', this.menuService.pagesMenu);
    // const groups: Array<MenuItem> = this.menuService.pagesMenu;
    
    if (!Object.values(ModeCrud).includes(action as ModeCrud)) {
      return true;
    }
  
    for (const group of this.groups) {
      for (const menu of group.items) {
        console.log('menu.route: ', menu.route);
        console.log('this.config.path: ', this.config.path);
        
        if (menu.route === this.config.path) {
          console.log('menu: ', menu);
          console.log('action: ', action);
          console.log('ModeCrud.READ: ', ModeCrud.READ);
          
          switch (action) {
            case ModeCrud.CREATE:
              return Boolean(menu.permissions.create);
            case ModeCrud.UPDATE:
              return Boolean(menu.permissions.update);
            case ModeCrud.DELETE:
              return Boolean(menu.permissions.delete);
            case ModeCrud.READ:
              console.log('menu.permissions.read: ', menu.permissions.read);
              return Boolean(menu.permissions.read);
            default:
              return false;
          }
        }
      }
    }
    return false;
  }
  
  
  formateCurrency(value: number): string {
    return this.utils.formateCurrency(value);
  }
}
