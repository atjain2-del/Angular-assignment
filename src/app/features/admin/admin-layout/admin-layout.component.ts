import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="admin-shell">
      <aside class="sidebar">
        <h3>Cashly Admin</h3>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/admin/payments" routerLinkActive="active">Payments & Refunds</a>
          <a routerLink="/admin/audit" routerLinkActive="active">Audit Trail</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-shell { display: flex; min-height: 100vh; }
    .sidebar { width: 250px; background: #202124; color: white; padding: 20px; }
    .sidebar h3 { margin-bottom: 30px; color: #1a73e8; }
    .sidebar a { display: block; color: #9aa0a6; text-decoration: none; padding: 10px 0; font-size: 16px; }
    .sidebar a.active { color: white; font-weight: bold; }
    .content { flex: 1; padding: 30px; background: #f8f9fa; }
  `]
})
export class AdminLayoutComponent {}
