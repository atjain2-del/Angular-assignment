import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { CatalogService, Product } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="catalog-container">
      <header class="catalog-header">
        <h2>Marketplace</h2>
        <div class="search-box">
          <input 
            [formControl]="searchControl" 
            placeholder="Search products..." 
            type="text" 
          />
          <span *ngIf="isLoading()" class="loader">⏳</span>
        </div>
        
        <a routerLink="/cart" class="cart-link">
          🛒 Cart ({{ cartService.totalItems() }})
        </a>
      </header>

      <div class="facets">
        <span class="badge active">All</span>
        <span class="badge">Electronics</span>
        <span class="badge">Accessories</span>
      </div>

      <div *ngIf="errorMessage()" class="error-banner">
        {{ errorMessage() }} <button (click)="retry()">Try Again</button>
      </div>

      <div class="product-grid" *ngIf="!errorMessage()">
        <div *ngFor="let product of products()" class="product-card">
          <div class="product-image">{{ product.image }}</div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="sku">SKU: {{ product.sku }}</p>
            <div class="price-row">
              <span class="price">\${{ product.price }}</span>
              
              <span *ngIf="product.stock === 0" class="out-of-stock">Out of Stock</span>
            </div>
          </div>
          
          <div class="actions">
            <button 
              class="btn-sm" 
              [routerLink]="['/catalog', product.sku]">
              Details
            </button>
            <button 
              class="btn-primary-sm" 
              [disabled]="product.stock === 0"
              (click)="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    .catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    
    .search-box { position: relative; width: 50%; }
    .search-box input { width: 100%; padding: 10px; border-radius: 20px; border: 1px solid #ddd; }
    .loader { position: absolute; right: 10px; top: 10px; }

    .facets { display: flex; gap: 10px; margin-bottom: 2rem; }
    .badge { padding: 5px 15px; background: #e8eaed; border-radius: 16px; font-size: 0.9rem; cursor: pointer; }
    .badge.active { background: var(--primary-color); color: white; }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .product-card { background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
    .product-image { font-size: 3rem; text-align: center; margin-bottom: 1rem; background: #f8f9fa; border-radius: 4px; }
    
    .price-row { display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0; }
    .price { font-weight: bold; color: var(--text-main); }
    .out-of-stock { color: var(--error-color); font-size: 0.8rem; font-weight: bold; background: #fce8e6; padding: 2px 6px; border-radius: 4px; }
    .sku { color: var(--text-muted); font-size: 0.8rem; }

    .actions { display: flex; gap: 10px; margin-top: auto; }
    .btn-sm { flex: 1; padding: 8px; border: 1px solid #dadce0; background: white; border-radius: 4px; cursor: pointer; }
    .btn-primary-sm { flex: 1; padding: 8px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary-sm:disabled { background: #dadce0; cursor: not-allowed; }
    
    .cart-link { text-decoration: none; color: var(--accent-color); font-weight: bold; }
  `]
})
export class CatalogComponent implements OnInit {
  private catalogService = inject(CatalogService);
  public cartService = inject(CartService);

  searchControl = new FormControl('');
  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    // Initial Load
    this.loadProducts();

    // Setup Search Debounce (RxJS Pipe)
    this.searchControl.valueChanges.pipe(
      debounceTime(400),        // Wait 400ms after user stops typing
      distinctUntilChanged()    // Only search if value actually changed
    ).subscribe(val => {
      this.loadProducts(val || '');
    });
  }

  loadProducts(query: string = '') {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.catalogService.getProducts(query).subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load products. Please check your connection.');
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  retry() {
    this.loadProducts(this.searchControl.value || '');
  }
}