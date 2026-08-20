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
import { Registration } from '../../../core/models/registration.model';

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

  upcomingTrips: Registration[] = [];

  private registrationService = inject(RegistrationService);
  private userService = inject(UserService);
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
        
        // Calculate Summary
        this.travelerSummary.registeredTrips = registrations.length;
        this.travelerSummary.confirmedTrips = registrations.filter(r => r.status === 'CONFIRMED').length;
        this.travelerSummary.pendingPayments = registrations.filter(r => r.status === 'WAITING_PAYMENT' || r.status === 'REGISTERED').length;

        // Filter Upcoming Trips (e.g. only ACTIVE statuses)
        this.upcomingTrips = registrations.filter(r => ['REGISTERED', 'WAITING_PAYMENT', 'PAID', 'CONFIRMED'].includes(r.status));
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load my registrations', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
