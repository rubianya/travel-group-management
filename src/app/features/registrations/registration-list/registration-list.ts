import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef, PLATFORM_ID, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { TripRegistrationResponseDTO } from '../../../core/models/registration.model';
import { RegistrationService } from '../../../core/services/registration.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { TripService } from '../../../core/services/trip.service';
import { forkJoin, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registration-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './registration-list.html',
  styleUrls: ['../../../../styles/_registration-list.css']
})
export class RegistrationList implements OnInit {

  @Input() tripId?: number;

  displayedColumns: string[] = ['userName', 'interests', 'status', 'actions'];
  dataSource: TripRegistrationResponseDTO[] = [];
  filteredData: TripRegistrationResponseDTO[] = [];
  isLoading = true;
  availableStatuses = ['REGISTERED', 'WAITING_PAYMENT', 'PAID', 'CONFIRMED', 'CANCELLED'];
  currentRole = '';
  currentUserId?: number;

  searchTerm: string = '';
  selectedStatus: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  private registrationService = inject(RegistrationService);
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  private tripService = inject(TripService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (this.tripId) {
      this.displayedColumns = ['userName', 'interests', 'status', 'actions'];
    }

    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.currentRole = user.role || '';
          this.currentUserId = user.id;
          this.loadRegistrations();
        },
        error: (err) => {
          console.error('Error loading role', err);
          this.loadRegistrations();
        }
      });
    } else {
      this.loadRegistrations();
    }
  }

  loadRegistrations(): void {
    this.isLoading = true;

    if (this.tripId) {
      forkJoin({
        trip: this.tripService.getTripById(this.tripId),
        regs: this.registrationService.getRegistrationsByTripId(this.tripId),
        users: this.userService.getAllUsers()
      }).subscribe({
        next: (res) => {
          const tripData = (res.trip as any).data || res.trip;
          const regsData = (res.regs as any).data || res.regs;
          const usersData = (res.users as any).data || res.users;
          const mappedRegs = (regsData || []).map((r: TripRegistrationResponseDTO) => {
            const user = (usersData || []).find((u: any) => u.id === r.userId);
            return {
              ...r,
              phone: user ? user.phone : undefined,
              organizerBudget: tripData ? tripData.budget : undefined
            };
          });
          this.handleData(mappedRegs);
        },
        error: (err) => this.handleError(err)
      });
      return;
    }

    if (this.currentRole === 'Organizer') {
      forkJoin({
        myTrips: this.tripService.getMyTrips(),
        allRegs: this.registrationService.getAllRegistrations(),
        users: this.userService.getAllUsers()
      }).subscribe({
        next: (res) => {
          const tripsArray = (res.myTrips as any).data ? (res.myTrips as any).data : res.myTrips;
          const usersData = (res.users as any).data || res.users;
          const myTripIds = (tripsArray || []).map((t: any) => t.id);

          const filteredRegs = (res.allRegs || []).filter((r: TripRegistrationResponseDTO) => myTripIds.includes(r.tripId)).map((r: TripRegistrationResponseDTO) => {
            const trip = (tripsArray || []).find((t: any) => t.id === r.tripId);
            const user = (usersData || []).find((u: any) => u.id === r.userId);
            return { ...r, phone: user ? user.phone : undefined, organizerBudget: trip ? trip.budget : undefined };
          });
          this.handleData(filteredRegs);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      forkJoin({
        allTrips: this.tripService.getAllTrips(),
        allRegs: this.registrationService.getAllRegistrations(),
        users: this.userService.getAllUsers()
      }).subscribe({
        next: (res) => {
          const tripsArray = (res.allTrips as any).data ? (res.allTrips as any).data : res.allTrips;
          const allRegs = (res.allRegs as any).data ? (res.allRegs as any).data : res.allRegs;
          const usersData = (res.users as any).data || res.users;
          const mappedRegs = (allRegs || []).map((r: TripRegistrationResponseDTO) => {
            const trip = (tripsArray || []).find((t: any) => t.id === r.tripId);
            const user = (usersData || []).find((u: any) => u.id === r.userId);
            return { ...r, phone: user ? user.phone : undefined, organizerBudget: trip ? trip.budget : undefined };
          });
          this.handleData(mappedRegs);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleData(data: TripRegistrationResponseDTO[] | any): void {
    this.dataSource = data || [];
    this.applyFilter();
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 300);
  }

  private handleError(err: any): void {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้สมัคร:', err);
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 300);
  }

  changeStatus(registration: TripRegistrationResponseDTO, newStatus: string): void {
    if (newStatus === 'CANCELLED') {
      const confirmCancel = window.confirm(`คุณต้องการยกเลิกการสมัครของคุณ ${registration.userName} ใช่หรือไม่?`);
      if (!confirmCancel) {
        return;
      }
    }

    if (registration.id) {
      this.registrationService.updateStatus(registration.id, newStatus).subscribe({
        next: () => {
          registration.status = newStatus;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to update status:', err);
        }
      });
    }
  }

  getAvailableStatuses(currentStatus: string): string[] {
    if (this.currentRole === 'Traveler') {
      if (currentStatus !== 'CANCELLED') {
        return ['CANCELLED'];
      }
      return [];
    }

    switch (currentStatus) {
      case 'REGISTERED':
        return ['WAITING_PAYMENT', 'CANCELLED'];
      case 'WAITING_PAYMENT':
        return ['PAID', 'CANCELLED'];
      case 'PAID':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['CANCELLED'];
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  }

  applyFilter(): void {
    this.filteredData = this.dataSource.filter(reg => {
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = term
        ? (reg.userName && reg.userName.toLowerCase().includes(term)) || (reg.tripName && reg.tripName.toLowerCase().includes(term)) || (reg.tripId && reg.tripId.toString().includes(term))
        : true;
      const matchStatus = this.selectedStatus ? reg.status === this.selectedStatus : true;

      return matchSearch && matchStatus;
    });
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.applyFilter();
  }

  get paginatedData(): TripRegistrationResponseDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
  }

  get startIndex(): number {
    return this.filteredData.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredData.length ? this.filteredData.length : end;
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

  get totalRegistrations(): number {
    return this.dataSource.length;
  }

  get waitingApprovalCount(): number {
    return this.dataSource.filter(r => r.status === 'REGISTERED').length;
  }

  get actionRequiredCount(): number {
    return this.dataSource.filter(r => r.status === 'PAID').length;
  }
}