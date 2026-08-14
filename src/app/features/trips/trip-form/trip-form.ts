import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { delay, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './trip-form.html',
})
export class TripForm implements OnInit {

  tripForm!: FormGroup;
  tripId?: number;
  isLoading = false;

  tripType: string[] = ['ธรรมชาติ', 'คาเฟ่', 'วัฒนธรรม', 'อาหารท้องถิ่น', 'เดินป่า', 'ทะเล', 'ถ่ายรูป', 'ช้อปปิ้ง'];

  statuses = [
    { value: 'DRAFT', label: 'ฉบับร่าง (DRAFT)' },
    { value: 'OPEN', label: 'เปิดรับสมัคร (OPEN)' },
    { value: 'CLOSED', label: 'ปิดรับสมัคร (CLOSED)' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.tripId = +id;
        this.loadTripData(this.tripId);
      } else {
        this.isLoading = true;
        of(null).pipe(delay(800)).subscribe(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  private loadTripData(id: number): void {
    this.isLoading = true;
    this.tripService.getTripById(id).pipe(delay(800)).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          const trip = response.data;
          this.tripForm.patchValue({
            tripName: trip.tripName,
            description: trip.description,
            location: trip.location,
            startDate: trip.startDate,
            endDate: trip.endDate,
            maxParticipants: trip.maxParticipants,
            groupSize: trip.groupSize,
            budget: trip.budget,
            tripType: trip.tripType,
            status: trip.status
          });
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load trip data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initForm(): void {
    this.tripForm = this.fb.group({
      tripName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      groupSize: [5, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]],
      tripType: ['', Validators.required],
      status: ['DRAFT', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formValue = this.tripForm.value;

      const payload = {
        ...formValue,
        budget: Number(formValue.budget),
        groupSize: Number(formValue.groupSize),
        maxParticipants: Number(formValue.maxParticipants)
      };

      delete (payload as any).createdBy;

      if (this.tripId) {
        this.tripService.updateTrip(this.tripId, payload).subscribe({
          next: () => {
            alert('อัปเดตข้อมูลทริปสำเร็จ!');
            this.cdr.detectChanges();
            this.router.navigate(['/trips']);
          },
          error: (err) => {
            console.error('Update failed:', err);
            const backendError = err.error?.message || err.error?.error || err.message;
            alert(`ไม่สามารถอัปเดตข้อมูลได้\nสาเหตุ: ${backendError}`);
          }
        });
      } else {
        this.tripService.createTrip(payload).subscribe({
          next: (response) => {
            alert('บันทึกข้อมูลทริปสำเร็จ!');
            this.cdr.detectChanges();
            this.router.navigate(['/trips']);
          },
          error: (err) => {
            console.error('Save failed:', err);
            const backendError = err.error?.message || err.error?.error || err.message;
            alert(`ไม่สามารถบันทึกข้อมูลได้\nสาเหตุ: ${backendError}`);
          }
        });
      }
    } else {
      this.tripForm.markAllAsTouched();
    }
  }
}
