import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StarRatingComponent],
  template: `
    @if (loading) {
      <div class="container section text-center py-12">
        <div class="spinner"></div>
        <p class="mt-4 text-secondary">Loading vehicle details...</p>
      </div>
    } @else if (vehicle) {
      <div class="container section">
        
        <!-- Breadcrumb & Top Badges -->
        <div class="top-nav-bar mb-6">
          <a routerLink="/vehicles" class="back-link">← Back to Fleet</a>
          <div class="flex gap-2">
            <span class="badge-tag" [class.sale-badge]="vehicle.listingType === 'sale'">
              {{ vehicle.listingType === 'sale' ? '🏷️ FOR SALE' : '🔑 FOR RENT' }}
            </span>
            <span class="badge-tag type-badge">
              {{ isBike(vehicle.type) ? '🏍️ ' + vehicle.type : '🚗 ' + vehicle.type }}
            </span>
          </div>
        </div>

        <div class="grid-layout">
          <!-- Left Column -->
          <div class="left-col">
            <div class="image-gallery card">
              <img [src]="selectedImage || getFirstImage(vehicle)" class="main-image" [alt]="vehicle.name">
              @if (vehicle.images && vehicle.images.length > 1) {
                <div class="thumbnail-list mt-4">
                  @for (img of vehicle.images; track img) {
                    <img [src]="img" class="thumbnail" [class.active]="selectedImage === img" (click)="selectedImage = img">
                  }
                </div>
              }
            </div>

            <div class="card mt-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h1 class="vehicle-title">{{ vehicle.name }}</h1>
                  <p class="text-secondary text-base mt-1">
                    📍 <strong>{{ vehicle.location }} Hub</strong> • {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})
                  </p>
                </div>
                <div class="rating-box">
                  <app-star-rating [rating]="vehicle.rating || 4.8" size="lg" [showText]="true"></app-star-rating>
                </div>
              </div>

              <!-- Specs Grid -->
              <div class="specs-grid mt-6">
                <div class="spec-item">
                  <span class="label">Category</span>
                  <span class="val">{{ vehicle.type }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Fuel Type</span>
                  <span class="val">{{ vehicle.fuelType || 'Petrol' }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Transmission</span>
                  <span class="val">{{ vehicle.transmission || 'Manual' }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Seats / Capacity</span>
                  <span class="val">{{ vehicle.seats || 2 }} Seats</span>
                </div>
                <div class="spec-item">
                  <span class="label">Color</span>
                  <span class="val">{{ vehicle.color || 'Standard' }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Total Stock</span>
                  <span class="val text-primary font-bold">{{ vehicle.quantity || 1 }} Units</span>
                </div>
              </div>

              <h3 class="mt-8 mb-4 border-b pb-2 font-bold text-lg">Vehicle Features & Highlights</h3>
              <div class="features-list">
                @if (vehicle.features && vehicle.features.length > 0) {
                  @for (feature of vehicle.features; track feature) {
                    <span class="feature-tag">✓ {{ feature }}</span>
                  }
                } @else {
                  <span class="feature-tag">✓ Fully Serviced</span>
                  <span class="feature-tag">✓ Insured & Verified</span>
                  <span class="feature-tag">✓ Sanitize Guaranteed</span>
                }
              </div>

              <h3 class="mt-8 mb-4 border-b pb-2 font-bold text-lg">Description</h3>
              <p class="description-text">{{ vehicle.description || 'No description provided.' }}</p>
            </div>
          </div>

          <!-- Right Column / Sticky Action Panel -->
          <div class="right-col">
            <div class="card sticky-card">
              
              <!-- Pricing Card Header -->
              <div class="price-header" [class.sale-header]="vehicle.listingType === 'sale'">
                @if (vehicle.listingType === 'sale') {
                  <div>
                    <span class="price-label">Outright Sale Price</span>
                    <h2>₹{{ (vehicle.salePrice || 0) | number }}</h2>
                  </div>
                  <div class="stock-badge sale">In Stock: {{ vehicle.availableQuantity || vehicle.quantity || 1 }}</div>
                } @else {
                  <div>
                    <span class="price-label">Daily Rental Rate</span>
                    <h2>₹{{ vehicle.pricePerDay | number }}<span class="unit"> / day</span></h2>
                  </div>
                  <div class="stock-badge rent">Available: {{ vehicle.availableQuantity || vehicle.quantity || 1 }}</div>
                }
              </div>

              <!-- Price Breakdown Options -->
              <div class="price-breakdown mt-4">
                @if (vehicle.listingType === 'rent') {
                  <div class="flex justify-between text-sm py-1 border-b">
                    <span class="text-secondary">Hourly Rate</span>
                    <span class="font-bold">₹{{ vehicle.pricePerHour || Math.round(vehicle.pricePerDay / 10) }}/hr</span>
                  </div>
                  <div class="flex justify-between text-sm py-1 border-b">
                    <span class="text-secondary">Weekly Rate</span>
                    <span class="font-bold">₹{{ vehicle.pricePerWeek || (vehicle.pricePerDay * 6) | number }}/week</span>
                  </div>
                  <div class="flex justify-between text-sm py-1">
                    <span class="text-secondary">Refundable Security Deposit</span>
                    <span class="font-bold text-emerald">₹{{ vehicle.securityDeposit || 1000 | number }}</span>
                  </div>
                } @else {
                  <div class="flex justify-between text-sm py-1 border-b">
                    <span class="text-secondary">Registration & RTO</span>
                    <span class="font-bold text-emerald">Clear RC Transfer</span>
                  </div>
                  <div class="flex justify-between text-sm py-1 border-b">
                    <span class="text-secondary">Insurance Status</span>
                    <span class="font-bold">Comprehensive Valid</span>
                  </div>
                  <div class="flex justify-between text-sm py-1">
                    <span class="text-secondary">Inspection Guarantee</span>
                    <span class="font-bold text-emerald">100-Point Check Passed</span>
                  </div>
                }
              </div>

              <!-- Quantity Selector -->
              <div class="qty-selector mt-6">
                <label class="form-label font-bold text-sm">Select Quantity:</label>
                <div class="qty-control">
                  <button type="button" (click)="decQty()" [disabled]="selectedQty <= 1">-</button>
                  <input type="number" [(ngModel)]="selectedQty" readonly>
                  <button type="button" (click)="incQty()" [disabled]="selectedQty >= (vehicle.availableQuantity || vehicle.quantity || 1)">+</button>
                </div>
                <div class="text-xs text-secondary mt-1">Maximum {{ vehicle.availableQuantity || vehicle.quantity || 1 }} units left</div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6">
                @if (vehicle.listingType === 'sale') {
                  <button class="btn btn-sale btn-lg w-full mb-3" (click)="buyNow()">
                    🛒 Buy Vehicle (₹{{ ((vehicle.salePrice || 0) * selectedQty) | number }})
                  </button>
                } @else {
                  <button class="btn btn-primary btn-lg w-full mb-3" (click)="proceedToBook()">
                    🔑 Book Self-Drive Ride
                  </button>
                }
                
                <button class="btn btn-outline w-full" (click)="addToWishlist()">
                  ❤️ Save to Favorites
                </button>
              </div>

              <!-- Location & Hub Pickup Info -->
              <div class="location-hub-box mt-6 border-t pt-4">
                <div class="flex items-center gap-3">
                  <div class="hub-icon">📍</div>
                  <div>
                    <div class="font-bold text-sm">Pickup Hub: {{ vehicle.location }}</div>
                    <div class="text-xs text-secondary">Sanitized & verified ready for pickup</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .top-nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back-link {
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
      font-size: 14px;
    }
    .back-link:hover { text-decoration: underline; }

    .badge-tag {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      background: #10b981;
      color: white;
    }
    .badge-tag.sale-badge {
      background: #d97706;
    }
    .type-badge {
      background: #1e293b;
    }

    .grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
    .image-gallery { padding: 0; overflow: hidden; border-radius: 20px; }
    .main-image { width: 100%; height: 420px; object-fit: cover; }
    .thumbnail-list { display: flex; gap: 12px; padding: 16px; overflow-x: auto; }
    .thumbnail { width: 80px; height: 60px; object-fit: cover; border-radius: 10px; cursor: pointer; border: 2px solid transparent; }
    .thumbnail.active { border-color: #2563eb; }

    .vehicle-title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0; }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .spec-item { display: flex; flex-direction: column; }
    .spec-item .label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 2px; font-weight: 700; }
    .spec-item .val { font-weight: 800; font-size: 14px; color: #0f172a; }

    .features-list { display: flex; flex-wrap: wrap; gap: 10px; }
    .feature-tag { background: #ecfdf5; color: #047857; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; }
    .description-text { white-space: pre-wrap; color: #475569; line-height: 1.7; }

    .sticky-card { position: sticky; top: 90px; border-radius: 20px; padding: 24px; }
    .price-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;
    }
    .price-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 800; }
    .price-header h2 { font-size: 30px; font-weight: 900; color: #2563eb; margin: 0; }
    .price-header.sale-header h2 { color: #d97706; }
    .price-header .unit { font-size: 14px; color: #64748b; font-weight: 600; }

    .stock-badge {
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .stock-badge.rent { background: #eff6ff; color: #1d4ed8; }
    .stock-badge.sale { background: #fef3c7; color: #b45309; }

    .qty-selector {
      background: #f8fafc;
      padding: 14px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
    }
    .qty-control {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }
    .qty-control button {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }
    .qty-control input {
      width: 60px;
      text-align: center;
      font-size: 16px;
      font-weight: 800;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px;
    }

    .btn-sale {
      background: #d97706;
      color: white;
      font-weight: 800;
      border: none;
    }
    .btn-sale:hover { background: #b45309; }

    .hub-icon {
      width: 36px;
      height: 36px;
      background: #eff6ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    @media (max-width: 992px) {
      .grid-layout { grid-template-columns: 1fr; }
      .main-image { height: 280px; }
      .sticky-card { position: static; }
      .specs-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class VehicleDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  vehicleService = inject(VehicleService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  Math = Math;

  vehicle: Vehicle | null = null;
  loading = true;
  selectedImage: string = '';
  selectedQty: number = 1;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getVehicle(id).subscribe({
        next: (res) => {
          this.vehicle = res.data || res.vehicle || res;
          this.loading = false;
        },
        error: () => {
          this.toast.error('Failed to load vehicle details');
          this.loading = false;
        }
      });
    }
  }

  isBike(type: string): boolean {
    return ['Bike', 'Scooter'].includes(type);
  }

  getFirstImage(v: Vehicle): string {
    if (v.images && v.images.length > 0 && v.images[0]) return v.images[0];
    if (this.isBike(v.type)) return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
  }

  incQty() {
    const max = this.vehicle?.availableQuantity || this.vehicle?.quantity || 1;
    if (this.selectedQty < max) this.selectedQty++;
  }

  decQty() {
    if (this.selectedQty > 1) this.selectedQty--;
  }

  proceedToBook() {
    this.router.navigate(['/booking', this.vehicle?._id], { queryParams: { qty: this.selectedQty } });
  }

  buyNow() {
    this.toast.success(`🎉 Purchase Request Sent for ${this.selectedQty} unit(s) of ${this.vehicle?.name}! The seller will contact you shortly.`);
  }

  addToWishlist() {
    this.toast.success('Added to Wishlist ❤️');
  }
}
