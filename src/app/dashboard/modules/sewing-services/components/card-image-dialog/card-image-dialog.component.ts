import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Measure } from '../../interfaces/measure';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-card-image-dialog',
  standalone: true,
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './card-image-dialog.component.html',
  styleUrl: './card-image-dialog.component.scss',
  animations: [
    trigger('imageAnimation', [
      state('show-image', style({ opacity: 1 })),
      state('hide-image', style({ opacity: 0 })),
      transition('show-image <=> hide-image', animate('200ms ease-in-out'))
    ])
  ]
  
})
export class CardImageDialogComponent implements OnInit, AfterViewInit {
  @Input() measure: Measure;
  @Input() actionsProduct: any[] = [];
  @Input() load: boolean = false;
  @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('image', { static: true }) image: ElementRef;

  imageCtrl: string = 'hide-image';
  viewImage: boolean = false;

  constructor() {}

  ngOnInit() {
    this.image.nativeElement.onload = () => {
      this.imageCtrl = 'show-image';
      this.viewImage = true;
    };
  }

  ngAfterViewInit() {
    if (this.image) {
      this.image.nativeElement.onload = () => {
        this.imageCtrl = 'show-image';
        this.viewImage = true;
      };
    }
  }

  loadImageCard(event: Event) {
    this.imageCtrl = 'show-image';
    this.viewImage = true;
  }

  selectMeasure(measure: Measure) {
    this.actionClick.emit(measure);
  }

  get themeDark() {
    return localStorage.getItem('theme') === 'dark';
  }
}
