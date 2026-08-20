import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Registration } from '../../../core/models/registration.model';
import { RegistrationService } from '../../../core/services/registration.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { isPlatformBrowser } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    RouterLink
  ],
  templateUrl: './my-registrations.html',
  styleUrls: ['../../../../styles/_my-registrations.css']
})
export class MyRegistrations implements OnInit {

  registrations: Registration[] = [];
  activeRegistrations: Registration[] = [];
  historyRegistrations: Registration[] = [];
  isLoading = true;

  get upcomingCount(): number {
    return this.activeRegistrations.length;
  }

  get actionRequiredCount(): number {
    return this.activeRegistrations.filter(r => r.status === 'WAITING_PAYMENT').length;
  }

  // Dynamic traveler ID
  currentUserId?: number;

  private registrationService = inject(RegistrationService);
  private userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.userService.getCurrentProfile().subscribe({
      next: (response: any) => {
        const user = response.data ? response.data : response;
        this.currentUserId = user?.id;
        this.loadMyRegistrations();
      },
      error: (err) => {
        console.error('Error loading user profile', err);
        // Fallback or handle error
      }
    });
  }

  loadMyRegistrations(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.registrationService.getRegistrationsByUserId(this.currentUserId).subscribe({
      next: (data) => {
        this.registrations = data || [];
        this.recalculateLists();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load my registrations', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitPayment(registration: Registration): void {
    if (registration.id) {
      this.registrationService.updateStatus(registration.id, 'PAID').subscribe({
        next: () => {
          registration.status = 'PAID';
          alert('แจ้งชำระเงินสำเร็จ กรุณารอผู้จัดยืนยัน');
          this.recalculateLists();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error submitting payment', err)
      });
    }
  }

  cancelParticipation(registration: Registration): void {
    if (registration.id) {
      if (confirm('คุณต้องการยกเลิกการเข้าร่วมทริปนี้ใช่หรือไม่?')) {
        this.registrationService.updateStatus(registration.id, 'CANCELLED').subscribe({
          next: () => {
            registration.status = 'CANCELLED';
            alert('ยกเลิกการเข้าร่วมสำเร็จ');
            this.recalculateLists();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error cancelling', err)
        });
      }
    }
  }

  recalculateLists() {
    this.activeRegistrations = this.registrations.filter(r => ['REGISTERED', 'WAITING_PAYMENT', 'PAID', 'CONFIRMED'].includes(r.status));
    this.historyRegistrations = this.registrations.filter(r => ['CANCELLED', 'COMPLETED', 'SUSPEND'].includes(r.status));
  }
}
