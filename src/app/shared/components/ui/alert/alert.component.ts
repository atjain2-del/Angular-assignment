import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert" [ngClass]="type">
      <strong>{{ type | titlecase }}:</strong> {{ message }}
      <button (click)="message = ''" class="close-btn">×</button>
    </div>
  `,
  styles: [`
    .alert { padding: 12px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
    .success { background: #e6f4ea; color: #137333; border: 1px solid #ceead6; }
    .error { background: #fce8e6; color: #c5221f; border: 1px solid #fad2cf; }
    .info { background: #e8f0fe; color: #1a73e8; border: 1px solid #d2e3fc; }
    .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: inherit; }
  `]
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() message = '';
}
