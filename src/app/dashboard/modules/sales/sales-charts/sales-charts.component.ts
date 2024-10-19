import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../shared/services/utils/utils.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-charts',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './sales-charts.component.html',
  styleUrl: './sales-charts.component.scss'
})
export default class SalesChartsComponent implements OnInit {

  load: boolean = true;
  productData: any[] = [];
  serviceData: any[] = [];
  quarterData: any[] = [];
  dailySalesData: any[] = [];

  constructor(private utils: UtilsService){}


  ngOnInit(): void {
    this.getProductTop();
    this.getServicesTop();
    this.getQuarterlySales();
    this.getMonthlySales();
    this.utils.hideLoader();
  }

  getProductTop(){
    this.load = true;
    this.utils.getCharts('sales/top-products').subscribe({
      next: (response: ResponseApi) => {
        if (response.code === 200 && response.data) {
          this.productData = response.data.map(product => ({
            name: product.productName,
            value: parseInt(product.totalQuantity, 10)
          }));
        }
      },
      error: (error: any) => {
        this.utils.error('Error en el servidor!');
      },
      complete: () => {
        this.load = false;
      }
    });
  }
  
  getServicesTop(){
    this.load = true;
    this.utils.getCharts('sales/top-services').subscribe({
      next: (response: ResponseApi) => {
        if (response.code === 200 && response.data) {
          // Mapeo de los datos de servicios
          this.serviceData = response.data.map(service => ({
            name: service.serviceName,
            value: parseInt(service.totalServices, 10)
          }));
        }
      },
      error: (error: any) => {
        this.utils.error('Error en el servidor!');
      },
      complete: () => {
        this.load = false;
      }
    });
  }

  getQuarterlySales() {
    this.load = true;
    this.utils.getCharts('sales/quarterly-sales').subscribe({
      next: (response: ResponseApi) => {
        if (response.code === 200 && response.data) {
          // Transformación de los datos para formato de barras apiladas
          this.quarterData = response.data.map(quarter => ({
            name: quarter.quarter, // El nombre del trimestre
            series: quarter.months.map(month => ({
              name: month.month, // El nombre del mes
              value: parseInt(month.totalSales, 10) // La cantidad de ventas del mes
            }))
          }));
        }
      },
      error: (error: any) => {
        this.utils.error('Error en el servidor!');
      },
      complete: () => {
        this.load = false;
      }
    });
  }
  
  getMonthlySales() {
    this.load = true;
    this.utils.getCharts('sales/monthly-sales').subscribe({
      next: (response: ResponseApi) => {
        if (response.code === 200 && response.data) {
          // Ordenamos los días por fecha por si el backend los envía desordenados
          const sortedData = response.data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
          
          // Mapeamos los datos para que el gráfico de líneas los entienda
          this.dailySalesData = [
            {
              "name": "Ventas diarias", // Nombre de la serie
              "series": sortedData.map(day => ({
                "name": day.day, // Usamos el valor de fecha tal como está
                "value": parseInt(day.totalSales, 10) // Valor de ventas
              }))
            }
          ];
        }
      },
      error: (error: any) => {
        this.utils.error('Error en el servidor!');
      },
      complete: () => {
        this.load = false;
      }
    });
  }
  
  
}
