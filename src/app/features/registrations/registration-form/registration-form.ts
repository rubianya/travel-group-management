import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationService } from '../../../core/services/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrations-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './registration-form.html',
})
export class RegistrationForm implements OnInit {

  registrationForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registrationService = inject(RegistrationService);

  availableInterests: string[] = ['ธรรมชาติ', 'คาเฟ่', 'วัฒนธรรม', 'อาหารท้องถิ่น', 'เดินป่า', 'ทะเล', 'ถ่ายรูป', 'ช้อปปิ้ง'];

  mockTrips = [
    { id: 1, name: 'ทริปเชียงใหม่ สายคาเฟ่' },
    { id: 2, name: 'ดำน้ำดูปะการัง เกาะเต่า' },
    { id: 3, name: 'ไหว้พระอยุธยา' }
  ];
  
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      tripId: ['', Validators.required],
      travelerName: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      interests: [[], Validators.required],
      remark: [''],
      status: ['REGISTERED']
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.registrationService.createRegistration(this.registrationForm.value).subscribe({
        next: () => {
          alert('ส่งใบสมัครเข้าร่วมทริปสำเร็จ!');
          this.router.navigate(['/registrations']);
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการสมัคร:', err);
          alert('ไม่สามารถส่งใบสมัครได้');
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
