import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatSlideToggleModule
  ],
  templateUrl: './user-list.html',
  styleUrl: '../../../../styles/user-list.css',
})
export class UserList implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'email', 'role', 'status', 'actions'];
  users: User[] = [];
  isLoading = true;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().pipe(delay(800)).subscribe({
      next: (response: any) => {
        this.users = response?.data || response || [];
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

  onViewDetail(userId: number): void {
    this.router.navigate(['/users', userId, 'detail']);
  }

  onUpdate(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  onDelete(id: number): void {
    if (confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      this.userService.toggleStatus(id, 'S').subscribe({
        next: () => {
          alert('ลบผู้ใช้สำเร็จเรียบร้อยแล้ว');
          this.getAllUsers();
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', err);
          alert('ไม่สามารถลบผู้ใช้งานได้');
        }
      });
    }
  }

  toggleStatus(id: number, status: string): void {
    const newStatus = status === 'A' ? 'I' : 'A';

    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = newStatus;
    }

    this.userService.toggleStatus(id, newStatus).subscribe({
      next: () => {

      },
      error: (err) => {
        console.error(err);
        if (user) {
          user.status = status;
          this.cdr.detectChanges();
        }
      }
    });
  }

}
