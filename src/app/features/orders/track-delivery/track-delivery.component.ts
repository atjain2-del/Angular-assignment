import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-track-delivery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Order Tracking</h2>
      <p>Order ID: {{ orderId }}</p>

      <div class="timeline">
        <div class="step completed">Order Placed</div>
        <div class="step completed">Payment Confirmed</div>
        <div class="step active">Packed & Ready</div>
        <div class="step">Shipped</div>
        <div class="step">Delivered</div>
      </div>

      <div class="info-box">
        <h3>Estimated Delivery</h3>
        <p>Tomorrow by 8:00 PM</p>
      </div>
      
      <a routerLink="/catalog" class="btn-link">Continue Shopping</a>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .timeline { display: flex; flex-direction: column; gap: 15px; margin: 30px 0; border-left: 2px solid #ddd; padding-left: 20px; }
    .step { position: relative; color: #aaa; }
    .step::before { content:''; position: absolute; left: -26px; top: 0; width: 10px; height: 10px; background: #ddd; border-radius: 50%; }
    .step.completed { color: green; font-weight: bold; }
    .step.completed::before { background: green; }
    .step.active { color: #1a73e8; font-weight: bold; }
    .step.active::before { background: #1a73e8; transform: scale(1.3); }
    .info-box { background: #e8f0fe; color: #1a73e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
  `]
})
export class TrackDeliveryComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderId = '';

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
  }
}
