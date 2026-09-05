import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCardComponent } from '../../shared/vehicle-card/vehicle-card.component';
import { LoadingSkeletonComponent } from '../../shared/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, VehicleCardComponent, LoadingSkeletonComponent],
  template: `
    <!-- Top Hero Banner -->
    <div class="vehicles-hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">⚡ RENT OR BUY CARS & BIKES</span>
          <h1>Explore Vehicles Near You</h1>
          <p>Find self-drive cars, motorbikes, and scooters for rent or direct purchase in your city.</p>

          <!-- Quick Category Tabs -->
          <div class="category-tabs">
            <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="setTab('all')">
              ✨ All Listings
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'rent'" (click)="setTab('rent')">
              🔑 For Rent
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'sale'" (click)="setTab('sale')">
              🏷️ For Sale
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'Car'" (click)="setTab('Car')">
              🚗 Cars
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'Bike'" (click)="setTab('Bike')">
              🏍️ Bikes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container section pt-6">
      <div class="vehicles-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">Filters</h3>
              <button class="reset-link" (click)="resetFilters()">Reset All</button>
            </div>

            <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
              
              <!-- Search Bar -->
              <div class="form-group mb-4">
                <label class="form-label">Search Make / Model</label>
                <input type="text" formControlName="search" class="form-control" placeholder="e.g. Creta, Thar, Hunter..." (input)="applyFilters()">
              </div>

              <!-- Location Hub -->
              <div class="form-group mb-4">
                <label class="form-label">📍 Hub Location / City</label>
                <select formControlName="location" class="form-control" (change)="applyFilters()">
                  <option value="">All Cities</option>
                  @for (city of popularCities; track city) {
                    <option [value]="city">{{ city }}</option>
                  }
                </select>
              </div>

              <!-- Listing Purpose (Rent vs Sell) -->
              <div class="form-group mb-4">
                <label class="form-label">Listing Purpose</label>
                <select formControlName="listingType" class="form-control" (change)="applyFilters()">
                  <option value="">All (Rent & Sale)</option>
                  <option value="rent">🔑 For Rent</option>
                  <option value="sale">🏷️ For Sale</option>
                </select>
              </div>

              <!-- Vehicle Type -->
              <div class="form-group mb-4">
                <label class="form-label">Vehicle Category</label>
                <select formControlName="type" class="form-control" (change)="applyFilters()">
                  <option value="">All Categories</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike / Scooter</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>

              <!-- Fuel Type -->
              <div class="form-group mb-4">
                <label class="form-label">Fuel Type</label>
                <select formControlName="fuelType" class="form-control" (change)="applyFilters()">
                  <option value="">Any Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric ⚡</option>
                </select>
              </div>

              <!-- Transmission -->
              <div class="form-group mb-6">
                <label class="form-label">Transmission</label>
                <select formControlName="transmission" class="form-control" (change)="applyFilters()">
                  <option value="">Any Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary w-full">Apply Filters</button>
            </form>
          </div>
        </aside>

        <!-- Main Vehicles Grid -->
        <main class="vehicles-main">
          <!-- Top Results Bar -->
          <div class="results-header-bar">
            <div class="results-count">
              <h2>Showing {{ filteredVehicles.length }} Vehicles</h2>
              <p class="text-secondary text-sm">Cars & Bikes available for rent or purchase</p>
            </div>

            <div class="sort-controls">
              <label class="text-sm font-semibold mr-2">Sort By:</label>
              <select class="form-control sort-select" (change)="onSortChange($event)">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <!-- Active Filter Pills -->
          @if (hasActiveFilters()) {
            <div class="active-pills-row mb-6">
              <span class="pill-title">Active Filters:</span>
              @if (filterForm.value.location) {
                <span class="filter-pill">📍 {{ filterForm.value.location }} <button (click)="clearFilter('location')">✕</button></span>
              }
              @if (filterForm.value.listingType) {
                <span class="filter-pill">{{ filterForm.value.listingType === 'rent' ? '🔑 Rent' : '🏷️ Sale' }} <button (click)="clearFilter('listingType')">✕</button></span>
              }
              @if (filterForm.value.type) {
                <span class="filter-pill">🚘 {{ filterForm.value.type }} <button (click)="clearFilter('type')">✕</button></span>
              }
              @if (filterForm.value.search) {
                <span class="filter-pill">🔍 "{{ filterForm.value.search }}" <button (click)="clearFilter('search')">✕</button></span>
              }
            </div>
          }

          @if (loading) {
            <app-loading-skeleton [count]="6"></app-loading-skeleton>
          } @else if (filteredVehicles.length === 0) {
            <div class="card text-center py-12 empty-card">
              <div class="text-5xl mb-4">🚗🏍️</div>
              <h3 class="text-xl font-bold">No vehicles match your criteria</h3>
              <p class="text-secondary mt-2">Try clearing your location or category filters to discover more rides.</p>
              <button class="btn btn-outline mt-6" (click)="resetFilters()">Reset All Filters</button>
            </div>
          } @else {
            <div class="grid-3">
              @for (vehicle of filteredVehicles; track vehicle._id) {
                <app-vehicle-card [vehicle]="vehicle"></app-vehicle-card>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .vehicles-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 48px 0 36px 0;
      margin-bottom: 24px;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(37, 99, 235, 0.25);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #60a5fa;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .vehicles-hero h1 {
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 8px;
    }
    .vehicles-hero p {
      color: #94a3b8;
      font-size: 15px;
      margin-bottom: 24px;
    }

    .category-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 8px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    .tab-btn.active {
      background: #2563eb;
      border-color: #3b82f6;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }

    .pt-6 { padding-top: 24px !important; }
    .vehicles-layout { display: flex; gap: 28px; align-items: flex-start; }
    .filters-sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 90px; }
    .filter-card {
      background: white;
      border-radius: 18px;
      padding: 22px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .reset-link {
      background: none;
      border: none;
      color: #2563eb;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }
    .reset-link:hover { text-decoration: underline; }

    .vehicles-main { flex: 1; }

    .results-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: white;
      padding: 16px 20px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
    }
    .results-count h2 { font-size: 20px; font-weight: 800; color: #0f172a; }
    .sort-select { width: auto; font-weight: 700; font-size: 13px; border-radius: 10px; }

    .active-pills-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .pill-title { font-size: 12px; font-weight: 700; color: #64748b; }
    .filter-pill {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .filter-pill button {
      background: none;
      border: none;
      color: #1d4ed8;
      font-weight: 900;
      cursor: pointer;
    }

    .empty-card {
      border-radius: 20px;
      padding: 60px 20px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    @media (max-width: 1100px) {
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .vehicles-layout { flex-direction: column; }
      .filters-sidebar { width: 100%; position: static; }
    }
    @media (max-width: 600px) {
      .grid-3 { grid-template-columns: 1fr; }
    }
  `]
})
export class VehiclesComponent implements OnInit {
  vehicleService = inject(VehicleService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  allVehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  loading = true;
  activeTab = 'all';

  popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Goa', 'Ahmedabad', 'Hyderabad', 'Jaipur'];

  filterForm: FormGroup = this.fb.group({
    search: [''],
    location: [''],
    listingType: [''],
    type: [''],
    fuelType: [''],
    transmission: ['']
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['location']) this.filterForm.patchValue({ location: params['location'] });
      if (params['type']) this.filterForm.patchValue({ type: params['type'] });
      if (params['listingType']) {
        this.filterForm.patchValue({ listingType: params['listingType'] });
        this.activeTab = params['listingType'];
      }
      this.fetchVehicles();
    });
  }

  fetchVehicles() {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (res) => {
        this.allVehicles = res.data || res.vehicles || res;
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'all') {
      this.filterForm.patchValue({ listingType: '', type: '' });
    } else if (tab === 'rent' || tab === 'sale') {
      this.filterForm.patchValue({ listingType: tab, type: '' });
    } else if (tab === 'Car' || tab === 'Bike') {
      this.filterForm.patchValue({ type: tab, listingType: '' });
    }
    this.applyFilters();
  }

  applyFilters() {
    const val = this.filterForm.value;
    let list = [...this.allVehicles];

    if (val.search) {
      const q = val.search.toLowerCase();
      list = list.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.brand.toLowerCase().includes(q) || 
        v.model.toLowerCase().includes(q)
      );
    }

    if (val.location) {
      list = list.filter(v => v.location.toLowerCase() === val.location.toLowerCase());
    }

    if (val.listingType) {
      list = list.filter(v => v.listingType === val.listingType);
    }

    if (val.type) {
      if (val.type === 'Car') {
        list = list.filter(v => ['Car', 'SUV', 'Sedan', 'Hatchback'].includes(v.type));
      } else if (val.type === 'Bike') {
        list = list.filter(v => ['Bike', 'Scooter'].includes(v.type));
      } else {
        list = list.filter(v => v.type === val.type);
      }
    }

    if (val.fuelType) {
      list = list.filter(v => v.fuelType === val.fuelType);
    }

    if (val.transmission) {
      list = list.filter(v => v.transmission === val.transmission);
    }

    this.filteredVehicles = list;
  }

  hasActiveFilters(): boolean {
    const v = this.filterForm.value;
    return !!(v.search || v.location || v.listingType || v.type);
  }

  clearFilter(key: string) {
    this.filterForm.patchValue({ [key]: '' });
    if (key === 'listingType' || key === 'type') this.activeTab = 'all';
    this.applyFilters();
  }

  resetFilters() {
    this.filterForm.reset({
      search: '',
      location: '',
      listingType: '',
      type: '',
      fuelType: '',
      transmission: ''
    });
    this.activeTab = 'all';
    this.applyFilters();
  }

  onSortChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'price_asc') {
      this.filteredVehicles.sort((a, b) => {
        const priceA = a.listingType === 'sale' ? (a.salePrice || 0) : a.pricePerDay;
        const priceB = b.listingType === 'sale' ? (b.salePrice || 0) : b.pricePerDay;
        return priceA - priceB;
      });
    } else if (val === 'price_desc') {
      this.filteredVehicles.sort((a, b) => {
        const priceA = a.listingType === 'sale' ? (a.salePrice || 0) : a.pricePerDay;
        const priceB = b.listingType === 'sale' ? (b.salePrice || 0) : b.pricePerDay;
        return priceB - priceA;
      });
    } else if (val === 'rating') {
      this.filteredVehicles.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }
}
