import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { delay, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { InterestService } from '../../../core/services/interest.service';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {

  userForm!: FormGroup;
  userId?: number;
  isLoading = false;

  roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Organizer', label: 'Organizer' },
    { value: 'Traveler', label: 'Traveler' }
  ];

  statuses = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
  ];

  attentions: { value: string, label: string }[] = [];

  private fb = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private cdr = inject(ChangeDetectorRef)
  private interestService = inject(InterestService)

  ngOnInit(): void {
    this.interestService.getAllInterests().subscribe({
      next: (res: any) => {
        const interests = res?.data || res || [];
        this.attentions = interests
          .filter((i: any) => i.active === 'A')
          .map((i: any) => ({ value: i.interestName, label: i.interestName }));
        this.cdr.detectChanges();
      }
    });

    this.initForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.userId = +id;
        this.loadUserData(this.userId);
      } else {
        this.isLoading = true;
        of(null).pipe(delay(300)).subscribe(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  private loadUserData(id: number): void {
    this.isLoading = true;
    this.userService.getUserById(id).pipe(delay(300)).subscribe({
      next: (response: any) => {
        const user = response.data || response;
        if (user) {
          this.userForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
            attention: user.attention
          });
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      attention: ['']
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.userId) {
        if (!formValue.password) {
          delete formValue.password;
        }
        this.userService.updateUser(this.userId, formValue).subscribe({
          next: () => {
            alert('อัปเดตข้อมูลผู้ใช้สำเร็จ!');
            this.cdr.detectChanges();
            this.router.navigate(['/users']);
          },
          error: (err) => {
            console.error('Update failed:', err);
            const backendError = err.error?.message || err.error?.error || err.message;
            alert(`ไม่สามารถอัปเดตข้อมูลได้\nสาเหตุ: ${backendError}`);
          }
        });
      } else {
        this.userService.saveUser(formValue).subscribe({
          next: (response) => {
            alert('บันทึกข้อมูลผู้ใช้สำเร็จ!');
            this.cdr.detectChanges();
            this.router.navigate(['/users']);
          },
          error: (err) => {
            console.error('Save failed:', err);
            const backendError = err.error?.message || err.error?.error || err.message;
            alert(`ไม่สามารถบันทึกข้อมูลได้\nสาเหตุ: ${backendError}`);
          }
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
