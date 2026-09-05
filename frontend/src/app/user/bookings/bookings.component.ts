import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <h1 class="mb-6 font-bold text-3xl">My Bookings</h1>

      <div class="tabs mb-8">
        <button class="tab-btn" [class.active]="activeTab === 'UPCOMING'" (click)="activeTab = 'UPCOMING'">Upcoming</button>
        <button class="tab-btn" [class.active]="activeTab === 'ACTIVE'" (click)="activeTab = 'ACTIVE'">Active</button>
        <button class="tab-btn" [class.active]="activeTab === 'COMPLETED'" (click)="activeTab = 'COMPLETED'">Completed</button>
        <button class="tab-btn" [class.active]="activeTab === 'CANCELLED'" (click)="activeTab = 'CANCELLED'">Cancelled</button>
      </div>

      <div class="bookings-list">
        @if (loading) {
          <div class="text-center py-8">Loading bookings...</div>
        } @else if (filteredBookings.length === 0) {
          <div class="card text-center py-12">
            <div class="text-4xl mb-4">📅</div>
            <h3>No bookings found</h3>
            <p class="text-secondary mt-2">You don't have any {{ activeTab.toLowerCase() }} bookings.</p>
            <a routerLink="/vehicles" class="btn btn-outline mt-4">Browse Vehicles</a>
          </div>
        } @else {
          @for (booking of filteredBookings; track booking._id) {
            <div class="card booking-card mb-4">
              <div class="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <div class="badge mb-2" [ngClass]="'badge-' + booking.bookingStatus">{{ booking.bookingStatus }}</div>
                  <h3 class="font-bold text-xl">{{ booking.vehicleId?.brand }} {{ booking.vehicleId?.model }}</h3>
                  <p class="text-secondary text-sm mt-1">Booking ID: #{{ booking.bookingId }}</p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-primary">₹{{ booking.totalAmount }}</div>
                  <div class="text-sm text-secondary">{{ booking.paymentStatus }}</div>
                </div>
              </div>

              <div class="grid-3 mb-4">
                <div>
                  <div class="text-sm text-secondary uppercase font-bold mb-1">Pickup</div>
                  <div>{{ booking.pickupDate | date }} at {{ booking.pickupTime }}</div>
                </div>
                <div>
                  <div class="text-sm text-secondary uppercase font-bold mb-1">Return</div>
                  <div>{{ booking.returnDate | date }} at {{ booking.returnTime }}</div>
                </div>
                <div>
                  <div class="text-sm text-secondary uppercase font-bold mb-1">Duration</div>
                  <div>{{ booking.rentalDuration }} Days</div>
                </div>
              </div>

              <div class="flex justify-end gap-2 border-t pt-4">
                <a [routerLink]="['/invoice', booking.bookingId]" class="btn btn-outline btn-sm">View Details</a>
                @if (['PENDING', 'CONFIRMED'].includes(booking.bookingStatus)) {
                  <button class="btn btn-danger btn-sm" (click)="cancelBooking(booking._id)">Cancel Booking</button>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .text-3xl { font-size: 32px; }
    .text-xl { font-size: 20px; }
    .text-2xl { font-size: 24px; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary); }
    .py-12 { padding: 48px 0; }
    .text-4xl { font-size: 48px; }
    .border-b { border-bottom: 1px solid var(--border); }
    .border-t { border-top: 1px solid var(--border); }
    .pb-4 { padding-bottom: 16px; }
    .pt-4 { padding-top: 16px; }
    .tabs { display: flex; gap: 16px; border-bottom: 2px solid var(--border); }
    .tab-btn { background: none; border: none; font-size: 16px; font-weight: 600; color: var(--text-secondary); padding: 12px 24px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
    .badge-PENDING { background: var(--warning-bg); color: var(--warning); }
    .badge-CONFIRMED, .badge-ACTIVE, .badge-COMPLETED { background: var(--success-bg); color: var(--success); }
    .badge-CANCELLED, .badge-REJECTED { background: var(--danger-bg); color: var(--danger); }
  `]
})
export class BookingsComponent implements OnInit {
  bookingService = inject(BookingService);
  toast = inject(ToastService);
  confirm = inject(ConfirmDialogService);

  allBookings: any[] = [];
  activeTab = 'UPCOMING';
  loading = true;

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.loading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (res) => {
        this.allBookings = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get filteredBookings() {
    return this.allBookings.filter(b => {
      if (this.activeTab === 'UPCOMING') return ['PENDING', 'CONFIRMED'].includes(b.bookingStatus);
      if (this.activeTab === 'ACTIVE') return b.bookingStatus === 'ACTIVE';
      if (this.activeTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
      if (this.activeTab === 'CANCELLED') return ['CANCELLED', 'REJECTED'].includes(b.bookingStatus);
      return false;
    });
  }

  async cancelBooking(id: string) {
    const confirmed = await this.confirm.show('Cancel Booking', 'Are you sure you want to cancel this booking? This action cannot be undone.');
    if (confirmed) {
      this.bookingService.cancelBooking(id, 'User requested cancellation').subscribe({
        next: () => {
          this.toast.success('Booking cancelled successfully');
          this.fetchBookings();
        },
        error: () => this.toast.error('Failed to cancel booking')
      });
    }
  }
}
