import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CrudService } from '../../../shared/services/crud.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuService } from '../../../shared/services/menu.service';
import { Route, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matHomeOutline, matGroupOutline, matGroupsOutline, matLoyaltyOutline, matLocalShippingOutline, matInsertDriveFileOutline, matTodayOutline, matReceiptOutline, matArrowForwardIosOutline } from '@ng-icons/material-icons/outline';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { ResponseApi } from '../../../shared/interfaces/response-api';
import { UserPermissions } from '../../../shared/interfaces/response-permissions-api';
import { UtilsService } from '../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIconComponent, MatIconModule,
            HeaderComponent, RouterModule,
            RouterLink,
            RouterLinkActive],
  providers:[],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({
    matHomeOutline,
    matGroupOutline,
    matGroupsOutline,
    matLoyaltyOutline,
    matLocalShippingOutline,
    matInsertDriveFileOutline,
    matTodayOutline,
    matReceiptOutline,
    matArrowForwardIosOutline
     })],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {

  pages: any[] = [];

  constructor(
    private utils: UtilsService,
    public auth: AuthService,
    public menuService: MenuService,
    private router: Router) {
    this.menuService
    .getPermissions()
    .subscribe({
      next:(res: ResponseApi<UserPermissions>) => {
        this.pages = res.data.pages;
      },
      error:(error: any) => {
        console.log(error);
      },
      complete: () =>{
        this.utils.hideLoader();
      }
    })
  }

  ngOnInit(): void {
  }

  navigateRoute(route: string){
    this.utils.showLoader();
    this.router.navigate([`${route}`]);
  }
}
