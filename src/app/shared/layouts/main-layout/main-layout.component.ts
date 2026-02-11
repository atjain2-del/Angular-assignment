import { Component, inject, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CommerceService } from '../../../core/services/commerce.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="app-shell">
      <header class="navbar">
        <div class="container navbar-content">
          <div class="brand">
            <i class="material-icons logo-icon">storefront</i>
            <a routerLink="/catalog">Cashly</a>
          </div>
          
          <nav class="nav-links">
            <a routerLink="/catalog" routerLinkActive="active">
              <i class="material-icons">view_module</i> Catalog
            </a>
            
            <a routerLink="/cart" routerLinkActive="active" class="cart-link">
              <i class="material-icons">shopping_cart</i> Cart
              <span class="badge" *ngIf="cartCount() > 0">{{ cartCount() }}</span>
            </a>
            
            <div class="user-profile" *ngIf="auth.currentUser() as user">
              <div class="avatar">{{ user.name.charAt(0) }}</div>
              <button (click)="logout()" class="logout-link" title="Logout">
                <i class="material-icons">logout</i>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Cashly Payments. <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; flex-direction: column; min-height: 100vh; }
    
    .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
    .navbar-content { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; }
    
    .brand { display: flex; align-items: center; font-size: 22px; font-weight: bold; }
    .brand a { color: #5f6368; text-decoration: none; margin-left: 8px; }
    .logo-icon { color: #1a73e8; font-size: 28px; }

    .nav-links { display: flex; align-items: center; gap: 20px; }
    .nav-links a { text-decoration: none; color: #5f6368; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 6px; }
    .nav-links a.active { color: #1a73e8; }
    .material-icons { font-size: 20px; vertical-align: middle; }
    
    .cart-link { position: relative; }
    .badge { position: absolute; top: -8px; right: -10px; background: #d93025; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; }

    .user-profile { display: flex; align-items: center; gap: 10px; margin-left: 15px; border-left: 1px solid #ddd; padding-left: 15px; }
    .avatar { width: 32px; height: 32px; background: #e37400; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .logout-link { background: none; border: none; cursor: pointer; color: #5f6368; display: flex; align-items: center; padding: 0; }
    .logout-link:hover { color: #d93025; }

    .main-content { flex: 1; padding-top: 20px; }
    .footer { background: #f1f3f4; padding: 30px 0; text-align: center; color: #5f6368; font-size: 12px; margin-top: auto; }
    .footer a { color: #5f6368; text-decoration: none; margin: 0 5px; }
  `]
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);
  commerce = inject(CommerceService);
  
  cartCount = computed(() => {
    const items = this.commerce.cartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }); 

  logout() {
    this.auth.logout();
  }
}
