import { Injectable, computed, signal } from '@angular/core';
import { Product } from './catalog.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // The Source of Truth
  private cartItems = signal<CartItem[]>([]);

  // Computed Values (Auto-update when cartItems change)
  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  
  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.sku === product.sku);
      if (existing) {
        // If exists, increment quantity
        return items.map(i => i.product.sku === product.sku 
          ? { ...i, quantity: i.quantity + 1 } 
          : i);
      }
      // Else add new
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(sku: string) {
    this.cartItems.update(items => items.filter(i => i.product.sku !== sku));
  }

  updateQuantity(sku: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(sku);
      return;
    }
    this.cartItems.update(items => items.map(i => 
      i.product.sku === sku ? { ...i, quantity } : i
    ));
  }

  getItems() {
    return this.cartItems.asReadonly();
  }
  
  clearCart() {
    this.cartItems.set([]);
  }
}
