import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product, CartItem } from '../models/commerce.models';

@Injectable({ providedIn: 'root' })
export class CommerceService {
  // --- MOCK DATA WITH IMAGES ---
  private products: Product[] = [
    { 
      sku: 'sku-1', 
      name: 'Premium Wireless Headphones', 
      category: 'Electronics', 
      price: 299, 
      inStock: true, 
      description: 'Noise cancelling.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      sku: 'sku-2', 
      name: 'Ergonomic Office Chair', 
      category: 'Furniture', 
      price: 150, 
      inStock: true, 
      description: 'Comfortable for long hours.',
      image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      sku: 'sku-3', 
      name: 'Mechanical Keyboard', 
      category: 'Electronics', 
      price: 89, 
      inStock: false, 
      description: 'Tactile switches.',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      sku: 'sku-4', 
      name: 'Smartphone Stand', 
      category: 'Accessories', 
      price: 15, 
      inStock: true, 
      description: 'Aluminum alloy.',
      image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&w=600&q=80' 
    }
  ];

  // --- CART STATE (Local-First) ---
  cartItems = signal<CartItem[]>([]);
  cartTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('cart');
    if (saved) this.cartItems.set(JSON.parse(saved));
  }

  // --- CATALOG (READ MODEL) ---
  getProducts(query: string = ''): Observable<Product[]> {
    const filtered = this.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(500));
  }

  getProduct(sku: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.sku === sku)).pipe(delay(300));
  }

  // --- CART ACTIONS ---
  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.sku === product.sku);
      if (existing) {
        existing.quantity++;
        return [...items];
      }
      return [...items, { ...product, quantity: 1 }];
    });
    this.syncCart();
  }

  removeFromCart(sku: string) {
    this.cartItems.update(items => items.filter(i => i.sku !== sku));
    this.syncCart();
  }

  clearCart() {
    this.cartItems.set([]);
    this.syncCart();
  }

  private syncCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  // --- CHECKOUT & PAY ---
  placeOrder(orderData: any, idempotencyKey: string): Observable<{ orderId: string }> {
    return of({ orderId: 'ORD-' + Math.floor(Math.random() * 10000) }).pipe(delay(1500));
  }

  processPayment(paymentData: any, idempotencyKey: string): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(1500));
  }
}
