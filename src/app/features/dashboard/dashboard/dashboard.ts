import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // จำลองข้อมูลสรุปภาพรวม (Summary)
  summary = {
    totalTrips: 12,
    openTrips: 3,
    totalRegistrations: 145,
    confirmedRegistrations: 85,
    totalGroups: 18,
    ungroupedMembers: 5
  };

  // จำลองข้อมูลทริปที่ใกล้ถึงวันเดินทาง
  upcomingTrips = [
    { id: 1, name: 'ทริปเชียงใหม่ สายคาเฟ่', startDate: '2024-12-01', participants: 10, status: 'OPEN' },
    { id: 2, name: 'ดำน้ำดูปะการัง เกาะเต่า', startDate: '2024-11-25', participants: 18, status: 'OPEN' },
    { id: 3, name: 'ไหว้พระอยุธยา', startDate: '2024-10-25', participants: 15, status: 'CLOSED' }
  ];

  ngOnInit(): void {
    // ในอนาคตเมื่อต่อ Backend จะต้องเรียก API: GET /api/dashboard/summary ที่นี่
  }

}