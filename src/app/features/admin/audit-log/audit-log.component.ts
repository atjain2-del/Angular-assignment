import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>System Audit Trail</h2>
    <p>Traceability across Orders, Payments, and Fulfilment.</p>

    <div class="timeline">
      <div *ngFor="let log of logs$ | async" class="timeline-item">
        <div class="time">
          {{ log.timestamp | date:'mediumTime' }}<br>
          <small>{{ log.timestamp | date:'mediumDate' }}</small>
        </div>
        <div class="marker"></div>
        <div class="content">
          <h4>{{ log.action }} <span class="actor">by {{ log.actor }}</span></h4>
          <p>{{ log.details }}</p>
          <small>Correlation ID: {{ log.correlationId }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline { padding: 20px 0; max-width: 800px; }
    .timeline-item { display: flex; padding-bottom: 30px; }
    .time { width: 120px; text-align: right; padding-right: 20px; color: #5f6368; font-size: 14px; }
    .marker { width: 12px; height: 12px; background: #1a73e8; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px #1a73e8; margin-top: 5px; z-index: 1; }
    .timeline-item:not(:last-child) .marker::after { content: ''; position: absolute; width: 2px; height: 100%; background: #e0e0e0; margin-left: 5px; margin-top: 10px; z-index: -1; }
    .content { padding-left: 20px; flex: 1; }
    .content h4 { margin: 0 0 5px 0; color: #202124; }
    .actor { font-weight: normal; color: #5f6368; font-size: 14px; }
    .content p { margin: 0; color: #3c4043; }
    .content small { display: block; margin-top: 5px; color: #9aa0a6; font-family: monospace; }
  `]
})
export class AuditLogComponent {
  logs$ = inject(AdminService).getAuditLogs();
}
