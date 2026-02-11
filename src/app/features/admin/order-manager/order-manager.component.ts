import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Order Management</h2>
    
    <div class="search-box">
      <input type="text" placeholder="Search by Order ID, Customer or Email...">
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let order of orders$ | async">
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.date | date:'short' }}</td>
          <td>
            <span class="badge" [ngClass]="order.status.toLowerCase()">{{ order.status }}</span>
          </td>
          <td>\${{ order.total }}</td>
          <td>
            <button class="btn-sm">View 360</button>
            <button class="btn-sm" *ngIf="order.status === 'Processing'">Hold</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .search-box input { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; }
    .data-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .badge.processing { background: #e8f0fe; color: #1a73e8; }
    .badge.shipped { background: #e6f4ea; color: #137333; }
    .badge.held { background: #fce8e6; color: #d93025; }
    .btn-sm { margin-right: 5px; padding: 4px 8px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px; }
  `]
})
export class OrderManagerComponent {
  orders$ = inject(AdminService).getOrders();
}
