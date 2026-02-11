import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      
      <div class="visual-panel">
        <div class="brand-overlay">
          <div class="brand-content">
            <h1>Cashly</h1>
            <p>The seamless order-to-cash experience.</p>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-container">
          
          <h2 class="mobile-brand">Cashly</h2>

          <div class="header-text">
            <h2>Welcome back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            <i class="icon">error_outline</i>
            <span>{{ errorMessage }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="name@company.com">
            </div>
            
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="••••••••">
            </div>

            <div class="form-actions">
              <a href="#" class="forgot-pass">Forgot password?</a>
            </div>

            <button type="submit" class="btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="footer-text">
            Don't have an account? 
            <a routerLink="/register">Create customer account</a>
          </div>
          
          <div class="debug-hint">
            <small>(Try: <b>admin@test.com</b> or <b>user@test.com</b>)</small>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    .login-wrapper {
      display: flex;
      min-height: 100vh;
      width: 100%;
      background: white;
    }

    /* Left Panel (Image) */
    .visual-panel {
      flex: 1; /* Takes up remaining space */
      background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      position: relative;
      display: none; /* Hidden on mobile by default */
    }

    /* Dark Blue Overlay on Image */
    .brand-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(26, 115, 232, 0.9), rgba(21, 87, 176, 0.8));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-content { text-align: center; }
    .brand-content h1 { font-size: 48px; margin: 0; font-weight: 700; letter-spacing: -1px; }
    .brand-content p { font-size: 18px; opacity: 0.9; margin-top: 10px; font-weight: 300; }

    /* Right Panel (Form) */
    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      max-width: 600px; /* Prevent form from getting too wide on huge screens */
      background: white;
    }

    .form-container {
      width: 100%;
      max-width: 380px; /* Standard form width */
    }

    /* Typography */
    .header-text { margin-bottom: 30px; text-align: left; }
    .header-text h2 { font-size: 28px; font-weight: 700; color: #202124; margin: 0 0 8px 0; }
    .header-text p { color: #5f6368; margin: 0; }

    .mobile-brand { display: none; color: #1a73e8; margin-bottom: 20px; font-size: 24px; font-weight: bold; }

    /* Form Elements */
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 500; color: #3c4043; margin-bottom: 6px; }
    
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #dadce0;
      border-radius: 8px; /* Rounded inputs */
      font-size: 15px;
      transition: all 0.2s;
      background-color: #f8f9fa;
    }
    input:focus {
      background-color: white;
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      outline: none;
    }

    .form-actions { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .forgot-pass { color: #1a73e8; text-decoration: none; font-size: 13px; font-weight: 500; }

    .btn-block { width: 100%; padding: 12px; font-size: 15px; border-radius: 24px; box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3); }
    .btn-block:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(26, 115, 232, 0.4); }

    /* Footer & Extras */
    .footer-text { margin-top: 24px; text-align: center; font-size: 14px; color: #5f6368; }
    .footer-text a { color: #1a73e8; text-decoration: none; font-weight: 500; }
    
    .debug-hint { text-align: center; margin-top: 30px; color: #9aa0a6; opacity: 0.6; }

    /* Alerts */
    .error-banner {
      background: #fce8e6; color: #d93025; padding: 12px; border-radius: 8px;
      margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; gap: 10px;
    }
    .icon { font-family: 'Material Icons', sans-serif; font-style: normal; }

    /* Responsive Breakpoints */
    @media (min-width: 900px) {
      .visual-panel { display: block; } /* Show image on desktop */
    }

    @media (max-width: 899px) {
      .mobile-brand { display: block; text-align: center; }
      .header-text { text-align: center; }
      .form-panel { max-width: 100%; }
    }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Redirection handled in service
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 423) {
          this.errorMessage = 'Account is locked. Contact Admin.';
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      }
    });
  }
}
