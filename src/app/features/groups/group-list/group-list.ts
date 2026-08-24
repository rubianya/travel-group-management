import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';
import { Registration } from '../../../core/models/registration.model';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CdkDropListGroup, CdkDropList, CdkDrag,
    MatDialogModule,
    FormsModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './group-list.html',
  styleUrls: ['./group-list.scss']
})
export class GroupList implements OnInit {

  groups: Group[] = [];
  unassignedMembers: Registration[] = [];
  isLoading = false;
  currentTripId = 1; // Example tripId
  groupSizeInput = 4;

  private groupService = inject(GroupService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.groupService.getGroupsByTripId(this.currentTripId).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loadUnassigned();
      },
      error: (err) => {
        console.error('Error loading groups:', err);
        this.isLoading = false;
      }
    });
  }

  loadUnassigned(): void {
    this.groupService.getUnassignedMembers(this.currentTripId).subscribe({
      next: (members) => {
        this.unassignedMembers = members;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading unassigned members:', err);
        this.isLoading = false;
      }
    });
  }

  autoGroup(): void {
    this.isLoading = true;
    this.groupService.autoGrouping(this.currentTripId, this.groupSizeInput).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error auto grouping:', err);
        this.isLoading = false;
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      const targetGroupId = event.container.id;
      const sourceGroupId = event.previousContainer.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // We should use movedItem.id which maps to registrationId for GroupMember
      const registrationId = movedItem.id;

      if (targetGroupId !== 'unassignedList') {
        const groupId = parseInt(targetGroupId.replace('groupList-', ''), 10);
        this.groupService.addMemberToGroup(groupId, registrationId).subscribe({
          next: (updatedGroup) => {
            const index = this.groups.findIndex(g => g.id === groupId);
            if (index !== -1) this.groups[index] = updatedGroup;
          },
          error: (err) => console.error('Error adding member', err)
        });
      }

      if (sourceGroupId !== 'unassignedList') {
        const groupId = parseInt(sourceGroupId.replace('groupList-', ''), 10);
        this.groupService.removeMemberFromGroup(groupId, registrationId).subscribe({
          next: (updatedGroup) => {
            const index = this.groups.findIndex(g => g.id === groupId);
            if (index !== -1) this.groups[index] = updatedGroup;
          },
          error: (err) => console.error('Error removing member', err)
        });
      }
    }
  }

  confirmGroup(groupId: number): void {
    this.groupService.confirmGroup(groupId, 'CONFIRMED').subscribe({
      next: (updatedGroup) => {
        const index = this.groups.findIndex(g => g.id === groupId);
        if (index !== -1) {
          this.groups[index] = updatedGroup;
        }
      },
      error: (err) => console.error('Error confirming group:', err)
    });
  }
}
