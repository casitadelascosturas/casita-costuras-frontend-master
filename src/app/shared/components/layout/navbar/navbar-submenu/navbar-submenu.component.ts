import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { SubMenuItem } from '../../../../interfaces/menu.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForwardIosOutline, matGroupOutline, matGroupsOutline, matHomeOutline,
         matInsertDriveFileOutline, matLocalShippingOutline, matLoyaltyOutline, matReceiptOutline,
         matTodayOutline } from '@ng-icons/material-icons/outline';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'div[navbar-submenu]',
  standalone: true,
  imports: [
    NgFor,
        NgTemplateOutlet,
        RouterLinkActive,
        RouterLink,
        NgIf,
        NgIconComponent,
        MatIconModule
  ],
  templateUrl: './navbar-submenu.component.html',
  styleUrl: './navbar-submenu.component.scss',
  viewProviders:[
    provideIcons({
      matHomeOutline,
      matGroupOutline,
      matGroupsOutline,
      matLoyaltyOutline,
      matLocalShippingOutline,
      matInsertDriveFileOutline,
      matReceiptOutline,
      matTodayOutline,
      matArrowForwardIosOutline
    })
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSubmenuComponent {

  @Input() public submenu = <SubMenuItem[]>{};

  constructor() {}

  ngOnInit(): void {}
}
