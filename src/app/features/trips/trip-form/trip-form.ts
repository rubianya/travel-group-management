import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-form',
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
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.css',
})
export class TripForm implements OnInit {

  tripForm!: FormGroup;

  categories: string[] = ['ธรรมชาติ', 'คาเฟ่', 'วัฒนธรรม', 'อาหารท้องถิ่น', 'เดินป่า', 'ทะเล', 'ถ่ายรูป', 'ช้อปปิ้ง'];

  statuses = [
    { value: 'DRAFT', label: 'ฉบับร่าง (DRAFT)' },
    { value: 'OPEN', label: 'เปิดรับสมัคร (OPEN)' },
    { value: 'CLOSED', label: 'ปิดรับสมัคร (CLOSED)' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.tripForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      groupSize: [4, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      status: ['DRAFT', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      this.tripService.createTrip(this.tripForm.value).subscribe({
        next: (newTrip) => {
          alert('บันทึกข้อมูลทริปสำเร็จ!');
          this.router.navigate(['/trips']);
        },
        error: (err) => {
          console.error('Save failed:', err);
          alert('ไม่สามารถบันทึกข้อมูลได้');
        }
      });
    } else {
      this.tripForm.markAllAsTouched();
    }
  }
}
