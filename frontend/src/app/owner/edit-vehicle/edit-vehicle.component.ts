import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container section">
      @if (initialLoading) {
        <div class="text-center py-8">Loading vehicle details...</div>
      } @else {
        <div class="card max-w-4xl mx-auto zoom-form-card">
          <h2 class="text-2xl font-bold mb-6 border-b pb-4">Edit Vehicle Listing ✏️</h2>

          <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
            
            <div class="form-group mb-6">
              <label class="form-label font-bold">Listing Purpose</label>
              <select formControlName="listingType" class="form-control">
                <option value="rent">🔑 For Rent (Daily rate)</option>
                <option value="sale">🏷️ For Sale (Outright sale price)</option>
              </select>
            </div>

            <h3 class="font-bold text-lg mb-4 text-primary">Basic Information</h3>
            <div class="grid-3 mb-6">
              <div class="form-group">
                <label class="form-label">Brand</label>
                <input type="text" formControlName="brand" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Model</label>
                <input type="text" formControlName="model" class="form-control">
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

            <div class="grid-3 mb-6">
              @if (vehicleForm.value.listingType === 'sale') {
                <div class="form-group">
                  <label class="form-label">Sale Price (₹)</label>
                  <input type="number" formControlName="salePrice" class="form-control">
                </div>
              } @else {
                <div class="form-group">
                  <label class="form-label">Price per Day (₹)</label>
                  <input type="number" formControlName="pricePerDay" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">Security Deposit (₹)</label>
                  <input type="number" formControlName="securityDeposit" class="form-control">
                </div>
              }
              
              <div class="form-group">
                <label class="form-label">Quantity Stock</label>
                <input type="number" formControlName="quantity" class="form-control">
              </div>
            </div>
            
            <div class="grid-2 mb-6">
              <div class="form-group">
                <label class="form-label">Hub / City Location</label>
                <input type="text" formControlName="location" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Availability Status</label>
                <select formControlName="status" class="form-control">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div class="form-group mb-6">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-control" rows="4"></textarea>
            </div>

            <div class="flex justify-end gap-4 border-t pt-6">
              <button type="button" class="btn btn-outline" (click)="router.navigate(['/owner/vehicles'])">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="vehicleForm.invalid || loading">
                {{ loading ? 'Saving Changes...' : 'Save & Update Vehicle' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .zoom-form-card { border-radius: 20px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    .max-w-4xl { max-width: 900px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .text-2xl { font-size: 24px; }
    .text-lg { font-size: 18px; }
    .text-primary { color: #2563eb; }
    .font-bold { font-weight: 700; }
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .border-t { border-top: 1px solid #e2e8f0; }
    .pb-4 { padding-bottom: 16px; }
    .pt-6 { padding-top: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 768px) {
      .grid-3, .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class EditVehicleComponent implements OnInit {
  fb = inject(FormBuilder);
  vehicleService = inject(VehicleService);
  toast = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = false;
  initialLoading = true;
  vehicleId = '';

  vehicleForm = this.fb.group({
    listingType: ['rent', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    type: ['Car', Validators.required],
    pricePerDay: [0],
    salePrice: [0],
    securityDeposit: [0],
    quantity: [1, [Validators.required, Validators.min(1)]],
    status: ['available', Validators.required],
    location: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.vehicleId) {
      this.vehicleService.getVehicle(this.vehicleId).subscribe({
        next: (res) => {
          const v = res.data || res.vehicle || res;
          if (v) {
            this.vehicleForm.patchValue(v);
          }
          this.initialLoading = false;
        },
        error: () => {
          this.toast.error('Failed to load vehicle details');
          this.initialLoading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.vehicleForm.invalid) return;
    this.loading = true;
    
    this.vehicleService.updateVehicle(this.vehicleId, this.vehicleForm.value as any).subscribe({
      next: () => {
        this.toast.success('Vehicle listing updated successfully!');
        this.router.navigate(['/owner/vehicles']);
      },
      error: () => {
        this.toast.error('Failed to update vehicle');
        this.loading = false;
      }
    });
  }
}
