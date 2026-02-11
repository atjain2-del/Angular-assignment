import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Payment & Refunds</h2>
    
    <div class="card">
      <h3>Process Refund</h3>
      <form [formGroup]="refundForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Payment / Order ID</label>
          <input formControlName="paymentId" placeholder="e.g. PAY-8832">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Amount ($)</label>
            <input type="number" formControlName="amount">
          </div>
          <div class="form-group">
            <label>Reason Code</label>
            <select formControlName="reason">
              <option value="R01">Customer Return</option>
              <option value="R02">Item Damaged</option>
              <option value="R03">Fraudulent Charge</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Audit Notes (Required)</label>
          <textarea formControlName="notes" rows="3"></textarea>
        </div>

        <button type="submit" class="btn-danger" [disabled]="refundForm.invalid || isProcessing">
          {{ isProcessing ? 'Processing...' : 'Issue Refund' }}
        </button>

        <p *ngIf="successMessage" class="success-msg">{{ successMessage }}</p>
      </form>
    </div>
  `,
  styles: [`
    .card { background: white; padding: 30px; border-radius: 8px; max-width: 500px; }
    .form-group { margin-bottom: 15px; }
    .form-row { display: flex; gap: 15px; }
    .form-row .form-group { flex: 1; }
    input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .btn-danger { background: #d93025; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; }
    .btn-danger:disabled { background: #e0e0e0; cursor: not-allowed; }
    .success-msg { color: #137333; margin-top: 15px; font-weight: bold; }
  `]
})
export class RefundsComponent {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  isProcessing = false;
  successMessage = '';

  refundForm = this.fb.group({
    paymentId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    reason: ['R01', Validators.required],
    notes: ['', Validators.required]
  });

  onSubmit() {
    if (this.refundForm.invalid) return;
    this.isProcessing = true;
    
    const { paymentId, amount, reason } = this.refundForm.value;
    
    this.adminService.processRefund(paymentId!, amount!, reason!).subscribe(() => {
      this.isProcessing = false;
      this.successMessage = `Refund of $${amount} processed successfully. ID: ${crypto.randomUUID().slice(0,8)}`;
      this.refundForm.reset();
    });
  }
}
