import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, delay, catchError, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to hold current user state
  currentUser = signal<User | null>(null);

  // Mock API URL
  private apiUrl = 'https://api.cashly.mock/v1'; 

  constructor(private http: HttpClient, private router: Router) {}

  // 1. Session Bootstrap: Rehydrate user on refresh
  me(): Observable<User> {
    // MOCK: Simulating a backend call to /me
    const mockUser: User = { id: '123', email: 'test@cashly.com', role: 'customer', name: 'Atishay Jain' };
    
    // In real app: return this.http.get<User>(`${this.apiUrl}/me`)...
    return of(mockUser).pipe(
      delay(500), // Simulate network latency
      tap(user => this.currentUser.set(user)),
      catchError(err => {
        this.currentUser.set(null);
        return throwError(() => err);
      })
    );
  }

  // 2. Login
  login(credentials: any): Observable<any> {
    // MOCK: logic
    if (credentials.email === 'lock@test.com') {
      return throwError(() => ({ status: 423, message: 'Account Locked' }));
    }
    
    const role = credentials.email.includes('admin') ? 'admin' : 'customer';
    const mockResponse = {
      token: 'fake-jwt-token-123',
      user: { id: '1', email: credentials.email, role, name: 'User' }
    };

    return of(mockResponse).pipe(
      delay(800),
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user as any);
        this.redirectBasedOnRole(res.user.role);
      })
    );
  }

  // 3. Register (Customer Only)
  register(data: any): Observable<any> {
    return of({ success: true }).pipe(delay(800));
  }

  // 4. Logout
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/catalog']); // Customer landing
    }
  }
}
