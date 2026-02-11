import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';

// Features
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/catalog/product-list/product-list.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PaymentComponent } from './features/payment/payment.component';
import { TrackDeliveryComponent } from './features/orders/track-delivery/track-delivery.component';

// Admin Features
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrderManagerComponent } from './features/admin/order-manager/order-manager.component';
import { RefundsComponent } from './features/admin/refunds/refunds.component';
import { AuditLogComponent } from './features/admin/audit-log/audit-log.component';

// Guards
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // 1. Auth Routes (No Layout)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 2. Customer Routes (Wrapped in Main Layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', component: ProductListComponent },
      { path: 'catalog/:sku', component: ProductListComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'payment/:id', component: PaymentComponent },
      { path: 'orders/:id/track', component: TrackDeliveryComponent }
    ]
  },

  // 3. Admin Routes (Wrapped in Admin Layout)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'orders', component: OrderManagerComponent },
      { path: 'payments', component: RefundsComponent },
      { path: 'audit', component: AuditLogComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
