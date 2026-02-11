import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommerceService } from '../../core/services/commerce.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Checkout</h2>
      
      <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
        <section>
          <h3>Shipping Address</h3>
          <input formControlName="address" placeholder="Street Address">
          <input formControlName="city" placeholder="City">
          <input formControlName="zip" placeholder="Zip Code">
        </section>

        <section>
          <h3>Review Order</h3>
          <p>Total Items: {{ service.cartItems().length }}</p>
          <p><strong>Total to Pay: \${{ service.cartTotal() }}</strong></p>
        </section>

        <button type="submit" [disabled]="isProcessing || checkoutForm.invalid" class="btn-pay">
          {{ isProcessing ? 'Processing...' : 'Place Order' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 500px; margin: 0 auto; }
    input { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .btn-pay { width: 100%; padding: 15px; background: #1a73e8; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
    .btn-pay:disabled { background: #ccc; }
  `]
})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  service = inject(CommerceService);
  router = inject(Router);
  
  isProcessing = false;
  // Generate Idempotency Key once per component load
  idempotencyKey = crypto.randomUUID(); 

  checkoutForm = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required]
  });

  onSubmit() {
    if (this.checkoutForm.invalid) return;
    this.isProcessing = true;

    // Command: Place Order
    this.service.placeOrder(this.checkoutForm.value, this.idempotencyKey).subscribe({
      next: (res) => {
        // Navigate to Payment
        this.router.navigate(['/payment', res.orderId]);
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Order failed. Please try again.');
      }
    });
  }
}
