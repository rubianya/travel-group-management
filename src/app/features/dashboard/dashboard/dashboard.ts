import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';

import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { OrganizerDashboard } from '../organizer-dashboard/organizer-dashboard';
import { TravelerDashboard } from '../traveler-dashboard/traveler-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    AdminDashboard,
    OrganizerDashboard,
    TravelerDashboard
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  currentRole: string = 'ADMIN';
  isLoading = true;

  cdr = inject(ChangeDetectorRef);
  userService = inject(UserService);
  platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.currentRole = user?.role ? user.role.toUpperCase() : 'ADMIN';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading role', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}