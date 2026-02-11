import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Helper to generate UUID for Correlation ID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const correlationId = generateUUID();

  // Clone request to add headers
  const authReq = req.clone({
    setHeaders: {
      'Authorization': token ? `Bearer ${token}` : '',
      'X-Correlation-ID': correlationId
    }
  });

  return next(authReq).pipe(
    catchError(error => {
      // Attach Correlation ID to error object for UI display
      error.correlationId = correlationId;

      if (error.status === 401) {
        // Token expired/invalid
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      if (error.status === 403) {
        router.navigate(['/access-denied']);
      }
      return throwError(() => error);
    })
  );
};
