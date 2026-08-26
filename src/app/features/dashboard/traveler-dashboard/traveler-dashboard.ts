import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationService } from '../../../core/services/registration.service';
import { UserService } from '../../../core/services/user.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { UpcomingTripDTO } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-traveler-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './traveler-dashboard.html',
})
export class TravelerDashboard implements OnInit {
  isLoading = true;
  currentUserId?: number;

  travelerSummary = {
    registeredTrips: 0,
    confirmedTrips: 0,
    pendingPayments: 0
  };

  upcomingTrips: UpcomingTripDTO[] = [];

  private registrationService = inject(RegistrationService);
  private userService = inject(UserService);
  private dashboardService = inject(DashboardService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.userService.getCurrentProfile().subscribe({
      next: (response: any) => {
        const user = response.data ? response.data : response;
        this.currentUserId = user?.id;
        this.loadData();
      },
      error: (err) => {
        console.error('Error loading user profile', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadData(): void {
    if (!this.currentUserId) return;

    this.registrationService.getRegistrationsByUserId(this.currentUserId).subscribe({
      next: (data) => {
        const registrations = data || [];
        this.travelerSummary.registeredTrips = registrations.length;
        this.travelerSummary.confirmedTrips = registrations.filter(r => r.status === 'CONFIRMED').length;
        this.travelerSummary.pendingPayments = registrations.filter(r => r.status === 'WAITING_PAYMENT').length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load my registrations', err)
    });

    this.dashboardService.getUpcomingTripsByUserId(this.currentUserId).subscribe({
      next: (res: any) => {
        this.upcomingTrips = res.data || res || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load upcoming trips', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}