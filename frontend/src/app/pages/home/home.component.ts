import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { SocketService } from '../../core/services/socket.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCardComponent } from '../../shared/vehicle-card/vehicle-card.component';
import { LoadingSkeletonComponent } from '../../shared/loading-skeleton/loading-skeleton.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, VehicleCardComponent, LoadingSkeletonComponent],
  template: `
    <!-- Zoomcar Hero Banner -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-text-content">
          <span class="hero-badge">⚡ Self-Drive Vehicle Rental</span>
          <h1 class="hero-title">Never Stop Exploring. <span class="highlight">Rent Your Ride.</span></h1>
          <p class="hero-subtitle">Book cars, bikes & scooters near you with doorstep delivery and zero deposit options.</p>
        </div>

        <!-- Floating Zoomcar Search Card -->
        <div class="search-card-container">
          <!-- Delivery Toggle -->
          <div class="delivery-tabs">
            <button class="tab-btn" [class.active]="deliveryType === 'HUB'" (click)="deliveryType = 'HUB'">
              🏢 Self Pick-up at Hub
            </button>
            <button class="tab-btn" [class.active]="deliveryType === 'DOORSTEP'" (click)="deliveryType = 'DOORSTEP'">
              🚚 Doorstep Delivery
            </button>
          </div>

          <!-- Search Inputs -->
          <div class="search-grid">
            @if (deliveryType === 'DOORSTEP') {
              <div class="input-box full-width">
                <label>Delivery Address</label>
                <input type="text" [(ngModel)]="deliveryAddress" placeholder="Enter delivery locality, landmark or address" class="search-input" />
              </div>
            }

            <div class="input-box">
              <label>Pickup Location</label>
              <select [(ngModel)]="selectedLocation" (change)="onFilterChange()" class="search-select">
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <div class="input-box">
              <label>Pickup Date & Time</label>
              <input type="datetime-local" [(ngModel)]="pickupDateTime" (change)="calculateDuration()" class="search-input" />
            </div>

            <div class="input-box">
              <label>Return Date & Time</label>
              <input type="datetime-local" [(ngModel)]="returnDateTime" (change)="calculateDuration()" class="search-input" />
            </div>

            <div class="search-btn-box">
              <button class="btn btn-primary search-action-btn" (click)="searchVehicles()">
                Find Vehicles 🚀
              </button>
            </div>
          </div>

          <!-- Duration Pill -->
          @if (calculatedDurationText) {
            <div class="duration-banner">
              ⏱️ Trip Duration: <strong>{{ calculatedDurationText }}</strong>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Quick Category Filter Chips -->
    <section class="filters-section">
      <div class="container">
        <div class="chips-scroll">
          <button class="chip-btn" [class.active]="selectedType === ''" (click)="selectCategory('')">
            🚗 All Rides
          </button>
          <button class="chip-btn" [class.active]="selectedType === 'Car'" (click)="selectCategory('Car')">
            🚘 Cars
          </button>
          <button class="chip-btn" [class.active]="selectedType === 'Bike'" (click)="selectCategory('Bike')">
            🏍️ Bikes
          </button>
          <button class="chip-btn" [class.active]="selectedType === 'Scooter'" (click)="selectCategory('Scooter')">
            🛵 Scooters
          </button>
          <button class="chip-btn" [class.active]="selectedType === 'SUV'" (click)="selectCategory('SUV')">
            🚙 SUVs
          </button>
          <button class="chip-btn" [class.active]="selectedType === 'Sedan'" (click)="selectCategory('Sedan')">
            🏎️ Sedans
          </button>
          <button class="chip-btn" [class.active]="selectedTransmission === 'Automatic'" (click)="toggleTransmission('Automatic')">
            ⚡ Automatic
          </button>
        </div>
      </div>
    </section>

    <!-- Vehicles List Section -->
    <section class="vehicles-section section">
      <div class="container">
        <div class="section-header-row">
          <div>
            <h2 class="section-title">Available Vehicles</h2>
            <p class="section-subtitle">Choose from clean, sanitized & insured self-drive vehicles</p>
          </div>
          <div class="count-badge">
            <span class="pulse-indicator"></span>
            <span>{{ vehicles.length }} Available Live</span>
          </div>
        </div>

        @if (loading) {
          <app-loading-skeleton [count]="6"></app-loading-skeleton>
        } @else if (vehicles.length === 0) {
          <div class="empty-state card">
            <h3>No Vehicles Found</h3>
            <p>Try adjusting your search location or category filters.</p>
            <button class="btn btn-primary" (click)="resetFilters()">Reset All Filters</button>
          </div>
        } @else {
          <div class="vehicles-grid">
            @for (vehicle of vehicles; track vehicle._id) {
              <app-vehicle-card [vehicle]="vehicle"></app-vehicle-card>
            }
          </div>
        }
      </div>
    </section>

    <!-- Why Choose ZoomKaro Perks -->
    <section class="perks-section">
      <div class="container">
        <h2 class="perks-title">Why Rent With RentKaro?</h2>
        <div class="perks-grid">
          <div class="perk-card">
            <div class="perk-icon">🛡️</div>
            <h3>Zero Security Deposit</h3>
            <p>Enjoy flexible rental options without heavy upfront security deposits.</p>
          </div>
          <div class="perk-card">
            <div class="perk-icon">🚚</div>
            <h3>Doorstep Delivery</h3>
            <p>Get your chosen car or bike delivered right to your doorstep or airport terminal.</p>
          </div>
          <div class="perk-card">
            <div class="perk-icon">⚡</div>
            <h3>Unlimited KMs</h3>
            <p>Drive freely across city and highways with no distance restriction penalties.</p>
          </div>
          <div class="perk-card">
            <div class="perk-icon">🛠️</div>
            <h3>24/7 Roadside Assist</h3>
            <p>Full breakdown insurance and round-the-clock emergency support.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Banner */
    .hero-section {
      background: linear-gradient(180deg, var(--dark-header) 0%, #020617 100%);
      color: white;
      padding: 60px 0 100px;
      position: relative;
    }
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .hero-badge {
      background: rgba(16, 185, 129, 0.15);
      color: var(--primary);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
      display: inline-block;
    }
    .hero-title {
      font-size: 48px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-bottom: 16px;
      max-width: 800px;
    }
    .highlight { color: var(--primary); }
    .hero-subtitle {
      font-size: 18px;
      color: #94a3b8;
      max-width: 640px;
      margin-bottom: 40px;
    }

    /* Floating Search Card */
    .search-card-container {
      background: white;
      color: var(--text);
      border-radius: 24px;
      padding: 24px;
      width: 100%;
      max-width: 1100px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255,255,255,0.1);
      margin-bottom: -120px;
      position: relative;
      z-index: 10;
    }
    .delivery-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
    }
    .tab-btn {
      background: #f1f5f9;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: var(--primary-light);
      color: var(--primary-dark);
      border: 1.5px solid var(--primary);
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      align-items: flex-end;
    }
    .full-width { grid-column: span 4; }
    
    .input-box { display: flex; flex-direction: column; text-align: left; }
    .input-box label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .search-input, .search-select {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
    }
    .search-input:focus, .search-select:focus {
      border-color: var(--primary);
      outline: none;
    }

    .search-btn-box { grid-column: span 1; }
    .search-action-btn { width: 100%; height: 46px; border-radius: 10px; }

    .duration-banner {
      margin-top: 16px;
      background: #ecfdf5;
      color: #047857;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      text-align: left;
    }

    /* Filters Section */
    .filters-section {
      padding-top: 100px;
      padding-bottom: 20px;
    }
    .chips-scroll {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .chip-btn {
      background: white;
      border: 1.5px solid var(--border);
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .chip-btn:hover, .chip-btn.active {
      background: var(--dark-header);
      color: white;
      border-color: var(--dark-header);
    }

    /* Vehicles Section */
    .section-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .count-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ecfdf5;
      color: #047857;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
    }
    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    /* Perks */
    .perks-section {
      background: #ffffff;
      padding: 60px 0;
      border-top: 1px solid var(--border);
    }
    .perks-title { font-size: 28px; font-weight: 900; text-align: center; margin-bottom: 40px; }
    .perks-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .perk-card {
      padding: 24px;
      border-radius: 16px;
      background: #f8fafc;
      text-align: center;
      border: 1px solid var(--border);
    }
    .perk-icon { font-size: 36px; margin-bottom: 16px; }
    .perk-card h3 { font-size: 17px; font-weight: 800; margin-bottom: 8px; }
    .perk-card p { font-size: 13px; color: var(--text-secondary); }

    .empty-state { text-align: center; padding: 48px; }

    @media (max-width: 1024px) {
      .search-grid { grid-template-columns: repeat(2, 1fr); }
      .full-width { grid-column: span 2; }
      .vehicles-grid { grid-template-columns: repeat(2, 1fr); }
      .perks-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .hero-title { font-size: 32px; }
      .search-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .vehicles-grid { grid-template-columns: 1fr; }
      .perks-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private vehicleService = inject(VehicleService);
  private socketService = inject(SocketService);

  vehicles: Vehicle[] = [];
  loading = true;

  deliveryType: 'HUB' | 'DOORSTEP' = 'HUB';
  deliveryAddress = '';
  selectedLocation = '';
  selectedType = '';
  selectedTransmission = '';
  pickupDateTime = '';
  returnDateTime = '';
  calculatedDurationText = '';

  private socketSub!: Subscription;

  ngOnInit() {
    this.fetchVehicles();
    this.setDefaultDates();

    // Listen for real-time WebSocket vehicle updates
    this.socketSub = this.socketService.onVehicleAvailabilityUpdated().subscribe(() => {
      this.fetchVehicles();
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
  }

  setDefaultDates() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    this.pickupDateTime = tomorrow.toISOString().slice(0, 16);
    this.returnDateTime = dayAfter.toISOString().slice(0, 16);
    this.calculateDuration();
  }

  calculateDuration() {
    if (!this.pickupDateTime || !this.returnDateTime) return;
    const start = new Date(this.pickupDateTime).getTime();
    const end = new Date(this.returnDateTime).getTime();
    if (end > start) {
      const diffMs = end - start;
      const hours = Math.round(diffMs / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      const remHours = hours % 24;
      this.calculatedDurationText = `${days} Days ${remHours > 0 ? remHours + ' Hours' : ''}`;
    } else {
      this.calculatedDurationText = '';
    }
  }

  fetchVehicles() {
    this.loading = true;
    const params: any = {};
    if (this.selectedLocation) params.location = this.selectedLocation;
    if (this.selectedType) params.type = this.selectedType;
    if (this.selectedTransmission) params.transmission = this.selectedTransmission;

    this.vehicleService.getVehicles(params).subscribe({
      next: (res) => {
        this.vehicles = res.vehicles || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selectCategory(type: string) {
    this.selectedType = type;
    this.fetchVehicles();
  }

  toggleTransmission(trans: string) {
    this.selectedTransmission = this.selectedTransmission === trans ? '' : trans;
    this.fetchVehicles();
  }

  onFilterChange() {
    this.fetchVehicles();
  }

  searchVehicles() {
    this.fetchVehicles();
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedType = '';
    this.selectedTransmission = '';
    this.fetchVehicles();
  }
}
