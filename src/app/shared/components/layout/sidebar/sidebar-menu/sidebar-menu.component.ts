import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuService } from '../../../../services/menu.service';
import { SubMenuItem } from '../../../../interfaces/menu.model';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SidebarSubmenuComponent } from '../sidebar-submenu/sidebar-submenu.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForwardIosOutline, matGroupOutline, matGroupsOutline, matHomeOutline, matInsertDriveFileOutline, matLocalShippingOutline, matLoyaltyOutline, matReceiptOutline, matTodayOutline } from '@ng-icons/material-icons/outline';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    NgFor,
        NgClass,
        // AngularSvgIconModule,
        NgTemplateOutlet,
        RouterModule,
        RouterLink,
        RouterLinkActive,
        NgIf,
        SidebarSubmenuComponent,
        NgIconComponent,
        MatIconModule
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
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
export class SidebarMenuComponent {

  constructor(public menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.setPermissions();
  }

  public toggleMenu(subMenu: SubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

}
