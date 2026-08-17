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
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';

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
    MatSelectModule
  ],
  templateUrl: './trip-list.html',
  styleUrl: '../../../../styles/_trip-list.css'
})
export class TripList implements OnInit {

  displayedColumns: string[] = ['tripName', 'location', 'startDate', 'endDate', 'status', 'actions'];
  dataTrips: Trip[] = [];
  filteredTrips: Trip[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedStatus: string = '';
  availableStatuses: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  tripService = inject(TripService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.isLoading = true;
    this.tripService.getAllTrips().pipe(delay(500)).subscribe({
      next: (response: any) => {
        this.dataTrips = response?.data || response || [];
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

  get paginatedTrips(): Trip[] {
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

}
