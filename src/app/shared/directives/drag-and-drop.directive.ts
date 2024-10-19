import { AfterViewChecked, Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true 
})
export class DragAndDropDirective {

  @Input() multiple: boolean = false;
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();//Mouse sobre zona drag and drop
  @Output() dropFile: EventEmitter<any> = new EventEmitter();//Se dejo caer un archivo
  @Output() mouserDragleave: EventEmitter<boolean> = new EventEmitter();//Se sale de zona drag and drop

  /*Si es un solo archivo*/
  @Input() file: File = null;
  @Input() loadFile: boolean = false;
  @Output() urlLocalImage: EventEmitter<string> = new EventEmitter();//URL local de imagen

  /*Si es para seleccionar de multiples archivos*/
  @Input() files: FileList;
  @Input() loadFiles: boolean = false;


  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseOver.emit( true );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseOver.emit( false );
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {

    event.preventDefault();
    event.stopPropagation();

    if(!this.multiple){
      this.file = event.dataTransfer.files[0];
      this.dropFile.emit( this.file );
      let imageURL;

      /**Leer archivo para preview */
      const reader =  new FileReader();
      reader.onload = () => {
        imageURL = reader.result as string;
        this.urlLocalImage.emit( imageURL );
      }
      reader.readAsDataURL(this.file)


    }else{
      const files = event.dataTransfer.files;
      console.log(files)
    }


  }

}
