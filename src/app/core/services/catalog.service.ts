import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number; // 0 = Out of Stock
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  
  // Mock Database
  private products: Product[] = [
    { sku: 'sku-001', name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock: 15, image: '🎧', description: 'Noise cancelling headphones.' },
    { sku: 'sku-002', name: 'Ergonomic Mouse', category: 'Electronics', price: 49.99, stock: 0, image: '🖱️', description: 'Vertical mouse for health.' }, // Out of stock
    { sku: 'sku-003', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.50, stock: 5, image: '⌨️', description: 'Clicky blue switches.' },
    { sku: 'sku-004', name: 'USB-C Hub', category: 'Accessories', price: 35.00, stock: 100, image: '🔌', description: '7-in-1 multi-port adapter.' },
    { sku: 'sku-005', name: 'Laptop Stand', category: 'Accessories', price: 25.99, stock: 8, image: '💻', description: 'Aluminum foldable stand.' },
  ];

  // GET /catalog/items (Simulated)
  getProducts(query: string = ''): Observable<Product[]> {
    // Filter locally to mock a backend search
    const filtered = this.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(800)); // Simulate network latency
  }

  // GET /catalog/items/:sku
  getProductBySku(sku: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.sku === sku);
    return of(product).pipe(delay(500));
  }
}
