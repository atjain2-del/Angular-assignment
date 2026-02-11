import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommerceService } from '../../../core/services/commerce.service';
import { Product } from '../../../core/models/commerce.models';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, startWith } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      
      <div class="catalog-header">
        <h2>Browse Products</h2>
        <div class="search-wrapper">
          <i class="material-icons search-icon">search</i>
          <input [formControl]="searchControl" placeholder="Search for items..." class="search-input">
          <div *ngIf="isLoading" class="spinner"></div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-banner">
        {{ errorMessage }} <button (click)="retry()">Retry</button>
      </div>

      <div *ngIf="(products$ | async)?.length === 0 && !isLoading && !errorMessage" class="empty-state">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="No products found" width="200">
        <p>No products found matching your search.</p>
        <button (click)="retry()" class="btn-secondary">Clear Search</button>
      </div>

      <div class="product-grid">
        <div *ngFor="let product of products$ | async" class="product-card">
          
          <div class="img-container">
            <img [src]="product.image" [alt]="product.name" class="product-img">
            <span *ngIf="!product.inStock" class="badge-overlay">Out of Stock</span>
          </div>
          
          <div class="card-body">
            <h3 class="p-title">{{ product.name }}</h3>
            <p class="p-category">{{ product.category }}</p>
            <div class="p-price">\${{ product.price }}</div>
            
            <div class="actions">
              <ng-container *ngIf="getQty(product.sku) === 0; else qtyControl">
                <button *ngIf="product.inStock" (click)="addToCart(product)" class="btn-add">
                  <i class="material-icons icon-sm">add_shopping_cart</i> Add
                </button>
                <button *ngIf="!product.inStock" disabled class="btn-disabled">Unavailable</button>
              </ng-container>

              <ng-template #qtyControl>
                <div class="qty-selector">
                  <button (click)="decrease(product.sku)" class="qty-btn">
                    <i class="material-icons icon-xs">remove</i>
                  </button>
                  <span class="qty-val">{{ getQty(product.sku) }}</span>
                  <button (click)="addToCart(product)" class="qty-btn">
                    <i class="material-icons icon-xs">add</i>
                  </button>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-header { margin-bottom: 30px; text-align: center; }
    
    .search-wrapper { position: relative; max-width: 500px; margin: 0 auto; }
    .search-icon { position: absolute; left: 15px; top: 12px; color: #999; }
    .search-input { width: 100%; padding: 14px 20px 14px 45px; border-radius: 30px; border: 1px solid #dfe1e5; box-shadow: 0 1px 6px rgba(32,33,36,0.18); font-size: 16px; box-sizing: border-box; }
    .search-input:focus { box-shadow: 0 1px 6px rgba(32,33,36,0.28); border-color: transparent; outline: none; }
    
    .spinner { position: absolute; right: 15px; top: 15px; width: 16px; height: 16px; border: 2px solid #ddd; border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    
    .product-card { 
      background: white; border-radius: 12px; overflow: hidden; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #eee;
      display: flex; flex-direction: column;
    }
    .product-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    
    .img-container { height: 180px; overflow: hidden; position: relative; background: #f1f3f4; }
    .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .product-card:hover .product-img { transform: scale(1.05); }
    .badge-overlay { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

    .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
    .p-title { margin: 0 0 5px 0; font-size: 18px; font-weight: 500; color: #202124; }
    .p-category { color: #5f6368; font-size: 13px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .p-price { font-size: 18px; font-weight: bold; color: #1a73e8; margin-bottom: 15px; }
    
    .actions { margin-top: auto; }
    .btn-add { width: 100%; padding: 10px; border-radius: 20px; background: white; border: 1px solid #dadce0; color: #1a73e8; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-add:hover { background: #e8f0fe; border-color: #1a73e8; }
    .btn-disabled { width: 100%; padding: 10px; background: #eee; border: none; color: #999; border-radius: 20px; cursor: not-allowed; }

    .qty-selector { display: flex; align-items: center; justify-content: space-between; background: #f1f3f4; border-radius: 20px; padding: 4px; }
    .qty-btn { width: 32px; height: 32px; border-radius: 50%; background: white; color: #1a73e8; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border:none; cursor: pointer; }
    .qty-val { font-weight: bold; color: #3c4043; }

    .icon-sm { font-size: 18px; margin-right: 5px; }
    .icon-xs { font-size: 16px; }
    
    .empty-state { text-align: center; margin-top: 40px; }
    .empty-state p { color: #5f6368; margin: 10px 0 20px; }
  `]
})
export class ProductListComponent {
  commerceService = inject(CommerceService);
  searchControl = new FormControl('');
  isLoading = false;
  errorMessage = '';

  cartItems = this.commerceService.cartItems;

  products$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(query => {
      this.isLoading = true;
      this.errorMessage = '';
      return this.commerceService.getProducts(query || '').pipe(
        catchError(err => {
          this.isLoading = false;
          if (err.status === 429) this.errorMessage = "Too many requests.";
          return of([]);
        })
      );
    })
  );

  addToCart(p: Product) { this.commerceService.addToCart(p); }
  
  decrease(sku: string) { 
    const item = this.cartItems().find(i => i.sku === sku);
    if(item) {
         this.commerceService.removeFromCart(sku);
    }
  }

  getQty(sku: string): number {
    const item = this.cartItems().find(i => i.sku === sku);
    return item ? item.quantity : 0;
  }

  retry() {
    this.searchControl.setValue(this.searchControl.value);
  }
}
