import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="auth-container">
      <div class="card">
        <h2 style="color: #d93025">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <a routerLink="/login" class="btn-primary" style="display:inline-block; text-decoration:none;">Go Back</a>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {}
