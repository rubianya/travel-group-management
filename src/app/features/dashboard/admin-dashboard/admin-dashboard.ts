import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TripStatDTO } from '../../../core/models/dashboard.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  isLoading = true;

  tripStats: TripStatDTO = {
    totalTrips: 0,
    openTrips: 0
  };

  cdr = inject(ChangeDetectorRef);
  dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService.getTripStats().pipe(
      catchError(() => of({ data: { totalTrips: 0, openTrips: 0 } }))
    ).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.tripStats = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading admin dashboard data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
