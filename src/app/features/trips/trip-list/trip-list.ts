import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-list',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterLink
  ],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css',
})
export class TripList {

  displayedColumns: string[] = ['name', 'location', 'startDate', 'endDate', 'status', 'actions'];
  dataSource: Trip[] = [];

  private tripService = inject(TripService);

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err)
    });
  }
}
