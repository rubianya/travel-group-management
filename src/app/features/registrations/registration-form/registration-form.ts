import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InterestService } from '../../../core/services/interest.service';
import { TripService } from '../../../core/services/trip.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { UserService } from '../../../core/services/user.service';
import { TripResponseDTO } from '../../../core/models/trip.model';
import { TripRegistrationRequestDTO } from '../../../core/models/registration.model';

@Component({
  selector: 'app-registrations-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  availableInterests: any[] = [];
  availableTrips: TripResponseDTO[] = [];
  registrationId?: number;

  // Current user
  currentUserId = 2;

  private fb = inject(FormBuilder);
  private interestService = inject(InterestService);
  private tripService = inject(TripService);
  private registrationService = inject(RegistrationService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      tripId: [{ value: '', disabled: true }, Validators.required],
      travelerName: [{ value: '', disabled: true }],
      interests: [[], Validators.required],
      remark: ['']
    });

    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentProfile().subscribe({
        next: (response: any) => {
          const user = response.data ? response.data : response;
          this.currentUserId = user?.id || 2;
          this.registrationForm.patchValue({ travelerName: user?.fullName || user?.username || '' });
        },
        error: (err) => console.error('Error loading user profile', err)
      });
    }

    this.route.queryParams.subscribe(params => {
      if (params['regId']) {
        this.registrationId = Number(params['regId']);
        this.loadRegistrationData(this.registrationId);
      } else if (params['tripId']) {
        this.registrationForm.patchValue({ tripId: Number(params['tripId']) });
      } else {
        this.registrationForm.get('tripId')?.enable();
      }
    });

    this.loadTrips();

    this.interestService.getAllInterests().subscribe({
      next: (res: any) => {
        const interests = res?.data || res || [];
        this.availableInterests = interests
          .filter((i: any) => i.active === 'A');
      }
    });
  }

  loadRegistrationData(id: number): void {
    this.registrationService.getRegistrationById(id).subscribe({
      next: (res: any) => {
        const reg = res.data ? res.data : res;
        this.registrationForm.patchValue({
          tripId: reg.tripId,
          remark: reg.remark,
          interests: reg.interests ? reg.interests.map((i: any) => i.id || i.interestId || i) : []
        });
      },
      error: (err) => console.error('Failed to load registration', err)
    });
  }

  loadTrips(): void {
    this.tripService.getAllTrips().subscribe({
      next: (res: any) => {
        this.availableTrips = res?.data || res || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load trips', err)
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.getRawValue();

      const requestPayload: TripRegistrationRequestDTO = {
        remark: formValue.remark,
        interestIds: formValue.interests || [],
        status: 'REGISTERED'
      };

      if (this.registrationId) {
        this.registrationService.updateRegistration(this.registrationId, requestPayload).subscribe({
          next: () => {
            alert('แก้ไขใบสมัครสำเร็จ');
            this.router.navigate(['/my-registrations']);
          },
          error: (err) => {
            console.error('Update failed', err);
            alert('เกิดข้อผิดพลาดในการแก้ไขใบสมัคร');
          }
        });
      } else {
        this.registrationService.registerTrip(formValue.tripId, requestPayload).subscribe({
          next: () => {
            alert('ส่งใบสมัครสำเร็จ');
            this.router.navigate(['/my-registrations']);
          },
          error: (err) => {
            console.error('Registration failed', err);
            alert('เกิดข้อผิดพลาดในการสมัคร');
          }
        });
      }
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    const tripId = this.registrationForm.getRawValue().tripId;
    if (tripId) {
      this.router.navigate(['/trips', tripId, 'detail']);
    } else {
      this.router.navigate(['/trips']);
    }
  }

}
