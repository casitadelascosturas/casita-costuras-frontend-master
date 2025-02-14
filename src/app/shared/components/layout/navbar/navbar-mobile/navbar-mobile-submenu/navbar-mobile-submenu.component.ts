import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { SubMenuItem } from '../../../../../interfaces/menu.model';
import { MenuService } from '../../../../../services/menu.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-mobile-submenu',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './navbar-mobile-submenu.component.html',
  styleUrl: './navbar-mobile-submenu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu = <SubMenuItem>{};

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: any) {
    this.menuService.toggleSubMenu(menu);
  }

  private collapse(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) this.collapse(item.children);
    });
  }

  public closeMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
}
