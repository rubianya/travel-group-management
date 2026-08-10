import { Component, inject } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from 'express';

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
  router = inject(Router);

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
