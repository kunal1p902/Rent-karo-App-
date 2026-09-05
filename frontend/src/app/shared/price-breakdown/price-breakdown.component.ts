import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-breakdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="price-breakdown">
      <div class="row">
        <span>Rental Duration</span>
        <span>{{ duration }} Days</span>
      </div>
      <div class="row">
        <span>Rental Amount</span>
        <span>₹{{ rentalAmount }}</span>
      </div>
      <div class="row">
        <span>Security Deposit (Refundable)</span>
        <span>₹{{ securityDeposit }}</span>
      </div>
      @if (additionalCharges > 0) {
        <div class="row">
          <span>Additional Charges</span>
          <span>₹{{ additionalCharges }}</span>
        </div>
      }
      <div class="row total">
        <span>Total Amount</span>
        <span>₹{{ totalAmount }}</span>
      </div>
    </div>
  `,
  styles: [`
    .price-breakdown {
      background: var(--bg);
      border-radius: var(--radius-sm);
      padding: 16px;
      margin: 20px 0;
    }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; color: var(--text-secondary); font-size: 14px; }
    .row:last-child { margin-bottom: 0; }
    .row.total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed var(--border);
      color: var(--text);
      font-weight: 800;
      font-size: 18px;
    }
  `]
})
export class PriceBreakdownComponent {
  @Input() duration: number = 0;
  @Input() rentalAmount: number = 0;
  @Input() securityDeposit: number = 0;
  @Input() additionalCharges: number = 0;
  @Input() totalAmount: number = 0;
}
