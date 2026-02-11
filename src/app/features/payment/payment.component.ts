import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommerceService } from '../../core/services/commerce.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Payment for {{ orderId }}</h2>
      <p>Secure Payment Gateway Mock</p>
      
      <div class="card-mock">
        <label>Card Number</label>
        <div class="fake-input">**** **** **** 4242</div>
      </div>

      <button (click)="pay()" [disabled]="isProcessing" class="btn-pay">
        {{ isProcessing ? 'Authorizing...' : 'Pay Now' }}
      </button>
    </div>
  `,
  styles: [`
    .container { padding: 40px; text-align: center; max-width: 400px; margin: 0 auto; }
    .card-mock { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left; }
    .fake-input { background: white; padding: 10px; border: 1px solid #ddd; margin-top: 5px; }
    .btn-pay { width: 100%; background: #000; color: white; padding: 15px; border: none; border-radius: 8px; cursor: pointer; }
  `]
})
export class PaymentComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(CommerceService);
  
  orderId = '';
  isProcessing = false;
  paymentIdempotencyKey = crypto.randomUUID();

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
  }

  pay() {
    this.isProcessing = true;
    this.service.processPayment({ orderId: this.orderId }, this.paymentIdempotencyKey).subscribe(() => {
      this.service.clearCart();
      this.router.navigate(['/orders', this.orderId, 'track']);
    });
  }
}
