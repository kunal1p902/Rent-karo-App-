import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="zoom-navbar">
      <div class="container navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-logo">
          <div class="logo-icon">⚡</div>
          <span class="logo-text">Rent<span class="logo-green">Karo</span></span>
          <span class="zoom-tag">Car & Bike</span>
        </a>

        <!-- City Selector Pill -->
        <div class="city-selector-pill" (click)="toggleCityModal()">
          <span class="city-icon">📍</span>
          <div class="city-info">
            <span class="city-label">Location</span>
            <span class="city-name">{{ selectedCity }} ▼</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="navbar-menu">
          <a routerLink="/vehicles" routerLinkActive="active" [queryParams]="{listingType: 'rent'}" class="nav-link">🔑 Rent Rides</a>
          <a routerLink="/vehicles" routerLinkActive="active" [queryParams]="{listingType: 'sale'}" class="nav-link">🏷️ Buy Rides</a>
          <a routerLink="/vehicles" routerLinkActive="active" [queryParams]="{type: 'Car'}" class="nav-link">🚗 Cars</a>
          <a routerLink="/vehicles" routerLinkActive="active" [queryParams]="{type: 'Bike'}" class="nav-link">🏍️ Bikes</a>

          @if (auth.isLoggedIn()) {
            @if (auth.getUserRole() === 'USER') {
              <a routerLink="/user/bookings" routerLinkActive="active" class="nav-link">My Bookings</a>
              <a routerLink="/user/wishlist" routerLinkActive="active" class="nav-link">Wishlist ❤️</a>
            } @else if (auth.getUserRole() === 'OWNER') {
              <a routerLink="/owner/dashboard" routerLinkActive="active" class="nav-link">Host Dashboard</a>
              <a routerLink="/owner/vehicles" routerLinkActive="active" class="nav-link">My Fleet</a>
            }
          }
        </div>

        <!-- Action & Mode Switcher -->
        <div class="navbar-actions">
          
          <!-- Mode Switch Button -->
          <a [routerLink]="auth.getUserRole() === 'OWNER' ? '/vehicles' : '/owner/vehicles'" class="role-switch-btn">
            {{ auth.getUserRole() === 'OWNER' ? '👤 Switch to Buyer View' : '🏢 Host/Seller Console' }}
          </a>

          @if (!auth.isLoggedIn()) {
            <a routerLink="/auth/login" class="btn btn-sm btn-outline-light">Login</a>
            <a routerLink="/auth/register" class="btn btn-sm btn-primary">Sign Up</a>
            <a routerLink="/auth/owner-login" class="btn btn-sm btn-dark-outline">Become Host</a>
          } @else {
            <div class="user-dropdown">
              <div class="avatar" (click)="toggleDropdown()">
                {{ getUserInitial() }}
              </div>
              @if (dropdownOpen) {
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <strong>{{ auth.getCurrentUser()?.name }}</strong>
                    <span class="dropdown-role">{{ auth.getUserRole() }}</span>
                  </div>
                  <hr>
                  @if (auth.getUserRole() === 'USER') {
                    <a routerLink="/user/dashboard" (click)="dropdownOpen=false" class="dropdown-item">User Dashboard</a>
                    <a routerLink="/user/profile" (click)="dropdownOpen=false" class="dropdown-item">My Profile</a>
                  } @else {
                    <a routerLink="/owner/dashboard" (click)="dropdownOpen=false" class="dropdown-item">Owner Dashboard</a>
                    <a routerLink="/owner/vehicles" (click)="dropdownOpen=false" class="dropdown-item">My Vehicles Fleet</a>
                    <a routerLink="/owner/earnings" (click)="dropdownOpen=false" class="dropdown-item">Earnings & Sales</a>
                  }
                  <hr>
                  <button (click)="logout()" class="dropdown-item text-danger">Logout</button>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </nav>

    <!-- City Selector Modal -->
    @if (cityModalOpen) {
      <div class="modal-overlay" (click)="cityModalOpen=false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Select City Location 📍</h3>
            <button class="close-btn" (click)="cityModalOpen=false">✕</button>
          </div>
          <div class="cities-grid">
            @for (city of cities; track city) {
              <div class="city-card" [class.active]="city === selectedCity" (click)="selectCity(city)">
                <span class="city-emoji">🏙️</span>
                <span>{{ city }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .zoom-navbar {
      background: #0f172a;
      color: #ffffff;
      height: 72px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .logo-icon {
      background: #2563eb;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 900;
      color: white;
      letter-spacing: -0.5px;
    }
    .logo-green { color: #60a5fa; }
    .zoom-tag {
      font-size: 10px;
      font-weight: 800;
      background: rgba(37, 99, 235, 0.2);
      color: #60a5fa;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .city-selector-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      padding: 6px 14px;
      border-radius: 24px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.15);
      transition: all 0.2s ease;
    }
    .city-selector-pill:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #3b82f6;
    }
    .city-icon { font-size: 14px; }
    .city-info { display: flex; flex-direction: column; }
    .city-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 800; }
    .city-name { font-size: 12px; font-weight: 800; color: #ffffff; }

    .navbar-menu {
      display: flex;
      gap: 20px;
    }
    .nav-link {
      font-size: 14px;
      font-weight: 700;
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: #60a5fa;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .role-switch-btn {
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .role-switch-btn:hover {
      background: #2563eb;
      color: white;
    }

    .btn-outline-light {
      border: 1.5px solid rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
    }
    .btn-outline-light:hover { background: rgba(255,255,255,0.1); }
    
    .btn-dark-outline {
      border: 1.5px solid #2563eb;
      color: #60a5fa;
      text-decoration: none;
    }
    .btn-dark-outline:hover { background: #2563eb; color: white; }

    .user-dropdown { position: relative; }
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }
    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 48px;
      background: white;
      color: #0f172a;
      width: 220px;
      border-radius: 14px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border: 1px solid #e2e8f0;
    }
    .dropdown-header { padding: 8px 12px; display: flex; flex-direction: column; }
    .dropdown-role { font-size: 11px; color: #2563eb; font-weight: 800; text-transform: uppercase; }
    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
    }
    .dropdown-item:hover { background: #f1f5f9; }
    .text-danger { color: #ef4444; }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      color: #0f172a;
      width: 440px;
      max-width: 90vw;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-header h3 { font-size: 18px; font-weight: 800; }
    .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; }
    .cities-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .city-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .city-card:hover, .city-card.active {
      border-color: #2563eb;
      background: #eff6ff;
      color: #1d4ed8;
    }

    @media (max-width: 900px) {
      .navbar-menu { display: none; }
      .city-selector-pill { display: none; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);

  dropdownOpen = false;
  cityModalOpen = false;
  selectedCity = 'Mumbai';
  cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Goa', 'Ahmedabad', 'Hyderabad', 'Jaipur'];

  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }
  toggleCityModal() { this.cityModalOpen = !this.cityModalOpen; }

  selectCity(city: string) {
    this.selectedCity = city;
    this.cityModalOpen = false;
    this.router.navigate(['/vehicles'], { queryParams: { location: city } });
  }

  getUserInitial(): string {
    const user = this.auth.getCurrentUser();
    return user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
  }

  logout() {
    this.auth.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
}
