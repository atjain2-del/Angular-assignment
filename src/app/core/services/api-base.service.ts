import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.cashly.mock/v1'; // Central config

  // Generic GET
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      retry(1), // Retry once on network failure
      catchError(this.handleError)
    );
  }

  // Generic POST (Command)
  post<T>(endpoint: string, data: any, options: { idempotencyKey?: string } = {}): Observable<T> {
    let headers = new HttpHeaders();
    if (options.idempotencyKey) {
      headers = headers.set('Idempotency-Key', options.idempotencyKey);
    }

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Consistent Error Handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    
    // Check for Correlation ID from Interceptor
    const correlationId = error.headers?.get('X-Correlation-ID') || 'N/A';

    if (error.status === 403) {
      errorMessage = `Access Denied. You do not have permission. (Ref: ${correlationId})`;
    } else if (error.status === 429) {
      errorMessage = `Too many requests. Please wait a moment. (Ref: ${correlationId})`;
    } else if (error.status === 401) {
      errorMessage = `Session expired. Please login again.`;
    }

    console.error(`[API Error] ${errorMessage}`, error);
    // Return standard error format to components
    return throwError(() => ({ message: errorMessage, status: error.status, correlationId }));
  }
}
