import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../enviroment/environment';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EMPTY } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  if (!isPlatformBrowser(platformId) && isApiUrl) {
    return EMPTY;
  }

  let token = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
  }

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);

};