import { Component, inject, Input, OnInit, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { UserService } from '../../core/services/user.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar implements OnInit {

  layoutService = inject(LayoutService);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);

  @Input() role: string = '';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.role = user?.role || '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading role', err);
        }
      });
    }
  }

}
