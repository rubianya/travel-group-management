import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
          return true; 
      }
      alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
  }

  router.navigate(['/login']);
  return false;
      
};