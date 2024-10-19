import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Dialog } from '@angular/cdk/dialog';
import { UtilsService } from '../../../../../../shared/services/utils/utils.service';
import { OrderAddProductDialogComponent } from './components/order-add-product-dialog/order-add-product-dialog.component';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REGUEX_DECIMAL_INT, REGUEX_INT } from '../../../../../../shared/constants/reguex';

@Component({
  selector: 'app-order-add-product',
  standalone: true,
  imports: [
    MatButtonModule, MatExpansionModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatDialogModule, InputComponent,
    NgOptimizedImage, MatTooltipModule, NgClass
  ],
  templateUrl: './order-add-product.component.html',
  styleUrl: './order-add-product.component.scss'
})
export class OrderAddProductComponent {

  @Input() load: boolean;
  productsList: any[] = [];
  positionOption: TooltipPosition = 'above';
  formsGroup: FormGroup[] = [];
  
  constructor(public dialog: Dialog, 
    private bpo: BreakpointObserver,
    private utils: UtilsService,){}

    async openDialog() {
      const darkmode = localStorage.getItem('theme');
      const dialogRef = this.dialog.open(OrderAddProductDialogComponent, {
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
            this.addProductToList(result);
          }
        })
        .catch((error: any) => {
          console.log('err', error);
        });
    }

    addProductToList(product: any){
      const exists = this.productsList.some(existingService => existingService.id === product.id);
      if (exists) {
        this.utils.info('¡Producto ya seleccionado!');
      }else{
        this.productsList.unshift(product);
        const serviceForm = new FormGroup({
          price_final: new FormControl('', 
            [ Validators.required, 
              Validators.pattern(REGUEX_DECIMAL_INT), 
              Validators.min(product.price_sale_min),
              Validators.max(product.price_sale_max)
            ]),
          quantity: new FormControl( 1, 
            [ Validators.required, 
              Validators.pattern(REGUEX_INT), 
              Validators.min(1),
              // Validators.max(product.end_price)
              // Validators.min(product.init_price),
              // Validators.max(product.end_price)
            ]),
          });

          this.formsGroup.unshift(serviceForm);
      }
    }

    generateProductsJson(): any[] {

      const allFormsValid: boolean = (this.formsGroup.length > 0) ? this.formsGroup?.every(form => form.valid) : false;
  
      if (!allFormsValid) {
        return [];
      }
  
      return this.productsList.map((product, index) => {
        const formGroup = this.formsGroup[index];
        const quantity = formGroup.get('quantity')?.value;
        const price_final = formGroup.get('price_final')?.value;
  
        return {
          idProduct: product.id,
          quantity: quantity,
          price_final: Number(price_final).toFixed(2)
        };
      });
    }

    delteItem(item: any) {
      const index = this.productsList.findIndex(service => service.id === item.id);
      
      if (index !== -1) {
        this.productsList.splice(index, 1);
        this.formsGroup.splice(index, 1);
    
        this.utils.success('Producto eliminado exitosamente');
      } else {
        this.utils.error('No se pudo eliminar el producto. No se encontró en la lista.');
      }
    }

    formatCurrency(value): string{
      return 'Q ' +Number(value).toFixed(2);
    }
    
    areAllFormsValid(): boolean {
      return this.formsGroup.length > 0 && this.formsGroup.every(form => form.valid);
    }

    calculateTotalPrice(): number {
      return this.formsGroup.reduce((total, formGroup) => {
        const priceFinalValue = parseFloat(formGroup.get('price_final')?.value) || 0;
        const quantityValue = parseInt(formGroup.get('quantity')?.value, 10) || 0;    
        const subtotal = (priceFinalValue > 0 && quantityValue > 0) ? priceFinalValue * quantityValue : 0;
    
        return total + subtotal;
      }, 0);
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

    get themeDark(): boolean{
      const storedTheme = localStorage.getItem('theme') === 'dark';
     return storedTheme;
    }
}
