import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>My Wishlist ❤️</h1>
        <p>Vehicles you've saved for later</p>
      </div>
    </div>

    <div class="container" style="padding-bottom:48px">
      @if (loading) {
        <div class="vehicles-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="skeleton-card">
              <div class="skeleton" style="height:200px"></div>
              <div style="padding:16px">
                <div class="skeleton" style="height:20px;margin-bottom:8px"></div>
                <div class="skeleton" style="height:16px;width:60%"></div>
              </div>
            </div>
          }
        </div>
      }

      @if (!loading && wishlist.length === 0) {
        <div class="card empty-state">
          <div style="font-size:64px">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Browse vehicles and click the heart icon to save them for later.</p>
          <a routerLink="/vehicles" class="btn btn-primary" style="margin-top:16px">Browse Vehicles</a>
        </div>
      }

      @if (!loading && wishlist.length > 0) {
        <div style="margin-bottom:16px;color:var(--text-secondary)">
          {{ wishlist.length }} vehicle{{ wishlist.length !== 1 ? 's' : '' }} saved
        </div>
        <div class="vehicles-grid">
          @for (vehicle of wishlist; track vehicle._id) {
            <div class="vehicle-card" (click)="viewVehicle(vehicle._id)">
              <div class="vehicle-img-wrap">
                <div class="vehicle-img-placeholder">{{ getEmoji(vehicle.type) }}</div>
                <div class="type-badge">{{ vehicle.type }}</div>
                <button class="heart-btn" (click)="removeFromWishlist($event, vehicle._id)">❤️</button>
              </div>
              <div class="vehicle-info">
                <div class="veh-name">{{ vehicle.name }}</div>
                <div class="veh-meta">{{ vehicle.brand }} · {{ vehicle.year }} · {{ vehicle.fuelType }}</div>
                <div class="veh-location">📍 {{ vehicle.location }}</div>
                <div class="veh-footer">
                  <div>
                    <span class="price">₹{{ vehicle.pricePerDay | number }}</span>
                    <span class="per">/day</span>
                  </div>
                  <span class="rating">⭐ {{ vehicle.rating?.toFixed(1) || '4.5' }}</span>
                </div>
                <button class="btn btn-primary w-full" style="margin-top:12px"
                        (click)="bookNow($event, vehicle._id)">Book Now</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .vehicles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .vehicle-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; transition: all 0.3s ease; }
    .vehicle-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,35,126,0.15); }
    .vehicle-img-wrap { position: relative; height: 200px; }
    .vehicle-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #f0f4ff, #e0e7ff); display: flex; align-items: center; justify-content: center; font-size: 80px; }
    .type-badge { position: absolute; top: 12px; left: 12px; background: rgba(26,35,126,0.9); color: white; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; }
    .heart-btn { position: absolute; top: 12px; right: 12px; background: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s; }
    .heart-btn:hover { transform: scale(1.15); }
    .vehicle-info { padding: 16px; }
    .veh-name { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
    .veh-meta { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
    .veh-location { font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; }
    .veh-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 20px; font-weight: 800; color: var(--primary); }
    .per { font-size: 13px; color: var(--text-secondary); }
    .rating { font-size: 14px; font-weight: 600; color: #f57f17; }
    .skeleton-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); }
    .empty-state { text-align: center; padding: 60px; }
    .empty-state h3 { font-size: 22px; font-weight: 700; margin: 16px 0 8px; }
    .empty-state p { color: var(--text-secondary); }
    @media (max-width: 1024px) { .vehicles-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .vehicles-grid { grid-template-columns: 1fr; } }
  `]
})
export class WishlistComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  wishlist: Vehicle[] = [];
  loading = true;

  ngOnInit() {
    this.fetchWishlist();
  }

  fetchWishlist() {
    this.loading = true;
    this.userService.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlist = res.wishlist || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  removeFromWishlist(event: Event, vehicleId: string) {
    event.stopPropagation();
    this.userService.toggleWishlist(vehicleId).subscribe({
      next: () => {
        this.toast.success('Removed from wishlist');
        this.fetchWishlist();
      },
      error: () => this.toast.error('Failed to remove')
    });
  }

  viewVehicle(id: string) {
    window.location.href = `/vehicles/${id}`;
  }

  bookNow(event: Event, id: string) {
    event.stopPropagation();
    window.location.href = `/booking/${id}`;
  }

  getEmoji(type: string): string {
    const m: Record<string, string> = { Car: '🚗', Sedan: '🚗', Hatchback: '🚗', Bike: '🏍', Scooter: '🛵', SUV: '🚙' };
    return m[type] || '🚗';
  }
}
