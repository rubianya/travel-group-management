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
  styleUrls: ['./my-group.scss']
})
export class MyGroup implements OnInit {

  myGroup: Group | null = null;
  isLoading = true;

  // Mock current user ID and Trip ID for now
  currentUserId = 1;
  currentTripId = 1;

  private groupService = inject(GroupService);

  ngOnInit(): void {
    this.loadMyGroup();
  }

  loadMyGroup(): void {
    this.isLoading = true;
    this.groupService.getGroupsByTripId(this.currentTripId).subscribe({
      next: (groups) => {
        // Find the group that contains this user
        this.myGroup = groups.find(g => 
          g.members.some(m => m.userId === this.currentUserId) ||
          g.leader?.id === this.currentUserId
        ) || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการโหลดกลุ่ม:', err);
        this.isLoading = false;
      }
    });
  }
}
