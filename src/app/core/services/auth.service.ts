import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. นำเอา hasToken() มาใช้ตอนเซ็ตค่าเริ่มต้นเลยครับ
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // 2. ใช้ฟังก์ชัน hasToken ตัวนี้ครับ
  private hasToken(): boolean {
    // ต้องเช็คว่าเป็นเบราว์เซอร์ก่อนเสมอ เพราะถ้าไม่มีเช็คตัวนี้ จะทำให้พังเหมือนเดิม
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false; 
  }

  // ฟังก์ชันจำลองการเข้าสู่ระบบ
  login(email: string, password: string): Observable<any> {
    return of({ token: 'mock-jwt-token-12345', user: { email, role: 'Organizer' } }).pipe(
      delay(800), 
      tap(response => {
        if (email && password) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  // ฟังก์ชันออกจากระบบ
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}