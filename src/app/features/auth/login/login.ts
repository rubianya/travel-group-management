import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    if (this.loginForm.valid) {
      localStorage.removeItem('token');
      this.errorMessage = '';
      this.isLoading = true;

      const payload = this.loginForm.value;

      this.authService.login(payload).subscribe({
        next: (response: LoginResponse) => {
          if (response && response.success && response.data) {
            const userData = response.data;

            if (userData.status === 'A') {
              console.log('Login สำเร็จ');
              localStorage.setItem('token', userData.token);
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            } else {
              this.isLoading = false;
              alert('บัญชีผู้ใช้ของคุณยังไม่ได้รับการอนุมัติ');
            }
          }
        },
        error: (error) => {
          console.error('Login ล้มเหลว', error);
          if (error.status === 403) {
            alert('เซสชันหมดอายุ หรือไม่มีสิทธิ์เข้าถึง กรุณาล็อกอินใหม่');
          } else {
            this.isLoading = false;
            this.errorMessage = error.message || 'โปรดกรอกอีเมลและรหัสผ่านให้ถูกต้อง';
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          }
        }
      });

    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน!');
      this.loginForm.markAllAsTouched();
    }
  }
}