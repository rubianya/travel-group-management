import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { forkJoin, catchError, of } from 'rxjs';
import { TripService } from '../../../core/services/trip.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ApplicantStatDTO } from '../../../core/models/dashboard.model';

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
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './organizer-dashboard.html',
})
export class OrganizerDashboard implements OnInit {
  isLoading = true;

  myTrips: any[] = [];
  selectedTripId: number | null = null;
  upcomingTrips: any[] = [];

  applicantStats: ApplicantStatDTO = {
    totalApplicants: 0,
    confirmedApplicants: 0,
    cancelledApplicants: 0
  };
  groupCount = 0;
  unassignedMembersCount = 0;

  cdr = inject(ChangeDetectorRef);
  tripService = inject(TripService);
  dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.tripService.getMyTrips().pipe(catchError(() => of([]))).subscribe({
      next: (res: any) => {
        this.myTrips = res.data || res || [];
        this.generateUpcomingTrips();
        if (this.myTrips.length > 0) {
          this.selectedTripId = this.myTrips[0].id;
          this.loadTripStats();
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading trips', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateUpcomingTrips(): void {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const upcoming = this.myTrips
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
        status: t.status
      };
    });
  }

  onTripChange(): void {
    if (this.selectedTripId) {
      this.loadTripStats();
    }
  }

  loadTripStats(): void {
    if (!this.selectedTripId) return;
    this.isLoading = true;

    forkJoin({
      applicants: this.dashboardService.getApplicantStatsByTripId(this.selectedTripId).pipe(catchError(() => of({ data: null }))),
      groups: this.dashboardService.getGroupCountByTripId(this.selectedTripId).pipe(catchError(() => of({ data: 0 }))),
      unassigned: this.dashboardService.getUnassignedMembersCountByTripId(this.selectedTripId).pipe(catchError(() => of({ data: 0 })))
    }).subscribe({
      next: (res: any) => {
        if (res.applicants.data) {
          this.applicantStats = res.applicants.data;
        }
        this.groupCount = res.groups.data || 0;
        this.unassignedMembersCount = res.unassigned.data || 0;
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading trip stats', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

