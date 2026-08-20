import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './user-list.html',
  styleUrl: '../../../../styles/user-list.css',
})
export class UserList implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'email', 'role', 'status', 'actions'];
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  availableRoles: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().pipe(delay(300)).subscribe({
      next: (response: any) => {
        this.users = response?.data || response || [];
        this.availableRoles = [...new Set(this.users.map(u => u.role).filter(r => !!r))];
        this.applyFilter();
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

  applyFilter(): void {
    this.filteredUsers = this.users.filter(user => {
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = term
        ? user.id.toString().includes(term) || (user.fullName && user.fullName.toLowerCase().includes(term))
        : true;
      const matchRole = this.selectedRole ? user.role === this.selectedRole : true;
      const matchStatus = this.selectedStatus ? user.status === this.selectedStatus : true;

      return matchSearch && matchRole && matchStatus;
    });
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
      this.applyFilter();
    }

    this.userService.toggleStatus(id, newStatus).subscribe({
      next: () => {

      },
      error: (err) => {
        console.error(err);
        if (user) {
          user.status = status;
          this.applyFilter();
          this.cdr.detectChanges();
        }
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.onFilterChange();
    this.getAllUsers();
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1;
  }

  get startIndex(): number {
    return this.filteredUsers.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredUsers.length ? this.filteredUsers.length : end;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
