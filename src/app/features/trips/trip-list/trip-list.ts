import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { TripResponseDTO } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { UserService } from '../../../core/services/user.service';
import { forkJoin } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule
  ],
  templateUrl: './trip-list.html',
  styleUrl: '../../../../styles/_trip-list.css'
})
export class TripList implements OnInit {

  displayedColumns: string[] = ['tripName', 'location', 'startDate', 'endDate', 'status', 'actions'];
  dataTrips: TripResponseDTO[] = [];
  filteredTrips: TripResponseDTO[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedStatus: string = '';
  availableStatuses: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  currentRole: string = '';

  tripService = inject(TripService);
  registrationService = inject(RegistrationService);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.currentRole = user?.role || '';
          this.loadTrips();
        },
        error: (err) => {
          console.error('Error loading role', err);
          this.loadTrips();
        }
      });
    } else {
      this.loadTrips();
    }
  }

  loadTrips(): void {
    this.isLoading = true;
    const request$ = this.currentRole === 'Admin' || this.currentRole === 'Traveler' ? this.tripService.getAllTrips() : this.tripService.getMyTrips();
    
    forkJoin({
      trips: request$.pipe(delay(300)),
      regs: this.registrationService.getAllRegistrations()
    }).subscribe({
      next: (response: any) => {
        let trips = response.trips?.data || response.trips || [];
        const regs = response.regs?.data || response.regs || [];
        
        if (this.currentRole === 'Traveler') {
          trips = trips.filter((t: any) => t.status === 'OPEN');
        }

        trips = trips.map((t: any) => {
          const tripRegs = regs.filter((r: any) => r.tripId === t.id && r.status !== 'CANCELLED' && r.status !== 'REJECTED');
          const currentCount = tripRegs.length;
          return {
            ...t,
            currentParticipants: currentCount,
            isFull: currentCount >= t.maxParticipants
          };
        });

        this.dataTrips = trips;
        this.availableStatuses = [...new Set(this.dataTrips.map(t => t.status).filter(s => !!s))];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    this.filteredTrips = this.dataTrips.filter(trip => {
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = term
        ? (trip.tripName && trip.tripName.toLowerCase().includes(term)) || (trip.location && trip.location.toLowerCase().includes(term))
        : true;
      const matchStatus = this.selectedStatus ? trip.status === this.selectedStatus : true;

      return matchSearch && matchStatus;
    });
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.onFilterChange();
    this.applyFilter();
  }

  get paginatedTrips(): TripResponseDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTrips.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTrips.length / this.itemsPerPage) || 1;
  }

  get startIndex(): number {
    return this.filteredTrips.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredTrips.length ? this.filteredTrips.length : end;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onViewDetail(tripId: number): void {
    this.router.navigate(['/trips', tripId, 'detail']);
  }

  onUpdate(tripId: number): void {
    this.router.navigate(['/trips', tripId]);
  }

  onDelete(id: number): void {
    if (confirm('คุณต้องการลบทริปนี้ใช่หรือไม่?')) {
      const targetStatus = 'SUSPEND';
      this.tripService.updateTripStatus(id, targetStatus).subscribe({
        next: () => {
          alert('ลบทริปสำเร็จเรียบร้อยแล้ว');
          this.loadTrips();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการลบทริป:', err);
        }
      });
    }
  }

  getAvailableTripStatuses(currentStatus: string): string[] {
    if (this.currentRole !== 'Organizer') return [];

    switch (currentStatus) {
      case 'DRAFT': return ['OPEN', 'CANCELLED'];
      case 'OPEN': return ['CLOSED', 'CANCELLED'];
      case 'CLOSED': return ['GROUPING', 'CONFIRMED', 'CANCELLED'];
      case 'GROUPING': return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED': return ['COMPLETED', 'CANCELLED'];
      default: return [];
    }
  }

  changeTripStatus(trip: TripResponseDTO, newStatus: string): void {
    if (trip.id) {
      this.tripService.updateTripStatus(trip.id, newStatus).subscribe({
        next: () => {
          trip.status = newStatus;
          alert(`เปลี่ยนสถานะทริปเป็น ${newStatus} สำเร็จ`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error updating trip status', err)
      });
    }
  }

}
