import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Admin Dashboard</h2>
    <div class="stats-grid">
      <div *ngFor="let stat of stats$ | async" class="card" [class.alert]="stat.alert">
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.label }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 5px solid #1a73e8; }
    .card.alert { border-left-color: #d93025; background: #fce8e6; }
    .card h3 { font-size: 32px; margin: 0 0 10px 0; }
    .card p { margin: 0; color: #5f6368; }
  `]
})
export class DashboardComponent {
  adminService = inject(AdminService);
  stats$ = this.adminService.getDashboardStats();
}
