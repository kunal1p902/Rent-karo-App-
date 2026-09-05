import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Vehicle } from '../../core/models/vehicle.model';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="zoom-card" [class.sale-card]="vehicle.listingType === 'sale'">
      <!-- Card Image Header -->
      <div class="card-image-wrapper">
        <img [src]="getVehicleImage(vehicle)" [alt]="vehicle.name" class="vehicle-img" />
        
        <!-- Badges Overlay Top Left -->
        <div class="badges-overlay top-left">
          <span class="badge-tag listing-type-badge" [class.sale-badge]="vehicle.listingType === 'sale'">
            {{ vehicle.listingType === 'sale' ? '🏷️ FOR SALE' : '🔑 FOR RENT' }}
          </span>
          <span class="badge-tag type-badge">
            {{ isBike(vehicle.type) ? '🏍️ ' + vehicle.type : '🚗 ' + vehicle.type }}
          </span>
        </div>

        <!-- Wishlist Button Overlay Top Right -->
        <div class="badges-overlay top-right">
          <button class="wishlist-btn" [class.active]="isWishlisted" (click)="toggleWishlist($event)">
            {{ isWishlisted ? '❤️' : '🤍' }}
          </button>
        </div>

        <!-- Bottom Specs Pill Bar -->
        <div class="badges-overlay bottom-bar">
          <span class="spec-pill">📍 {{ vehicle.location }}</span>
          <span class="spec-pill">{{ vehicle.transmission || 'Manual' }}</span>
          <span class="spec-pill">{{ vehicle.fuelType || 'Petrol' }}</span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="title-row">
          <h3 class="vehicle-name" [title]="vehicle.name">{{ vehicle.name }}</h3>
          <div class="rating-badge">
            <span>★</span> {{ vehicle.rating || 4.8 }}
          </div>
        </div>

        <div class="brand-subtitle">
          <span>{{ vehicle.brand }} {{ vehicle.model }}</span> • <span>{{ vehicle.year }}</span>
        </div>

        <div class="stock-perks-row">
          <span class="stock-pill" [class.low-stock]="(vehicle.availableQuantity || vehicle.quantity) <= 2">
            📦 Stock: {{ vehicle.availableQuantity || vehicle.quantity || 1 }} available
          </span>
          <span class="perk-tag">✓ Verified Owner</span>
        </div>

        <!-- Pricing & Action Footer -->
        <div class="pricing-footer">
          <div class="price-box">
            @if (vehicle.listingType === 'sale') {
              <span class="price-amount sale-color">₹{{ (vehicle.salePrice || 0) | number }}</span>
              <span class="price-unit">Total Price</span>
              <div class="price-sub">Direct Ownership</div>
            } @else {
              <span class="price-amount">₹{{ vehicle.pricePerDay | number }}</span>
              <span class="price-unit">/ day</span>
              <div class="price-sub">₹{{ vehicle.pricePerHour || Math.round(vehicle.pricePerDay / 10) }}/hr</div>
            }
          </div>

          <a [routerLink]="['/vehicles', vehicle._id]" class="btn btn-sm action-btn" [class.btn-sale]="vehicle.listingType === 'sale'">
            {{ vehicle.listingType === 'sale' ? 'View & Buy 🏷️' : 'Book Ride 🚗' }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .zoom-card {
      background: #ffffff;
      border-radius: 18px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .zoom-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 28px rgba(0,0,0,0.12);
      border-color: #3b82f6;
    }
    .zoom-card.sale-card:hover {
      border-color: #f59e0b;
    }

    .card-image-wrapper {
      position: relative;
      height: 190px;
      background: #1e293b;
      overflow: hidden;
    }
    .vehicle-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .zoom-card:hover .vehicle-img {
      transform: scale(1.06);
    }

    .badges-overlay {
      position: absolute;
      z-index: 2;
    }
    .top-left {
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .top-right { top: 10px; right: 10px; }
    .bottom-bar {
      bottom: 10px;
      left: 10px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .badge-tag {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      backdrop-filter: blur(6px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .listing-type-badge {
      background: rgba(16, 185, 129, 0.95);
      color: #ffffff;
    }
    .listing-type-badge.sale-badge {
      background: rgba(217, 119, 6, 0.95);
      color: #ffffff;
    }
    .type-badge {
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
    }

    .spec-pill {
      background: rgba(255, 255, 255, 0.92);
      color: #1e293b;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 4px rgba(0,0,0,0.12);
    }

    .wishlist-btn {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: transform 0.2s ease;
    }
    .wishlist-btn:hover { transform: scale(1.15); }

    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .vehicle-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
    .rating-badge {
      background: #ecfdf5;
      color: #047857;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12px;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 10px;
    }

    .stock-perks-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .stock-pill {
      font-size: 11px;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .stock-pill.low-stock {
      color: #dc2626;
      background: #fef2f2;
    }
    .perk-tag {
      font-size: 11px;
      font-weight: 600;
      color: #059669;
    }

    .pricing-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }
    .price-amount {
      font-size: 19px;
      font-weight: 900;
      color: #0f172a;
    }
    .price-amount.sale-color {
      color: #d97706;
    }
    .price-unit {
      font-size: 12px;
      color: #64748b;
    }
    .price-sub {
      font-size: 11px;
      color: #10b981;
      font-weight: 700;
    }
    .action-btn {
      background: #2563eb;
      color: white;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s ease;
    }
    .action-btn:hover {
      background: #1d4ed8;
    }
    .action-btn.btn-sale {
      background: #d97706;
    }
    .action-btn.btn-sale:hover {
      background: #b45309;
    }
  `]
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;
  @Input() isWishlisted = false;
  Math = Math;

  private userService = inject(UserService);
  private toast = inject(ToastService);

  isBike(type: string): boolean {
    return ['Bike', 'Scooter'].includes(type);
  }

  getVehicleImage(v: Vehicle): string {
    if (v.images && v.images.length > 0 && v.images[0]) return v.images[0];
    if (this.isBike(v.type)) {
      return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    if (!this.vehicle._id) return;
    this.userService.toggleWishlist(this.vehicle._id).subscribe({
      next: () => {
        this.isWishlisted = !this.isWishlisted;
        this.toast.success(this.isWishlisted ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
      },
      error: () => this.toast.error('Please login to save wishlist')
    });
  }
}
