import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface User { id: string; name: string; email: string; role: 'customer' | 'admin'; token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);

  login(credentials: {email: string; password: string}): Observable<User> {
    return timer(800).pipe( // Simulate network delay
      switchMap((): Observable<User> => {
        if (credentials.email === 'user@cashly.com' && credentials.password === 'user123') {
          return of({ id: 'u1', name: 'John Doe', email: 'user@cashly.com', role: 'customer', token: 'fake-jwt-token' });
        }
        return throwError(() => new Error('Invalid credentials'));
      }),
      tap(user => {
        localStorage.setItem('token', user.token);
        this.currentUser.set(user);
        this.router.navigate(['/catalog']);
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getMe() {
    // Mock session restore
    const token = localStorage.getItem('token');
    if (token) {
      const user = { id: 'u1', name: 'John Doe', email: 'user@cashly.com', role: 'customer', token };
      this.currentUser.set(user as User);
      return of(user);
    }
    return of(null);
  }
}
