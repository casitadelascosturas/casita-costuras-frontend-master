import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { NgClass, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-input-file-upload',
  standalone: true,
  imports: [DragAndDropDirective, NgClass, NgStyle, MatIconModule, MatRippleModule],
  templateUrl: './input-file-upload.component.html',
  styleUrl: './input-file-upload.component.scss'
})
export class InputFileUploadComponent implements OnInit{
  @Input() file: File = null;
  @Input() Listfile: FileList;
  @Input() load: boolean = false;
  @Input() percentage: number = 0;
  @Input() multiple: boolean = false;
  @Input() imageUrl: string = ''; 
  @Output() deleteOneFile: EventEmitter<boolean> = new EventEmitter();
  @Output() drop: EventEmitter<File> = new EventEmitter();
  @Output() deleteAllFiles: EventEmitter<boolean> = new EventEmitter(); 

  thisOverElement = false;
  loadImgTemp = false;
  srcPreviewImg: string = '';
  

  ngOnInit() {
    if (this.imageUrl) {
      this.srcPreviewImg = this.imageUrl;
      this.loadImgTemp = true;
    }
  }

  mouseOver($event) {
    this.thisOverElement = $event;
  }

  dropFile($event) {
    this.file = $event;
    console.log('Se actualizó el archivo');
    this.drop.emit(this.file);
  }

  /** Obtener imagen en Base 64 para vista previa */
  urlLocalImage($event) {
    if ($event !== '') {
      this.loadImgTemp = true;
      this.srcPreviewImg = $event;
    } else {
      console.log('No se pudo obtener la data de la imagen');
    }
  }

  clearDragAndDrop() {
    this.deleteOneFile.emit(true);
    this.file = null;
    this.loadImgTemp = false;
    this.thisOverElement = false;
    this.srcPreviewImg = '';
  }

  changeInputFile($event) {
    if (!this.multiple) {
      this.file = $event.target.files[0];
      this.drop.emit(this.file);
      const reader = new FileReader();
      reader.onload = () => {
        this.srcPreviewImg = reader.result as string;
        this.loadImgTemp = true;
      };
      reader.readAsDataURL(this.file);
    } else {
      this.Listfile = $event.target.files;
    }
  }
}
