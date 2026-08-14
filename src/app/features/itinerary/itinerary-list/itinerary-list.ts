import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Itinerary } from '../../../core/models/itinerary.model';
import { ItineraryService } from '../../../core/services/itinerary.service';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './itinerary-list.html',
})
export class ItineraryList implements OnInit {
  itineraries: Itinerary[] = [];
  currentTripId = 1; // จำลองว่ากำลังดูกำหนดการของทริป ID = 1
  isLoading = true;

  private itineraryService = inject(ItineraryService);

  ngOnInit(): void {
    this.loadItineraries();
  }

  loadItineraries(): void {
    this.isLoading = true;
    this.itineraryService.getItinerariesByTripId(this.currentTripId).subscribe({
      next: (data) => {
        this.itineraries = data.sort((a, b) => {
          if (a.dayNo === b.dayNo) {
            return a.time.localeCompare(b.time);
          }
          return a.dayNo - b.dayNo;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการโหลดกำหนดการ:', err);
        this.isLoading = false;
      }
    });
  }
}
