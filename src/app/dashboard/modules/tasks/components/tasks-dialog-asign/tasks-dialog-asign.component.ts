import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { USERS } from '../../../../../shared/constants/endpoints';
import { ResponseApi } from '../../../../../shared/interfaces/response-api';
import { PossibleValueSelect } from '../../../../../shared/interfaces/components/select';

@Component({
  selector: 'app-tasks-dialog-asign',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './tasks-dialog-asign.component.html',
  styleUrl: './tasks-dialog-asign.component.scss'
})
export default class TasksDialogAsignComponent implements OnInit {

  load: boolean = true;
  form: FormGroup;
  url: string = USERS;
  usersList: PossibleValueSelect[] = [];
  user: string = null;

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef, 
    private utils: UtilsService){
      this.form = new FormGroup({
        user: new FormControl(null, [Validators.required])
      });

      if(data.user !== null && data.user !== ''){
        this.user = data.user;
      }
      
    }

  ngOnInit(): void {
    this.utils.getAll(this.url).subscribe({
      next: (response: ResponseApi<PossibleValueSelect[]>) => this.setList(response.data ?? []),
      error: (error: any) => this.utils.error('Error en el servidor!'),
      complete: () => this.load = false
    })
  }

  setList(data: PossibleValueSelect[]){
    this.usersList = data;


    if(this.user !== null && this.user !== ''){
      const user: PossibleValueSelect = this.usersList.find((user: PossibleValueSelect) => user.validate === this.user);
      console.log('user: ', user);
      this.form.controls['user'].setValue(user.value);
    }
  }

  ok(){
    const idUser: number = Number(this.form.controls['user'].value);
    this.dialogRef.close(idUser);
  }
  // scannedCode: string = ''; CODIGO DE BARRAS
  // private buffer: string = '';

  // constructor(private utils: UtilsService){}


  // ngOnInit(): void {
  //   this.utils.hideLoader();
  // }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {

  //   if (event.key === 'Enter') {
  //     this.scannedCode = this.buffer;
  //     console.log('Código de barras escaneado:', this.scannedCode);
  //     this.buffer = '';
  //   } else {
  //     this.buffer += event.key;
  //   }
  // }
}
