import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // If the request already carries its own Authorization header (e.g. employee portal),
  // forward it directly but still catch 401s to redirect to login.
  if (req.headers.has('Authorization')) {
    return next(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          localStorage.removeItem('employeeToken');
          router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  const token = localStorage.getItem('accounteezy_token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
