import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewChild } from '@angular/core';
import CrudBase from '../../../../shared/classes/crud/crud-base';
import { Dialog } from '@angular/cdk/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, catchError, throwError, finalize, firstValueFrom } from 'rxjs';
import { CrudFilterDialogComponent } from '../../../../shared/components/crud-main/components/filters/crud-filter-dialog/crud-filter-dialog.component';
import { ModeCrud } from '../../../../shared/enums/mode-crud.enum';
import { CrudConfig, TableAction, TableColumn } from '../../../../shared/interfaces/crud/crud';
import { MenuItem } from '../../../../shared/interfaces/menu.model';
import { ResponseApi, PaginatedResponse } from '../../../../shared/interfaces/response-api';
import { MenuService } from '../../../../shared/services/menu.service';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CrudFilterInputDateComponent } from '../../../../shared/components/crud-main/components/filters/crud-filter-input-date/crud-filter-input-date.component';
import { CrudFilterInputComponent } from '../../../../shared/components/crud-main/components/filters/crud-filter-input/crud-filter-input.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { MY_FORMATS } from '../../orders/orders-grid-main/orders-grid-main.component';
import TasksDialogAsignComponent from '../components/tasks-dialog-asign/tasks-dialog-asign.component';

@Component({
  selector: 'app-tasks-grid-main',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatTooltipModule, HeaderComponent,
    MatButtonModule, MatSortModule, CrudFilterInputComponent, CrudFilterInputDateComponent
  ],
  providers:[
    DatePipe,
    provideMomentDateAdapter(MY_FORMATS)
  ],
  templateUrl: './tasks-grid-main.component.html',
  styleUrl: './tasks-grid-main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class TasksGridMainComponent extends CrudBase implements OnInit, AfterViewInit {

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

  ngOnInit(): void {
    this.configName = this.routeActivated.snapshot.data['configName'];
    this.serviceCrud = this.routeActivated.snapshot.data['serviceCrud'];
    this.loadConfig();
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
        this.config = config;
        this.pageSize = this.config.table.pagination[0];
        this.sort = this.config.sort;
        this.orderBy = this.config.orderBy;
        this.displayedColumns = this.config.table.columns.map(c => c.name).concat('actions');
        const filterField = config.table.filter.field;
        this.filterForm = new FormGroup({
          [filterField]: new FormControl(''),
        });
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

  handleAction(statusValue: string, item: any) {
    console.log('userInfo: ', this.utils.getUserInfo());
    const today: Date = new Date();

    switch (statusValue) {
      case 'ASSIGN_USER': this.assignUser(item.user === 'No asignado' ? null : item.user, Number(item.id))
        break;
      case 'IN_PROCESS': this.changeStatusTask({ status: statusValue, init_day: today.toISOString() }, Number(item.id))
        break;
      case 'FINALIZED': this.changeStatusTask({ status: statusValue, end_day: today.toISOString() }, Number(item.id))
        break;
      default:
        break;
    }
  }

  // ACCIONES

  async changeStatusTask(body: any, idTask: number){
    this.utils.update('tasks', idTask , {...body}).subscribe({
      next: (response: ResponseApi) => this.utils.responseAPI(response),
      error: (error) => this.utils.error('Error en el servidor!'),
      complete: () => {
        this.load = false;
        this.loadData();
      }
    });
  }

  async assignUser(value: string, idTask: number) {
    try {
      const darkmode = localStorage.getItem('theme');
      const dialogRef = this.dialog.open(TasksDialogAsignComponent, {
        backdropClass: ['bg-black/60', 'dark:bg-white'],
        panelClass: (darkmode === 'dark') ?
                    ['bg-slate-900', 'rounded-lg', 'text-gray-500', 'p-4', 'border-gray-500'] :
                    ['bg-white', 'rounded-lg', 'text-gray-300', 'p-4', 'border-b', 'border-gray-300'],
        width: this.getDialogWidth(),
        closeOnDestroy: true,
        data: {
          user: value
        }
        });
  
      const result = await firstValueFrom(dialogRef.closed);
      if(result){
        this.load = true;
        this.utils.update('tasks', idTask , { userId: Number(result) })
        .subscribe({
          next: (response: ResponseApi) => this.utils.responseAPI(response),
          error: (error) => this.utils.error('Error en el servidor!'),
          complete: () => {
            this.load = false;
            this.loadData();
          }
        });
      }
    } catch (error: any) {
      this.utils.error('Error al obtener detalle!');
    }
  }
  // FIN DE ACCIONES

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
    const groups: Array<MenuItem> = this.menuService.pagesMenu;
    if (!Object.values(ModeCrud).includes(action as ModeCrud)) {
      return true;
    }
  
    for (const group of groups) {
      console.log('group: ', group)
      for (const menu of group?.items) {
        console.log('menu.route: ', menu.route);
        console.log('this.config.path: ', this.config.path);
        if (menu.route === this.config.path) {
          switch (action) {
            case ModeCrud.CREATE:
              return menu.permissions?.create || false;
            case ModeCrud.UPDATE:
              return menu.permissions?.update || false;
            case ModeCrud.DELETE:
              return menu.permissions?.delete || false;
            case ModeCrud.READ:
              return menu.permissions?.read || false;
            default:
              return false;
          }
        }
      }
    }
  
    // Si no se encuentra el menú, devuelve false
    return false;
  }
  
  formateCurrency(value: number): string {
    return this.utils.formateCurrency(value);
  }
}
