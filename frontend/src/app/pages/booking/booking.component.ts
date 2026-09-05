import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { PriceBreakdownComponent } from '../../shared/price-breakdown/price-breakdown.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PriceBreakdownComponent],
  template: `
    <div class="container section">
      @if (loading) {
        <div class="text-center py-12">Loading vehicle details...</div>
      } @else if (vehicle) {
        <div class="grid-2">
          <!-- Left: Booking Form -->
          <div class="card zoom-booking-card">
            <h2 class="mb-6 font-bold text-2xl">Confirm Booking Details 🚗</h2>
            
            <div class="vehicle-mini-card mb-6 flex gap-4 items-center p-4 bg-light rounded">
              <img [src]="vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'" class="w-24 h-16 object-cover rounded">
              <div>
                <h3 class="font-bold text-lg">{{ vehicle.name || (vehicle.brand + ' ' + vehicle.model) }}</h3>
                <p class="text-sm text-secondary">📍 {{ vehicle.location }} • {{ vehicle.transmission }} • {{ vehicle.fuelType }}</p>
              </div>
            </div>

            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
              <div class="grid-2 mb-4">
                <div class="form-group">
                  <label class="form-label">Pickup Date</label>
                  <input type="date" formControlName="pickupDate" class="form-control" (change)="calculateTotals()">
                </div>
                <div class="form-group">
                  <label class="form-label">Pickup Time</label>
                  <input type="time" formControlName="pickupTime" class="form-control">
                </div>
              </div>

              <div class="grid-2 mb-4">
                <div class="form-group">
                  <label class="form-label">Return Date</label>
                  <input type="date" formControlName="returnDate" class="form-control" (change)="calculateTotals()">
                </div>
                <div class="form-group">
                  <label class="form-label">Return Time</label>
                  <input type="time" formControlName="returnTime" class="form-control">
                </div>
              </div>

              <div class="form-group mb-6">
                <label class="form-label">Quantity Required</label>
                <select formControlName="quantity" class="form-control" (change)="calculateTotals()">
                  @for (i of getQuantityArray(); track i) {
                    <option [value]="i">{{ i }} Vehicle(s)</option>
                  }
                </select>
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="bookingForm.invalid || submitting">
                {{ submitting ? 'Initiating Booking...' : 'Proceed to Payment 🚀' }}
              </button>
            </form>
          </div>

          <!-- Right: Price Breakdown -->
          <div>
            <div class="card sticky-card">
              <h3 class="mb-4 font-bold text-xl">Fare Breakdown</h3>
              <app-price-breakdown
                [duration]="duration"
                [rentalAmount]="rentalAmount"
                [securityDeposit]="securityDeposit"
                [additionalCharges]="0"
                [totalAmount]="totalAmount">
              </app-price-breakdown>
              <p class="text-xs text-secondary mt-4 text-center">✓ Includes free cancellation and 24/7 roadside assistance.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .zoom-booking-card { border-radius: 20px; }
    .text-2xl { font-size: 24px; }
    .text-xl { font-size: 20px; }
    .font-bold { font-weight: 700; }
    .bg-light { background: #f8fafc; border: 1px solid var(--border); }
    .rounded { border-radius: var(--radius-sm); }
    .w-24 { width: 96px; }
    .h-16 { height: 64px; }
    .object-cover { object-fit: cover; }
    .sticky-card { position: sticky; top: 90px; border-radius: 20px; }
    .text-xs { font-size: 12px; }
    .py-12 { padding: 48px 0; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class BookingComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  vehicleService = inject(VehicleService);
  bookingService = inject(BookingService);
  toast = inject(ToastService);

  vehicle: Vehicle | null = null;
  loading = true;
  submitting = false;

  duration = 1;
  rentalAmount = 0;
  securityDeposit = 0;
  totalAmount = 0;

  bookingForm = this.fb.group({
    pickupDate: ['', Validators.required],
    pickupTime: ['10:00', Validators.required],
    returnDate: ['', Validators.required],
    returnTime: ['10:00', Validators.required],
    quantity: [1, Validators.required]
  });

  ngOnInit() {
    this.setDefaultDates();
    const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    if (vehicleId) {
      this.vehicleService.getVehicle(vehicleId).subscribe({
        next: (res) => {
          this.vehicle = res.vehicle || res.data;
          this.loading = false;
          this.calculateTotals();
        },
        error: () => this.loading = false
      });
    }
  }

  setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(today.getTime() + 72 * 60 * 60 * 1000);

    this.bookingForm.patchValue({
      pickupDate: tomorrow.toISOString().slice(0, 10),
      returnDate: dayAfter.toISOString().slice(0, 10)
    });
  }

  getQuantityArray() {
    const max = this.vehicle?.availableQuantity || 1;
    return Array.from({length: max}, (_, i) => i + 1);
  }

  calculateTotals() {
    if (!this.vehicle) return;
    const vals = this.bookingForm.value;
    if (vals.pickupDate && vals.returnDate) {
      const d1 = new Date(vals.pickupDate);
      const d2 = new Date(vals.returnDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      this.duration = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      const qty = Number(vals.quantity) || 1;
      this.rentalAmount = this.duration * this.vehicle.pricePerDay * qty;
      this.securityDeposit = (this.vehicle.securityDeposit || 500) * qty;
      this.totalAmount = this.rentalAmount + this.securityDeposit;
    }
  }

  onSubmit() {
    if (this.bookingForm.invalid || !this.vehicle) return;
    this.submitting = true;
    
    const payload = {
      ...this.bookingForm.value,
      vehicleId: this.vehicle._id
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (res) => {
        this.toast.success('🎉 Booking created! Redirecting to payment...');
        const bId = res.booking?._id || res.booking?.bookingId || res.data?.bookingId;
        this.router.navigate(['/payment', bId]);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create booking');
        this.submitting = false;
      }
    });
  }
}
