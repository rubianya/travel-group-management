import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { GroupService } from '../../../core/services/group.service';
import { UserService } from '../../../core/services/user.service';
import { Trip } from '../../../core/models/trip.model';
import { Registration } from '../../../core/models/registration.model';
import { Group, TripGroupRequestDTO } from '../../../core/models/group.model';
import { GroupFormDialog } from '../../groups/group-form-dialog/group-form-dialog';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    RouterLink
  ],
  templateUrl: './trip-detail.html',
  styleUrls: ['../../../../styles/trip-detail.css']
})
export class TripDetail implements OnInit {

  route = inject(ActivatedRoute);
  router = inject(Router);
  tripService = inject(TripService);
  registrationService = inject(RegistrationService);
  groupService = inject(GroupService);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  dialog = inject(MatDialog);

  trip: Trip | undefined;
  registrations: Registration[] = [];
  groups: Group[] = [];
  unassignedMembers: Registration[] = [];
  isLoading = true;
  currentRole = '';
  groupSizeInput = 4;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.currentRole = user?.role || '';
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading role', err)
      });
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const tripId = Number(idParam);
      this.loadTripData(tripId);
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadTripData(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe({
      next: (response: any) => {
        this.trip = response?.data || response;
        if (this.trip && this.trip.groupSize) {
          this.groupSizeInput = this.trip.groupSize;
        }
        this.loadRegistrationsAndGroups(tripId);
      },
      error: (err) => {
        console.error('Error loading trip details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRegistrationsAndGroups(trip: number): void {
    this.registrationService.getRegistrationsByTripId(trip).subscribe({
      next: (regs) => {
        const allRegs: Registration[] = (regs as any).data || regs;
        this.registrations = allRegs;

        this.groupService.getGroupsByTripId(trip).subscribe({
          next: (groupResponse) => {
            this.groups = (groupResponse as any).data || groupResponse;
            this.loadUnassigned(trip);
          },
          error: (err) => {
            console.error('Error loading groups', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading registrations', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUnassigned(tripId: number): void {
    this.groupService.getUnassignedMembers(tripId).subscribe({
      next: (members) => {
        this.unassignedMembers = (members as any).data || members;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading unassigned members', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  autoGroup(): void {
    if (!this.trip || !this.trip.id) return;
    this.isLoading = true;
    this.groupService.autoGrouping(this.trip.id, this.groupSizeInput).subscribe({
      next: () => {
        this.loadTripData(this.trip!.id!);
      },
      error: (err) => {
        console.error('Error auto grouping:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
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

      const registrationId = movedItem.id;

      if (targetGroupId !== 'unassignedList') {
        const groupId = parseInt(targetGroupId.replace('groupList-', ''), 10);
        this.groupService.addMemberToGroup(groupId, registrationId).subscribe({
          next: (updatedGroup) => {
            const index = this.groups.findIndex(g => g.id === groupId);
            if (index !== -1) {
              this.groups[index] = updatedGroup;
              this.cdr.detectChanges();
            }
          },
          error: (err) => console.error('Error adding member', err)
        });
      }

      if (sourceGroupId !== 'unassignedList') {
        const groupId = parseInt(sourceGroupId.replace('groupList-', ''), 10);
        this.groupService.removeMemberFromGroup(groupId, registrationId).subscribe({
          next: (updatedGroup) => {
            const index = this.groups.findIndex(g => g.id === groupId);
            if (index !== -1) {
              this.groups[index] = updatedGroup;
              this.cdr.detectChanges();
            }
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
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error confirming group:', err)
    });
  }

  openCreateGroupDialog(): void {
    if (!this.trip || !this.trip.id) return;
    
    const dialogRef = this.dialog.open(GroupFormDialog, {
      width: '400px',
      data: { 
        title: 'สร้างกลุ่มใหม่',
        members: this.unassignedMembers
      }
    });

    dialogRef.afterClosed().subscribe((result: TripGroupRequestDTO) => {
      if (result) {
        this.groupService.createGroup(this.trip!.id!, result).subscribe({
          next: () => {
            this.loadTripData(this.trip!.id!);
          },
          error: (err) => console.error('Error creating group:', err)
        });
      }
    });
  }

  openEditGroupDialog(group: Group): void {
    if (!this.trip || !this.trip.id) return;

    const dialogRef = this.dialog.open(GroupFormDialog, {
      width: '400px',
      data: { 
        title: 'แก้ไขกลุ่ม',
        group: group,
        members: group.members 
      }
    });

    dialogRef.afterClosed().subscribe((result: TripGroupRequestDTO) => {
      if (result) {
        this.groupService.updateGroup(group.id, result).subscribe({
          next: () => {
            this.loadTripData(this.trip!.id!);
          },
          error: (err) => console.error('Error updating group:', err)
        });
      }
    });
  }

  deleteGroup(groupId: number): void {
    if (!this.trip || !this.trip.id) return;
    
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบกลุ่มนี้? สมาชิกทั้งหมดจะถูกย้ายกลับไปรอจัดกลุ่ม')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: () => {
          this.loadTripData(this.trip!.id!);
        },
        error: (err) => console.error('Error deleting group:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/trips']);
  }

}
