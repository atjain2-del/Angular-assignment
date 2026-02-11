import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card">
        <h2>Create Cashly Account</h2>
        <p style="color: #5f6368; font-size: 14px;">Customer Registration</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password">
          </div>

          <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <a routerLink="/login" class="link-text" style="display:block; margin-top:20px;">
          Already have an account? Sign in
        </a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Account created! Please login.');
        this.router.navigate(['/login']);
      },
      error: () => this.isLoading = false
    });
  }
}
