import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container section">
      <div class="card max-w-4xl mx-auto zoom-form-card">
        <div class="form-header border-b pb-4 mb-6">
          <span class="role-badge">Host & Seller Portal</span>
          <h2 class="text-2xl font-bold">List Vehicle for Rent or Sale 🚗🏍️</h2>
          <p class="text-secondary text-sm">Add your car or bike to Rent-Karo to start renting out or selling instantly</p>
        </div>

        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
          
          <!-- Listing Purpose Selector -->
          <div class="purpose-selection-box mb-8">
            <label class="form-label font-bold text-base mb-3 block text-primary">Choose Listing Purpose:</label>
            <div class="grid-2 gap-4">
              <label class="purpose-card" [class.selected]="vehicleForm.value.listingType === 'rent'">
                <input type="radio" formControlName="listingType" value="rent">
                <div class="purpose-content">
                  <span class="icon">🔑</span>
                  <div>
                    <div class="font-bold text-base">List For Rent</div>
                    <div class="text-xs text-secondary">Earn daily passive income on your vehicle</div>
                  </div>
                </div>
              </label>

              <label class="purpose-card" [class.selected]="vehicleForm.value.listingType === 'sale'">
                <input type="radio" formControlName="listingType" value="sale">
                <div class="purpose-content">
                  <span class="icon">🏷️</span>
                  <div>
                    <div class="font-bold text-base">List For Sale</div>
                    <div class="text-xs text-secondary">Sell your vehicle directly to verified buyers</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <h3 class="font-bold text-lg mb-4 text-primary">1. Basic Vehicle Information</h3>
          <div class="grid-3 mb-6">
            <div class="form-group">
              <label class="form-label">Brand</label>
              <input type="text" formControlName="brand" class="form-control" placeholder="e.g. Honda, Royal Enfield, Hyundai" />
            </div>
            <div class="form-group">
              <label class="form-label">Model</label>
              <input type="text" formControlName="model" class="form-control" placeholder="e.g. Creta, Thar, Classic 350" />
            </div>
            <div class="form-group">
              <label class="form-label">Vehicle Category</label>
              <select formControlName="type" class="form-control">
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>

          <div class="grid-3 mb-8">
            <div class="form-group">
              <label class="form-label">Registration Number</label>
              <input type="text" formControlName="registrationNumber" class="form-control" placeholder="e.g. MH01AB1234" />
            </div>
            <div class="form-group">
              <label class="form-label">Model Year</label>
              <input type="number" formControlName="year" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Color</label>
              <input type="text" formControlName="color" class="form-control" placeholder="e.g. Pearl White" />
            </div>
          </div>

          <h3 class="font-bold text-lg mb-4 text-primary">2. Specs & Details</h3>
          <div class="grid-3 mb-8">
            <div class="form-group">
              <label class="form-label">Fuel Type</label>
              <select formControlName="fuelType" class="form-control">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Transmission</label>
              <select formControlName="transmission" class="form-control">
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Seating Capacity</label>
              <input type="number" formControlName="seats" class="form-control" />
            </div>
          </div>

          <h3 class="font-bold text-lg mb-4 text-primary">3. Pricing, Location & Inventory Quantity</h3>
          <div class="grid-3 mb-6">
            @if (vehicleForm.value.listingType === 'sale') {
              <div class="form-group">
                <label class="form-label">Total Sale Price (₹)</label>
                <input type="number" formControlName="salePrice" class="form-control" placeholder="e.g. 450000" />
              </div>
            } @else {
              <div class="form-group">
                <label class="form-label">Price per Day (₹)</label>
                <input type="number" formControlName="pricePerDay" class="form-control" placeholder="e.g. 1500" />
              </div>
              <div class="form-group">
                <label class="form-label">Security Deposit (₹)</label>
                <input type="number" formControlName="securityDeposit" class="form-control" placeholder="e.g. 1000" />
              </div>
            }
            
            <div class="form-group">
              <label class="form-label">Quantity Available (Stock)</label>
              <input type="number" formControlName="quantity" class="form-control" placeholder="e.g. 2" />
            </div>
          </div>
          
          <div class="form-group mb-8">
            <label class="form-label">Hub / City Location</label>
            <select formControlName="location" class="form-control">
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Goa">Goa</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          </div>

          <div class="form-group mb-6">
            <label class="form-label">Description</label>
            <textarea formControlName="description" class="form-control" rows="3" placeholder="Highlight vehicle cleanliness, service history, condition guarantees..."></textarea>
          </div>

          <div class="form-group mb-8">
            <label class="form-label">Image URL (Optional)</label>
            <div class="input-with-btn">
              <input type="text" #imgInput class="form-control" placeholder="Paste image URL (Unsplash/Imgur)" />
              <button type="button" class="btn btn-sm btn-outline" (click)="addImage(imgInput.value); imgInput.value=''">Add Photo</button>
            </div>
            
            <div class="image-preview-grid mt-4">
              @for (img of images; track img; let idx = $index) {
                <div class="preview-item">
                  <img [src]="img" class="preview-img" />
                  <button type="button" class="remove-btn" (click)="removeImage(idx)">✕</button>
                </div>
              }
            </div>
          </div>

          <div class="flex justify-end gap-4 border-t pt-6">
            <button type="button" class="btn btn-outline" (click)="router.navigate(['/owner/vehicles'])">Cancel</button>
            <button type="submit" class="btn btn-primary btn-lg" [disabled]="vehicleForm.invalid || loading">
              {{ loading ? 'Publishing...' : 'Publish Listing & Go Live 🚀' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .zoom-form-card { border-radius: 24px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .max-w-4xl { max-width: 920px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .text-2xl { font-size: 26px; }
    .text-lg { font-size: 18px; }
    .role-badge { font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; }
    .text-primary { color: #2563eb; }
    .font-bold { font-weight: 700; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    
    .purpose-selection-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .purpose-card {
      background: white;
      border: 2px solid #cbd5e1;
      border-radius: 14px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;
    }
    .purpose-card input { display: none; }
    .purpose-card.selected {
      border-color: #2563eb;
      background: #eff6ff;
    }
    .purpose-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .purpose-content .icon {
      font-size: 24px;
    }

    .input-with-btn { display: flex; gap: 10px; }
    .image-preview-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .preview-item { position: relative; width: 100px; height: 75px; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; }
    .preview-img { width: 100%; height: 100%; object-fit: cover; }
    .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; font-size: 12px; cursor: pointer; }
    
    @media (max-width: 768px) {
      .grid-3, .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class AddVehicleComponent {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private toast = inject(ToastService);
  router = inject(Router);

  loading = false;
  images: string[] = [];

  vehicleForm = this.fb.group({
    listingType: ['rent', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    type: ['Car', Validators.required],
    registrationNumber: ['', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    color: ['White', Validators.required],
    fuelType: ['Petrol', Validators.required],
    transmission: ['Manual', Validators.required],
    seats: [5, Validators.required],
    pricePerDay: [1500],
    salePrice: [450000],
    securityDeposit: [1000],
    quantity: [2, [Validators.required, Validators.min(1)]],
    location: ['Mumbai', Validators.required],
    description: ['Clean, sanitized & well-maintained vehicle.', Validators.required]
  });

  addImage(url: string) {
    if (url && url.trim()) {
      this.images.push(url.trim());
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  getDefaultImages(type: string): string[] {
    switch (type) {
      case 'Bike':
      case 'Scooter':
        return ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'];
      case 'SUV':
        return ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'];
      default:
        return ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'];
    }
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      this.toast.error('Please complete all required fields');
      return;
    }
    this.loading = true;

    const type = this.vehicleForm.value.type || 'Car';
    const finalImages = this.images.length > 0 ? this.images : this.getDefaultImages(type);
    const pricePerDay = Number(this.vehicleForm.value.pricePerDay) || 1500;
    const quantity = Number(this.vehicleForm.value.quantity) || 1;
    const listingType = this.vehicleForm.value.listingType || 'rent';
    const salePrice = Number(this.vehicleForm.value.salePrice) || 0;

    const payload = {
      ...this.vehicleForm.value,
      listingType,
      salePrice,
      name: `${this.vehicleForm.value.brand} ${this.vehicleForm.value.model}`,
      images: finalImages,
      pricePerHour: Math.round(pricePerDay / 15),
      pricePerWeek: pricePerDay * 6,
      quantity,
      availableQuantity: quantity,
      status: 'available'
    };

    this.vehicleService.createVehicle(payload as any).subscribe({
      next: () => {
        this.toast.success(`🎉 Vehicle published for ${listingType === 'sale' ? 'Sale' : 'Rent'} on RentKaro!`);
        this.router.navigate(['/vehicles']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to add vehicle');
        this.loading = false;
      }
    });
  }
}
