import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h2>Your Cart</h2>

      <div *ngIf="cartItems().length === 0" class="empty-state">
        <p>Your cart is empty.</p>
        <a routerLink="/catalog" class="btn-link">Browse Products</a>
      </div>

      <div *ngIf="cartItems().length > 0">
        <div class="cart-item" *ngFor="let item of cartItems()">
          <div class="item-info">
            <span class="item-name">{{ item.product.name }}</span>
            <span class="item-price">\${{ item.product.price }}</span>
          </div>
          
          <div class="item-controls">
            <button (click)="decrease(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button (click)="increase(item)">+</button>
            <button class="remove-btn" (click)="remove(item)">Remove</button>
          </div>
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>\${{ cartService.totalPrice() | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping Estimate</span>
            <span>Free</span>
          </div>
          <hr>
          <div class="summary-row total">
            <span>Total</span>
            <span>\${{ cartService.totalPrice() | number:'1.2-2' }}</span>
          </div>

          <button class="btn-checkout" routerLink="/checkout">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container { max-width: 600px; margin: 2rem auto; padding: 1rem; background: white; border-radius: 8px; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee; }
    .item-controls { display: flex; align-items: center; gap: 10px; }
    .item-controls button { width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px; }
    .remove-btn { width: auto !important; padding: 0 10px; color: var(--error-color); border-color: var(--error-color) !important; }
    
    .summary { margin-top: 2rem; background: #f8f9fa; padding: 1rem; border-radius: 8px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .total { font-weight: bold; font-size: 1.2rem; }
    
    .btn-checkout { width: 100%; padding: 15px; background: var(--accent-color); color: white; border: none; border-radius: 24px; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
    .btn-checkout:hover { background: var(--accent-hover); }
    .btn-link { color: var(--accent-color); text-decoration: none; }
  `]
})
export class CartComponent {
  public cartService = inject(CartService);
  cartItems = this.cartService.getItems();

  increase(item: any) {
    this.cartService.updateQuantity(item.product.sku, item.quantity + 1);
  }

  decrease(item: any) {
    this.cartService.updateQuantity(item.product.sku, item.quantity - 1);
  }

  remove(item: any) {
    this.cartService.removeFromCart(item.product.sku);
  }
}
