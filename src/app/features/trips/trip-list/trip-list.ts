import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './trip-list.html',
})
export class TripList {

  displayedColumns: string[] = ['tripName', 'location', 'startDate', 'endDate', 'status', 'actions'];
  dataTrips: Trip[] = [];
  isLoading = true;

  tripService = inject(TripService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.isLoading = true;
    this.tripService.getAllTrips().pipe(delay(800)).subscribe({
      next: (response: any) => {
        this.dataTrips = response?.data || response || [];
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
