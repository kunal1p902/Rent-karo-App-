import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container section flex justify-center">
      @if (loading) {
        <div class="text-center">Loading Invoice...</div>
      } @else if (booking) {
        <div class="card invoice-card">
          <div class="invoice-header">
            <div>
              <h2 class="text-2xl font-bold">RENT-KARO</h2>
              <p class="text-secondary text-sm">Invoice #INV-{{ booking.bookingId }}</p>
            </div>
            <div class="text-right">
              <div class="badge badge-success mb-2">PAID</div>
              <p class="font-bold">Date: {{ booking.createdAt | date }}</p>
            </div>
          </div>

          <div class="grid-2 mt-8 pb-8 border-b">
            <div>
              <p class="text-sm text-secondary uppercase font-bold mb-2">Billed To</p>
              <h4 class="font-bold text-lg">{{ booking.userId?.name }}</h4>
              <p class="text-secondary">{{ booking.userId?.email }}</p>
              <p class="text-secondary">{{ booking.userId?.mobile }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-secondary uppercase font-bold mb-2">Vehicle Owner</p>
              <h4 class="font-bold text-lg">{{ booking.ownerId?.businessName || booking.ownerId?.name }}</h4>
              <p class="text-secondary">{{ booking.ownerId?.email }}</p>
              <p class="text-secondary">{{ booking.ownerId?.mobile }}</p>
            </div>
          </div>

          <div class="mt-8 pb-8 border-b">
            <h4 class="font-bold mb-4">Rental Details</h4>
            <div class="grid-3 bg-light p-4 rounded">
              <div>
                <p class="text-sm text-secondary">Vehicle</p>
                <p class="font-bold">{{ booking.vehicleId?.brand }} {{ booking.vehicleId?.model }}</p>
              </div>
              <div>
                <p class="text-sm text-secondary">Pickup</p>
                <p class="font-bold">{{ booking.pickupDate | date }} {{ booking.pickupTime }}</p>
              </div>
              <div>
                <p class="text-sm text-secondary">Return</p>
                <p class="font-bold">{{ booking.returnDate | date }} {{ booking.returnTime }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <table class="invoice-table w-full">
              <thead>
                <tr>
                  <th class="text-left">Description</th>
                  <th class="text-center">Duration</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left py-4">Vehicle Rental Charges</td>
                  <td class="text-center py-4">{{ booking.rentalDuration }} Days</td>
                  <td class="text-right py-4">₹{{ booking.rentalAmount }}</td>
                </tr>
                <tr>
                  <td class="text-left py-4">Security Deposit (Refundable)</td>
                  <td class="text-center py-4">-</td>
                  <td class="text-right py-4">₹{{ booking.securityDeposit }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" class="text-right py-4 font-bold text-lg">Total Amount Paid</td>
                  <td class="text-right py-4 font-bold text-lg text-primary">₹{{ booking.totalAmount }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="mt-12 text-center no-print">
            <button class="btn btn-primary btn-lg" (click)="print()">🖨️ Print Invoice</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .invoice-card { max-width: 800px; width: 100%; padding: 48px; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--primary); padding-bottom: 24px; }
    .text-2xl { font-size: 24px; } .text-lg { font-size: 18px; }
    .font-bold { font-weight: 700; }
    .border-b { border-bottom: 1px solid var(--border); }
    .bg-light { background: var(--bg); }
    .p-4 { padding: 16px; } .rounded { border-radius: var(--radius-sm); }
    .py-4 { padding: 16px 0; }
    .invoice-table th { border-bottom: 2px solid var(--border); padding-bottom: 12px; }
    .invoice-table td { border-bottom: 1px solid var(--border); }
    .invoice-table tfoot td { border-bottom: none; border-top: 2px solid var(--text); }
    @media print {
      body * { visibility: hidden; }
      .invoice-card, .invoice-card * { visibility: visible; }
      .invoice-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; padding: 0; }
      .no-print { display: none; }
    }
  `]
})
export class InvoiceComponent implements OnInit {
  route = inject(ActivatedRoute);
  bookingService = inject(BookingService);

  booking: any = null;
  loading = true;

  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      // Mock data since real API isn't present
      setTimeout(() => {
        this.booking = {
          bookingId: bookingId,
          createdAt: new Date(),
          userId: { name: 'Kunal', email: 'kunal@example.com', mobile: '9999999999' },
          ownerId: { businessName: 'Super Rentals', email: 'owner@example.com', mobile: '8888888888' },
          vehicleId: { brand: 'Honda', model: 'City' },
          pickupDate: new Date(),
          pickupTime: '10:00',
          returnDate: new Date(Date.now() + 86400000 * 2),
          returnTime: '10:00',
          rentalDuration: 2,
          rentalAmount: 3000,
          securityDeposit: 2000,
          totalAmount: 5000
        };
        this.loading = false;
      }, 500);
    }
  }

  print() {
    window.print();
  }
}
