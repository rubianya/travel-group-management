import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Footer } from '../../shared/footer/footer';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutService } from '../../core/services/layout-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar,
    Footer,
    MatSidenavModule
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

  layout = inject(LayoutService);
  
}