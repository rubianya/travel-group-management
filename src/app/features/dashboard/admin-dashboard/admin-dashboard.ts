import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { TripService } from '../../../core/services/trip.service';
import { forkJoin, delay, catchError, of } from 'rxjs';

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

  summary = {
    totalTrips: 0,
    openTrips: 0,
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0
  };

  userStatsByRole: { name: string, value: number, percent: number }[] = [];
  userStatsByStatus: { name: string, value: number, percent: number }[] = [];
  tripStatsByStatus: { name: string, value: number, percent: number }[] = [];

  cdr = inject(ChangeDetectorRef);
  userService = inject(UserService);
  tripService = inject(TripService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      users: this.userService.getAllUsers().pipe(catchError(() => of([]))),
      trips: this.tripService.getAllTrips().pipe(catchError(() => of([])))
    }).pipe(delay(300)).subscribe({
      next: (res: any) => {
        const users = res.users?.data || res.users || [];
        const trips = res.trips?.data || res.trips || [];
        this.calculateAdminStats(users, trips);
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

  calculateAdminStats(users: any[], trips: any[]): void {
    const totalU = users.length || 1; // prevent div by zero
    this.summary.totalUsers = users.length;
    this.summary.activeUsers = users.filter(u => u.status === 'ACTIVE' || u.status === 'Active').length;
    this.summary.pendingUsers = users.filter(u => u.status === 'PENDING' || u.status === 'Pending' || u.status === 'INACTIVE').length;

    const roleCount: any = {};
    const statusCount: any = {};
    users.forEach(u => {
      const r = u.role || 'Unassigned';
      const s = u.status || 'Unknown';
      roleCount[r] = (roleCount[r] || 0) + 1;
      statusCount[s] = (statusCount[s] || 0) + 1;
    });
    
    this.userStatsByRole = Object.keys(roleCount).map(k => ({ 
      name: k, 
      value: roleCount[k],
      percent: Math.round((roleCount[k] / totalU) * 100)
    }));

    this.userStatsByStatus = Object.keys(statusCount).map(k => ({ 
      name: k, 
      value: statusCount[k],
      percent: Math.round((statusCount[k] / totalU) * 100)
    }));

    const totalT = trips.length || 1;
    const tripStatusCount: any = {};
    trips.forEach(t => {
      const s = t.status || 'Unknown';
      tripStatusCount[s] = (tripStatusCount[s] || 0) + 1;
    });
    
    this.tripStatsByStatus = Object.keys(tripStatusCount).map(k => ({ 
      name: k, 
      value: tripStatusCount[k],
      percent: Math.round((tripStatusCount[k] / totalT) * 100)
    }));

    this.summary.totalTrips = trips.length;
    this.summary.openTrips = trips.filter(t => t.status === 'OPEN' || t.status === 'Open').length;
  }
}
