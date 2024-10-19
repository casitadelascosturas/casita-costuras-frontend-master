import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { ToggleComponent } from '../../../../shared/components/toggle/toggle.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { CrudBaseForm } from '../../../../shared/classes/crud/crud-base-form';
import { Location } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { OrderAddServiceComponent } from './components/order-add-service/order-add-service.component';
import { OrderAddProductComponent } from './components/order-add-product/order-add-product.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";
import {NgxMaterialTimepickerModule, NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { ServiceOrder } from './interfaces/sewing-service';
import { OrderAddGeneralInfoComponent } from './components/order-add-general-info/order-add-general-info.component';
import { ResponseApi } from '../../../../shared/interfaces/response-api';

@Component({
  selector: 'app-orders-form-main',
  standalone: true,
  imports: [HeaderComponent, InputComponent, ToggleComponent, MatIconModule, SelectComponent, MatButtonModule,
    MatTabsModule, OrderAddServiceComponent, OrderAddProductComponent, DatePickerComponent, NgxMaterialTimepickerModule,
    MatStepperModule, MatExpansionModule, OrderAddGeneralInfoComponent],
  templateUrl: './orders-form-main.component.html',
  styleUrl: './orders-form-main.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false, showError: true},
    },
  ],
})
export default class OrdersFormMainComponent extends CrudBaseForm implements OnInit, AfterViewInit {
  
  @ViewChild(OrderAddServiceComponent) orderAddServiceComponent: OrderAddServiceComponent;
  @ViewChild(OrderAddProductComponent) orderAddProductComponent: OrderAddProductComponent;
  @ViewChild(OrderAddGeneralInfoComponent) orderAddGeneralInfoComponent: OrderAddGeneralInfoComponent;
  @ViewChild(MatStepper) stepper: MatStepper;
  links = ['Servicios', 'Productos'];
  activeLink = this.links[0];
  formMain: FormGroup;

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  constructor(
    private routeActivated: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
    private breakpoint: BreakpointObserver,
    private location: Location,
    private cdr: ChangeDetectorRef ) {
    super(breakpoint,routeActivated,router, utils);
    this.formMain = new FormGroup({
      description: new FormControl(null, [
        Validators.minLength(1),
        Validators.maxLength(200)
      ]),
      deliverDate: new FormControl(null, [])
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();  // Asegura que Angular revise los cambios después de que los ViewChild estén inicializados
  }
  

  back(){
    this.location.back();
  }

  get themeDark(){
    return localStorage.getItem('theme') === 'dark';
  }

  onStepChange(event: StepperSelectionEvent): void {
    // if(event.previouslySelectedIndex === 2 && event.selectedIndex === 1){
    // }
  }

  validateNextStep(): boolean {
    const validateService: boolean = this.getServices();
    const validateProducts: boolean = this.getProducts();
    return validateService || validateProducts;
  }

  getProducts(): boolean{
    return this.orderAddProductComponent?.areAllFormsValid();
  }

  getServices(): boolean {
    return this.orderAddServiceComponent?.areAllFormsValid();
  }

  getGeneralInfo(): boolean{
    return this.orderAddGeneralInfoComponent.areAllFormsValid();
  }
 
  get totalServicesAndProducts(): string{
    return  (this.orderAddServiceComponent?.calculateTotalPrice() + this.orderAddProductComponent?.calculateTotalPrice()).toFixed(2) ?? '0.00';
  }

  nextStep(){
    if (this.validateNextStep()) {
      this.stepper.next();
    } else {
      this.utils.error('Todos los formularios deben estar completos para continuar');
    }
  }

  get CurrentStepIndex(): number {
    return this.stepper?.selectedIndex;
  }

  saveOrder(){
    
    this.load = true;
    this.cdr.detectChanges(); 
    if(this.load){
      const body = this.orderAddGeneralInfoComponent.generateJsonData() ?? {};
      const products =  this.orderAddProductComponent.generateProductsJson() ?? [];
      const services =  this.orderAddServiceComponent.generateServicesJson() ?? [];
      const order = {
        ...body,
        status: (services.length > 0) ? 'PENDING' : 'FINALIZED',
        total : Number(this.totalServicesAndProducts).toFixed(2),
        serviceOrders: services,
        productOrders: products
      };

      this.utils.create('orders', order).subscribe({
        next: (response: ResponseApi<any>) => this.utils.responseAPI(response),
        error: (error: any) => this.utils.error('Error en el servidor!'),
        complete: () => {
          this.load = false;
          this.cdr.detectChanges();
          this.router.navigate(['/dashboard/pedidos'])
        }
      });
    }
  }

}
