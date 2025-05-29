import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log('Auth Interceptor - Request URL:', req.url);
  console.log('Auth Interceptor - Token present:', !!token);

  req = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  if (token) {
    console.log('Auth Interceptor - Adding token to headers');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Auth Interceptor - Error:', error.status, error.message);
      if (error.status === 401) {
        console.log('Auth Interceptor - Unauthorized, logging out');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}; 