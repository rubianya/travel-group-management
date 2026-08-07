import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './group-list.html',
  styleUrl: './group-list.css',
})
export class GroupList implements OnInit {

  groups: Group[] = [];
  isLoading = false;
  
  // จำลองว่า Organizer กำลังดูข้อมูลของ ทริป ID = 1 
  // (ของจริงจะดึงมาจาก URL Parameter เช่น /trips/1/groups)
  currentTripId = 1; 

  private groupService = inject(GroupService);

  ngOnInit(): void {
    this.loadGroups();
  }

  // ดึงข้อมูลกลุ่มเดิม
  loadGroups(): void {
    this.groupService.getGroupsByTripId(this.currentTripId).subscribe({
      next: (data) => this.groups = data,
      error: (err) => console.error('เกิดข้อผิดพลาดในการโหลดกลุ่ม:', err)
    });
  }

  // ฟังก์ชันเมื่อกดปุ่มจัดกลุ่มอัตโนมัติ
  autoGroup(): void {
    this.isLoading = true; // เปิด Loading Spinner
    this.groups = []; // ล้างข้อมูลเก่าบนหน้าจอ

    this.groupService.generateAutoGroups(this.currentTripId).subscribe({
      next: (data) => {
        this.groups = data; // นำข้อมูลกลุ่มใหม่มาใส่
        this.isLoading = false; // ปิด Loading Spinner
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการจัดกลุ่ม:', err);
        this.isLoading = false;
      }
    });
  }
}
