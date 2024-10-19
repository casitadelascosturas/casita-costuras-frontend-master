import { Injectable } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "../../services/utils/utils.service";

@Injectable({
  providedIn: 'root'
})
export default class CrudBase {

  mode: string = '';
  id: number = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private routeActivate: ActivatedRoute,
    private routerr: Router,
    private utilss: UtilsService){}

  getDialogWidth(): string {
    if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
      return '40%';
    } else if (this.breakpointObserver.isMatched('(min-width: 768px)')) {
      return '70%';
    } else if (this.breakpointObserver.isMatched('(min-width: 640px)')) {
      return '60%';
    } else {
      return '90%';
    }
  }
  

}
