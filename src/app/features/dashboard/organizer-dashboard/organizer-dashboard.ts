import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, delay, catchError, of } from 'rxjs';
import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';

@Component({
  selector: 'app-organizer-dashboard',
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
  templateUrl: './organizer-dashboard.html',
})
export class OrganizerDashboard implements OnInit {
  isLoading = true;

  summary = {
    totalTrips: 0,
    openTrips: 0,
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingRegistrations: 0,
    totalGroups: 0,
    ungroupedMembers: 0
  };

  upcomingTrips: any[] = [];

  cdr = inject(ChangeDetectorRef);
  tripService = inject(TripService);
  registrationService = inject(RegistrationService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      trips: this.tripService.getMyTrips().pipe(catchError(() => of([]))),
      registrations: this.registrationService.getAllRegistrations().pipe(catchError(() => of([])))
    }).pipe(delay(300)).subscribe({
      next: (res: any) => {
        const trips = res.trips?.data || res.trips || [];
        const registrations = res.registrations?.data || res.registrations || [];
        this.calculateOrganizerStats(trips, registrations);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading organizer dashboard data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateOrganizerStats(trips: any[], registrations: any[]): void {
    this.summary.totalTrips = trips.length;
    this.summary.openTrips = trips.filter(t => t.status === 'OPEN' || t.status === 'Open').length;

    // Calculate total and confirmed registrations specifically for these trips
    const tripIds = trips.map(t => t.id);
    const orgRegistrations = registrations.filter(r => tripIds.includes(r.trip));

    this.summary.totalRegistrations = orgRegistrations.length;
    this.summary.confirmedRegistrations = orgRegistrations.filter(r => r.status === 'CONFIRMED' || r.status === 'APPROVED' || r.status === 'Confirmed').length;
    this.summary.pendingRegistrations = orgRegistrations.filter(r => r.status === 'REGISTERED' || r.status === 'WAITING_PAYMENT' || r.status === 'PAID').length;

    // For now we mock the groups count, or set to 0 if not calculated
    this.summary.totalGroups = 0;
    this.summary.ungroupedMembers = 0;

    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    // Upcoming Trips
    const upcoming = trips
      .filter(t => t.status === 'OPEN' || t.status === 'Open' || t.status === 'CONFIRMED')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);

    this.upcomingTrips = upcoming.map(t => {
      const d = new Date(t.startDate);
      const day = d.getDate() ? d.getDate().toString().padStart(2, '0') : '--';
      const monthIndex = d.getMonth();
      const month = !isNaN(monthIndex) ? thaiMonths[monthIndex] : '--';

      return {
        id: t.id,
        name: t.tripName,
        startDate: t.startDate,
        day: day,
        month: month,
        participants: orgRegistrations.filter(r => r.trip === t.id).length,
        pending: orgRegistrations.filter(r => r.trip === t.id && (r.status === 'REGISTERED' || r.status === 'PAID')).length,
        status: t.status
      };
    });
  }
}
