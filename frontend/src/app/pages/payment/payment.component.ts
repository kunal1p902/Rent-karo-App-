import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container section flex justify-center">
      <div class="card max-w-lg w-full text-center">
        <h2 class="text-2xl font-bold mb-2">Complete Payment</h2>
        <p class="text-secondary mb-6">Booking ID: #{{ bookingId }}</p>
        
        <div class="payment-amount mb-8">
          <p class="text-sm uppercase text-secondary font-bold">Total Payable</p>
          <div class="text-4xl font-bold text-primary">₹{{ amount || '5,000' }}</div>
        </div>

        <div class="payment-methods text-left mb-6">
          <label class="payment-option">
            <input type="radio" name="paymentMethod" checked>
            <span class="option-content">
              <span class="font-bold">UPI</span>
              <span class="text-sm text-secondary">Pay via GPay, PhonePe, Paytm</span>
            </span>
          </label>
          <label class="payment-option">
            <input type="radio" name="paymentMethod">
            <span class="option-content">
              <span class="font-bold">Credit / Debit Card</span>
              <span class="text-sm text-secondary">Visa, MasterCard, RuPay</span>
            </span>
          </label>
          <label class="payment-option">
            <input type="radio" name="paymentMethod">
            <span class="option-content">
              <span class="font-bold">Net Banking</span>
              <span class="text-sm text-secondary">All major banks supported</span>
            </span>
          </label>
        </div>

        <button class="btn btn-primary btn-lg w-full" (click)="processPayment()" [disabled]="processing">
          @if (processing) {
            <span class="spinner"></span> Processing...
          } @else {
            Pay Securely
          }
        </button>
        <button class="btn btn-outline w-full mt-4" (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .max-w-lg { max-width: 500px; }
    .text-2xl { font-size: 24px; }
    .text-4xl { font-size: 40px; }
    .font-bold { font-weight: 700; }
    .payment-amount { padding: 32px; background: var(--bg); border-radius: var(--radius-sm); }
    .payment-option {
      display: flex; align-items: flex-start; gap: 16px;
      padding: 16px; border: 1px solid var(--border);
      border-radius: var(--radius-sm); margin-bottom: 12px;
      cursor: pointer; transition: all 0.2s;
    }
    .payment-option:hover { border-color: var(--primary); background: var(--bg); }
    .option-content { display: flex; flex-direction: column; }
    input[type="radio"] { margin-top: 4px; }
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PaymentComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  toast = inject(ToastService);

  bookingId = '';
  amount = 0;
  processing = false;

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    // Mock getting amount from state or API
    this.amount = 5000; 
  }

  processPayment() {
    this.processing = true;
    setTimeout(() => {
      this.toast.success('Payment successful! Booking confirmed.');
      this.router.navigate(['/invoice', this.bookingId]);
    }, 2000);
  }

  cancel() {
    this.router.navigate(['/user/bookings']);
  }
}
