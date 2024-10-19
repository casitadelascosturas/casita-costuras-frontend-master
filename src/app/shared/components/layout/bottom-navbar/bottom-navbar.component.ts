import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForwardIosOutline, matGroupOutline, matGroupsOutline, matHomeOutline, matInsertDriveFileOutline, matLocalShippingOutline, matLoyaltyOutline, matReceiptOutline, matTodayOutline } from '@ng-icons/material-icons/outline';
import { MenuService } from '../../../services/menu.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [
    NgIconComponent,
    RouterModule,
    RouterLink,
    RouterLinkActive,NgIf, NgFor,
    MatIconModule],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent implements OnInit, OnDestroy {

  constructor(
    public menuService: MenuService, 
    public authService: AuthService,
    private cdr: ChangeDetectorRef ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.menuService.pagesMenu.forEach(menu => {
      // console.log('menu: ', menu);
      menu.items.forEach(item => {
        // console.log('Item route:', item.route); // Asegúrate de que estas rutas sean correctas
      });
    });

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

}

