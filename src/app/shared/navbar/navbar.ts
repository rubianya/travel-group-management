import { Component, inject } from '@angular/core';
import { LayoutService } from '../../core/services/layout-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [    
    MatToolbarModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  layoutService = inject(LayoutService);

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

}
