import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  // จำลองการ Login
  login(email: string, password: string): Observable<boolean> {
    // กำหนด Mock Username/Password
    if (email === 'admin@gmail.com' && password === 'password123') {
      // เช็คว่าทำงานบน Browser ถึงจะบันทึก Token
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', 'mock-jwt-token-12345');
      }
      return of(true).pipe(delay(1000));
    }
    // ถ้าพิมพ์ผิดให้ส่ง Error กลับไป
    return throwError(() => new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'));
  }

  // ฟังก์ชันออกจากระบบ
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  // เช็คว่าเข้าสู่ระบบอยู่หรือไม่
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}