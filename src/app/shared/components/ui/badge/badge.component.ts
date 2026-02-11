import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="variant">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .badge.success { background: #e6f4ea; color: #137333; } /* Delivered/Paid */
    .badge.warning { background: #fef7e0; color: #b06000; } /* Processing/Pending */
    .badge.danger { background: #fce8e6; color: #c5221f; }  /* Failed/Cancelled */
    .badge.neutral { background: #f1f3f4; color: #5f6368; } /* Default */
  `]
})
export class BadgeComponent {
  @Input() variant: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
}
