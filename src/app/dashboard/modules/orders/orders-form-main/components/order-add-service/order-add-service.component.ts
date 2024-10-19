import { Dialog } from '@angular/cdk/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { OrderAddServiceDialogComponent } from './components/order-add-service-dialog/order-add-service-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MeasureServiceOrder, ServiceOrder, SewingService } from '../../interfaces/sewing-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../../shared/services/utils/utils.service';
import { InputComponent } from "../../../../../../shared/components/input/input.component";
import { REGUEX_DECIMAL_INT } from '../../../../../../shared/constants/reguex';
import { NgOptimizedImage } from '@angular/common';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-order-add-service',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    InputComponent,
    NgOptimizedImage,
    MatTooltipModule
],
  templateUrl: './order-add-service.component.html',
  styleUrl: './order-add-service.component.scss'
})
export class OrderAddServiceComponent {
  
  @Input() load: boolean;
  accordion = viewChild.required(MatAccordion);
  servicesList: SewingService[] = []; // Lista de servicios seleccionados
  formsGroup: FormGroup[] = [];
  positionOption: TooltipPosition = 'above';
  
  constructor(
    public dialog: Dialog, 
    private bpo: BreakpointObserver,
    private utils: UtilsService){}

  async openDialog() {
    const darkmode = localStorage.getItem('theme');
    const dialogRef = this.dialog.open(OrderAddServiceDialogComponent, {
      backdropClass: ['bg-black/60', 'dark:bg-white'],
      panelClass: (darkmode === 'dark') ?
                  ['bg-slate-900', 'rounded-lg', 'text-gray-200', 'p-4'] :
                  ['bg-white', 'rounded-lg', 'text-gray-500', 'p-4', 'border-b', 'border-slate-900'],
      width: this.getDialogWidth(),
      closeOnDestroy: true,
      disableClose: true,  // Deshabilita el cierre con 'Esc' y al hacer clic fuera
      hasBackdrop: true,
      data: {},
      });

      await firstValueFrom(dialogRef.closed)
      .then((result: any) => {
        if(result){
          this.addServiceToList(result);
        }
      })
      .catch((error: any) => {
        console.log('err', error);
      });
  }

  addServiceToList(service: SewingService) {
      const exists = this.servicesList.some(existingService => existingService.id === service.id);
      if (exists) {
        this.utils.info('¡Servicio ya seleccionado!');
      } else {
        this.servicesList.unshift(service);
        const date = new Date();
        const serviceForm = new FormGroup({
          price_final: new FormControl('', 
            [ Validators.required, 
              Validators.pattern(REGUEX_DECIMAL_INT), 
              Validators.min(service.init_price),
              Validators.max(service.end_price)
            ]),
          task: new FormGroup({
            payment_employee: new FormControl(service.cost, Validators.required),
            idUser: new FormControl(null),
            id_user_create: new FormControl(Number(this.utils.getUserInfo()?.id)),
            status: new FormControl('PENDING'),
            create_day: new FormControl(date.toISOString()),
            init_day: new FormControl(null),
            end_day: new FormControl(null),
          }),
          details: new FormGroup({})
        });

        service.details.forEach(detail => {
          (serviceForm.get('details') as FormGroup).addControl(
            `detail_${detail.id}`, new FormControl('', Validators.required)
          );
        });

        // Añadir el formulario a la lista de formularios
        this.formsGroup.unshift(serviceForm);
      }
  }

  getDetailsFormGroup(serviceIndex: number): FormGroup {
    const serviceFormGroup = this.formsGroup[serviceIndex]; // Accedemos al FormGroup del servicio
    return serviceFormGroup.get('details') as FormGroup; // Retornamos el FormGroup de los detalles
  }

  generateServicesJson(): ServiceOrder[] {

    const allFormsValid: boolean = (this.formsGroup.length > 0) ? this.formsGroup?.every(form => form.valid) : false;

    if (!allFormsValid) {
      return [];
    }

    return this.servicesList.map((service, index) => {
      const formGroup = this.formsGroup[index];
      let task = formGroup.get('task')?.value ;
      task.payment_employee = Number(task.payment_employee).toFixed(2)
      const price_final = Number(formGroup.get('price_final')?.value).toFixed(2);

      const measuresServiceOrders: MeasureServiceOrder[] = service.details.map(detail => {
        return {
          name_measures: detail.name,
          value_measures: formGroup.get(`details.detail_${detail.id}`)?.value  + ' ' + this.getMeasure(detail.measure_value) || ''
        };
      });

      return {
        idService: service.id,
        price_final,
        task,
        measuresServiceOrders
      };
    });
  }

  getMeasure(value: string): string {
    switch (value) {
        case 'sn':
              return 'Si / No';
        case 'cm':
            return 'Centímetros (cm)';
        case 'in':
            return 'Pulgadas (in)';
        case 'yd':
            return 'Yardas (yd)';
        case 'vara':
            return 'Varas (vara)';
        case 'm':
            return 'Metro (m)';
        default:
            return 'Valor no encontrado';
    }
}

  formatCurrency(value): string{
    return 'Q ' +Number(value).toFixed(2);
  }

  delteItem(item: SewingService) {
    const index = this.servicesList.findIndex(service => service.id === item.id);
    
    if (index !== -1) {
      // Eliminar el servicio de la lista servicesList
      this.servicesList.splice(index, 1);
  
      // Eliminar el FormGroup correspondiente en formsGroup
      this.formsGroup.splice(index, 1);
  
      // Mensaje de éxito o cualquier lógica adicional que necesites
      this.utils.success('Servicio eliminado exitosamente');
    } else {
      // Manejo de error en caso de que el servicio no se encuentre
      this.utils.error('No se pudo eliminar el servicio. No se encontró en la lista.');
    }
  }

  areAllFormsValid(): boolean {
    return this.formsGroup.length > 0 && this.formsGroup.every(form => form.valid);
  }

  calculateTotalPrice(): number {
    return this.formsGroup.reduce((total, formGroup) => {
      const priceFinalValue = formGroup.get('price_final')?.value || 0;
      return total + parseFloat(priceFinalValue);
    }, 0); // Empezamos la suma desde 0
  }
  
  getDialogWidth(): string {
    if (this.bpo.isMatched('(min-width: 1024px)')) {
      return '50%';
    } else if (this.bpo.isMatched('(min-width: 768px)')) {
      return '70%';
    } else if (this.bpo.isMatched('(min-width: 640px)')) {
      return '60%';
    } else {
      return '90%';
    }
  }
}
