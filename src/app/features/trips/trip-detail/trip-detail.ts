import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { GroupService } from '../../../core/services/group.service';
import { Trip } from '../../../core/models/trip.model';
import { Registration } from '../../../core/models/registration.model';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './trip-detail.html',
  styleUrls: ['../../../../styles/trip-detail.css']
})
export class TripDetail implements OnInit {

  route = inject(ActivatedRoute);
  router = inject(Router);
  tripService = inject(TripService);
  registrationService = inject(RegistrationService);
  groupService = inject(GroupService);
  cdr = inject(ChangeDetectorRef);

  trip: Trip | undefined;
  registrations: Registration[] = [];
  groups: Group[] = [];
  isLoading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const tripId = Number(idParam);

      setTimeout(() => {
        this.loadTripData(tripId);
      }, 800);
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadTripData(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe({
      next: (response: any) => {
        this.trip = response?.data || response;
        this.loadRegistrationsAndGroups(tripId);
      },
      error: (err) => {
        console.error('Error loading trip details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRegistrationsAndGroups(tripId: number): void {
    this.registrationService.getRegistrations().subscribe({
      next: (regs) => {
        const allRegs: Registration[] = (regs as any).data || regs;
        this.registrations = allRegs.filter(r => r.tripId === tripId);

        this.groupService.getGroupsByTripId(tripId).subscribe({
          next: (groupResponse) => {
            this.groups = (groupResponse as any).data || groupResponse;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading groups', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading registrations', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/trips']);
  }

}
