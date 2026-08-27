import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TripStatDTO } from '../../../core/models/dashboard.model';
import { UserService } from '../../../core/services/user.service';
import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { catchError, of, forkJoin, map, switchMap } from 'rxjs';

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  organizerCount: number;
  travelerCount: number;
}

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

  userStats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminCount: 0,
    organizerCount: 0,
    travelerCount: 0
  };

  registrationStats = {
    total: 0,
    confirmed: 0,
    cancelled: 0
  };

  totalGroups = 0;

  cdr = inject(ChangeDetectorRef);
  dashboardService = inject(DashboardService);
  userService = inject(UserService);
  tripService = inject(TripService);
  registrationService = inject(RegistrationService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const tripsAndGroups$ = this.tripService.getAllTrips().pipe(
      catchError(() => of([])),
      switchMap((res: any) => {
        const trips = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        if (!trips || trips.length === 0) return of(0);
        const groupRequests = trips.map((t: any) => 
          this.dashboardService.getGroupCountByTripId(t.id).pipe(
            catchError(() => of({ data: 0 })),
            map((res: any) => res?.data || 0)
          )
        );
        return forkJoin(groupRequests).pipe(
          map((counts: any) => counts.reduce((acc: number, curr: number) => acc + curr, 0))
        );
      })
    );

    forkJoin({
      trips: this.dashboardService.getTripStats().pipe(
        catchError(() => of({ data: { totalTrips: 0, openTrips: 0 } }))
      ),
      users: this.userService.getAllUsers().pipe(
        catchError(() => of({ data: [] }))
      ),
      registrations: this.registrationService.getAllRegistrations().pipe(
        catchError(() => of([]))
      ),
      groups: tripsAndGroups$
    }).subscribe({
      next: (res: any) => {
        // Trip Stats
        if (res.trips && res.trips.data) {
          this.tripStats = res.trips.data;
        }

        // User Stats
        const users = res.users.data ? res.users.data : (Array.isArray(res.users) ? res.users : []);
        this.userStats.totalUsers = users.length;
        
        users.forEach((user: any) => {
          if (user.status === 'ACTIVE') {
            this.userStats.activeUsers++;
          } else {
            this.userStats.inactiveUsers++;
          }

          if (user.role === 'Admin') this.userStats.adminCount++;
          if (user.role === 'Organizer') this.userStats.organizerCount++;
          if (user.role === 'Traveler') this.userStats.travelerCount++;
        });

        // Registration Stats
        const regs = Array.isArray(res.registrations) ? res.registrations : [];
        this.registrationStats.total = regs.length;
        this.registrationStats.confirmed = regs.filter((r: any) => r.status === 'CONFIRMED').length;
        this.registrationStats.cancelled = regs.filter((r: any) => r.status === 'CANCELLED').length;

        // Group Stats
        this.totalGroups = res.groups;

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
