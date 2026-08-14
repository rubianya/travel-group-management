import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Registration } from '../../../core/models/registration.model';
import { RegistrationService } from '../../../core/services/registration.service';
import { RouterLink } from '@angular/router';

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
    RouterLink
  ],
  templateUrl: './registration-list.html',
})
export class RegistrationList implements OnInit {
  // กำหนดคอลัมน์ที่จะแสดงในตาราง
  displayedColumns: string[] = ['travelerName', 'tripId', 'budget', 'interests', 'status', 'actions'];
  dataSource: Registration[] = [];
  isLoading = true;

  // เรียกใช้ Registration Service
  private registrationService = inject(RegistrationService);

  ngOnInit(): void {
    this.loadRegistrations();
  }

  // ฟังก์ชันดึงข้อมูลจาก Mock Data
  loadRegistrations(): void {
    this.isLoading = true;
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้สมัคร:', err);
        this.isLoading = false;
      }
    });
  }
}