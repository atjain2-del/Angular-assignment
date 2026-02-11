import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommerceService } from '../../core/services/commerce.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Your Cart</h2>
      
      <div *ngIf="cartItems().length === 0">
        <p>Your cart is empty.</p>
        <a routerLink="/catalog">Go Shopping</a>
      </div>

      <div *ngFor="let item of cartItems()" class="cart-item">
        <div>
          <h4>{{ item.name }}</h4>
          <small>{{ item.sku }}</small>
        </div>
        <div class="qty">
           x {{ item.quantity }}
        </div>
        <div class="price">
          \${{ item.price * item.quantity }}
        </div>
        <button (click)="remove(item.sku)" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
      </div>

      <div class="summary" *ngIf="cartItems().length > 0">
        <h3>Total: \${{ total() }}</h3>
        <p style="color:green">Shipping Estimate: FREE</p>
        <a routerLink="/checkout" class="btn-checkout">Proceed to Checkout</a>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
    .btn-checkout { display: block; background: #1a73e8; color: white; text-align: center; padding: 15px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
  `]
})
export class CartComponent {
  service = inject(CommerceService);
  cartItems = this.service.cartItems;
  total = this.service.cartTotal;

  remove(sku: string) {
    this.service.removeFromCart(sku);
  }
}
