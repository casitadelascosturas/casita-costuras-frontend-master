import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  title: string = '';
  icon: string = '';
  description: string = '';
  @Input() set headerIcon(icon: string) { this.icon = icon; }
  @Input() set headerTitle(title: string) { this.title = title; }
  @Input() set headerDescription(description: string) { this.description = description; }


}
