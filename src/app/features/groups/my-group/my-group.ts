import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-my-group',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-group.html',
  styleUrls: ['../../../../styles/_my-group.css']
})
export class MyGroup implements OnInit {

  groups: Group[] = [];
  isLoading = true;
  
  // Mock current user ID
  currentUserId = 2;

  private groupService = inject(GroupService);

  ngOnInit(): void {
    this.loadMyGroup();
  }

  loadMyGroup(): void {
    this.isLoading = true;
    this.groupService.getGroupsByUserId(this.currentUserId).subscribe({
      next: (data) => {
        this.groups = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการโหลดกลุ่ม:', err);
        this.isLoading = false;
      }
    });
  }
}
