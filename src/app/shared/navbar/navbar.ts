import { ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {

  @Input() fullName = '';

  layoutService = inject(LayoutService);
  userService = inject(UserService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.fullName = user?.fullName || 'Unknown User';
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.fullName = 'Error loading name';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.fullName = 'Loading...';
    }
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
