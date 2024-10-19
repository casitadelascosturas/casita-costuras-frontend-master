import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ServiceDetailMeasure } from '../../interfaces/service-detail-measure';
import { NgOptimizedImage } from '@angular/common';
import { Measure } from '../../interfaces/measure';

@Component({
  selector: 'app-services-details',
  standalone: true,
  imports: [MatTableModule, MatIconModule, NgOptimizedImage],
  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent implements OnInit {

  @Input() details: ServiceDetailMeasure[];
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  displayedColumns: string[] = ['name', 'description', 'image', 'actions'];


  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  refreshTable() {
  }

  deleteDetail(detail: Measure){
    this.delete.emit(detail);
  } 

}
