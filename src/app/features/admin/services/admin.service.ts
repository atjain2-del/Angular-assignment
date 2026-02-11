import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface AdminStat { label: string; value: number; alert?: boolean }
export interface AuditLog { id: string; timestamp: Date; actor: string; action: string; details: string; correlationId: string; }

@Injectable({ providedIn: 'root' })
export class AdminService {
  
  // --- A. DASHBOARD STATS ---
  getDashboardStats(): Observable<AdminStat[]> {
    return of([
      { label: 'Total Orders (Today)', value: 142 },
      { label: 'Payment Failures', value: 3, alert: true }, // Red alert
      { label: 'Shipments Stuck', value: 12, alert: true },
      { label: 'Revenue', value: 45200 }
    ]).pipe(delay(400));
  }

  // --- B. ORDERS ---
  getOrders(): Observable<any[]> {
    return of([
      { id: 'ORD-1001', customer: 'Atishay Jain', total: 299, status: 'Processing', date: new Date() },
      { id: 'ORD-1002', customer: 'Jane Doe', total: 89, status: 'Shipped', date: new Date() },
      { id: 'ORD-1003', customer: 'Bob Smith', total: 1200, status: 'Held', date: new Date() }
    ]).pipe(delay(400));
  }

  // --- C. PAYMENTS (REFUNDS) ---
  processRefund(paymentId: string, amount: number, reason: string): Observable<boolean> {
    console.log(`[Command] Refund \${amount} on ${paymentId}. Reason: ${reason}`);
    return of(true).pipe(delay(1000));
  }

  // --- E. AUDIT TRAIL ---
  getAuditLogs(entityId?: string): Observable<AuditLog[]> {
    return of([
      { id: '1', timestamp: new Date(), actor: 'System', action: 'Order Placed', details: 'Order created via Checkout', correlationId: 'cx-123' },
      { id: '2', timestamp: new Date(), actor: 'PaymentGateway', action: 'Auth Success', details: 'Visa **** 4242', correlationId: 'cx-123' },
      { id: '3', timestamp: new Date(), actor: 'Warehouse', action: 'Packed', details: 'Items picked', correlationId: 'cx-123' },
      { id: '4', timestamp: new Date(), actor: 'Admin (You)', action: 'Refund Issued', details: 'Partial refund $50', correlationId: 'cx-999' },
    ]).pipe(delay(500));
  }
}
