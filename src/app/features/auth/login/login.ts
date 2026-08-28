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
import { jwtDecode } from 'jwt-decode';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    if (this.loginForm.valid) {
      localStorage.removeItem('token');
      this.errorMessage = '';
      this.isLoading = true;

      const payload = this.loginForm.value;

      this.authService.login(payload).subscribe({
        next: (response: any) => {
          let token = '';
          let userData: any = {};

          if (typeof response === 'string') {
            token = response;
          } else if (response && response.token) {
            token = response.token;
          } else if (response && response.data && response.data.token) {
            token = response.data.token;
            userData = response.data;
          } else if (response && response.success === true && response.data) {
            token = response.data; // sometimes data itself is token
          }

          if (token) {
            try {
              const decodedToken: any = jwtDecode(token);
              const userRole = decodedToken.role || userData?.role || 'USER';
              const userStatus = userData?.status || 'A'; // default to A if backend doesn't provide status

              if (userStatus === 'A') {
                console.log('Login สำเร็จ');
                localStorage.setItem('token', token);
                localStorage.setItem('role', userRole);
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
              } else {
                this.isLoading = false;
                alert('บัญชีผู้ใช้ของคุณยังไม่ได้รับการอนุมัติ');
              }
            } catch (error) {
              console.error('Invalid token format', error);
              this.isLoading = false;
              alert('เซสชันไม่ถูกต้อง กรุณาล็อกอินใหม่');
            }
          } else {
            this.isLoading = false;
            alert('ล็อกอินสำเร็จแต่ไม่พบ Token');
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
        },
      });
    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน!');
      this.loginForm.markAllAsTouched();
    }
  }
}
