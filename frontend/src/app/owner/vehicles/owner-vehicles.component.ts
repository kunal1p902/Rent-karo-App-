import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-owner-vehicles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Host Fleet & Listings</h1>
          <p class="text-secondary text-sm">Manage your cars & bikes for rent and sale</p>
        </div>
        <a routerLink="/owner/vehicles/add" class="btn btn-primary btn-lg">
          + Add New Vehicle 🚗🏍️
        </a>
      </div>

      <div class="card">
        @if (loading) {
          <div class="text-center py-8">Loading your vehicle fleet...</div>
        } @else if (vehicles.length === 0) {
          <div class="text-center py-12">
            <div class="text-5xl mb-4">🚗🏍️</div>
            <h3 class="text-xl font-bold">No vehicles in your fleet yet</h3>
            <p class="text-secondary mt-2">Start earning by listing your car or bike for rent or sale today!</p>
            <a routerLink="/owner/vehicles/add" class="btn btn-primary mt-6">List Your First Vehicle</a>
          </div>
        } @else {
          <div class="table-container">
            <table class="fleet-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Purpose</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Pricing</th>
                  <th>Stock Available</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (v of vehicles; track v._id) {
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <img [src]="v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'" class="v-thumb">
                        <div>
                          <div class="font-bold text-sm">{{ v.name || (v.brand + ' ' + v.model) }}</div>
                          <div class="text-xs text-secondary">{{ v.registrationNumber || 'MH01AB1234' }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="pill-badge" [class.sale-pill]="v.listingType === 'sale'">
                        {{ v.listingType === 'sale' ? '🏷️ Sale' : '🔑 Rent' }}
                      </span>
                    </td>
                    <td>
                      <span class="category-tag">
                        {{ isBike(v.type) ? '🏍️ ' + v.type : '🚗 ' + v.type }}
                      </span>
                    </td>
                    <td class="font-semibold text-sm">📍 {{ v.location || 'Mumbai' }}</td>
                    <td>
                      @if (v.listingType === 'sale') {
                        <div class="font-bold text-amber">₹{{ (v.salePrice || 0) | number }}</div>
                        <div class="text-xs text-secondary">Sale Price</div>
                      } @else {
                        <div class="font-bold text-primary">₹{{ v.pricePerDay | number }}/day</div>
                        <div class="text-xs text-secondary">₹{{ v.pricePerHour || Math.round(v.pricePerDay / 10) }}/hr</div>
                      }
                    </td>
                    <td>
                      <span class="font-bold">{{ v.availableQuantity || v.quantity || 1 }}</span> / {{ v.quantity || 1 }}
                    </td>
                    <td>
                      <span class="badge" [class.badge-success]="v.status === 'available'" [class.badge-danger]="v.status === 'unavailable'">
                        {{ v.status }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="flex justify-end gap-2">
                        <a [routerLink]="['/owner/vehicles/edit', v._id]" class="btn btn-outline btn-sm">Edit ✏️</a>
                        <button class="btn btn-danger btn-sm" (click)="deleteVehicle(v._id)">Delete 🗑️</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .text-3xl { font-size: 30px; }
    .text-xl { font-size: 20px; }
    .text-5xl { font-size: 52px; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-primary { color: #2563eb; }
    .text-amber { color: #d97706; }
    .py-8 { padding: 32px 0; }
    .py-12 { padding: 48px 0; }
    
    .v-thumb {
      width: 52px;
      height: 40px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .fleet-table th {
      background: #f8fafc;
      padding: 14px 16px;
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 800;
    }
    .fleet-table td {
      padding: 14px 16px;
      vertical-align: middle;
      border-bottom: 1px solid #f1f5f9;
    }

    .pill-badge {
      background: #ecfdf5;
      color: #047857;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
    }
    .pill-badge.sale-pill {
      background: #fef3c7;
      color: #b45309;
    }

    .category-tag {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }
  `]
})
export class OwnerVehiclesComponent implements OnInit {
  vehicleService = inject(VehicleService);
  toast = inject(ToastService);
  confirm = inject(ConfirmDialogService);
  Math = Math;

  vehicles: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchVehicles();
  }

  isBike(type: string): boolean {
    return ['Bike', 'Scooter'].includes(type);
  }

  fetchVehicles() {
    this.loading = true;
    this.vehicleService.getOwnerVehicles().subscribe({
      next: (res) => {
        this.vehicles = res.data || res.vehicles || res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  async deleteVehicle(id: string) {
    const confirmed = await this.confirm.show('Delete Vehicle', 'Are you sure you want to remove this vehicle from your fleet?');
    if (confirmed) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.toast.success('Vehicle deleted successfully');
          this.fetchVehicles();
        },
        error: () => this.toast.error('Failed to delete vehicle')
      });
    }
  }
}
