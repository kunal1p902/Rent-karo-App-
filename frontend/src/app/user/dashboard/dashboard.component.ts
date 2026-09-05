import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { SocketService } from '../../core/services/socket.service';
import { User } from '../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <div class="dashboard-header-banner card">
        <div class="header-left">
          <span class="user-role-tag">Customer Portal</span>
          <h1 class="welcome-text">Welcome back, {{ user?.name }}! 👋</h1>
          <p class="subtitle-text">Track your rentals, active trips & live updates in real time.</p>
        </div>
        <div class="header-right">
          <div class="live-pill">
            <span class="pulse-indicator"></span>
            <span>Realtime Connection Active</span>
          </div>
          <a routerLink="/" class="btn btn-primary btn-lg mt-4">Book New Ride 🚀</a>
        </div>
      </div>

      <div class="stats-grid mt-6">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ activeBookingsCount }}</div>
            <div class="stat-label">Active & Upcoming Trips</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">{{ completedBookingsCount }}</div>
            <div class="stat-label">Completed Trips</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-info">
            <div class="stat-value">{{ user?.wishlist?.length || 0 }}</div>
            <div class="stat-label">Saved Wishlist Rides</div>
          </div>
        </div>
      </div>

      <div class="card mt-8">
        <div class="section-title-bar">
          <div>
            <h3 class="text-xl font-bold">Your Bookings Timeline</h3>
            <p class="text-secondary text-sm">Real-time status changes from vehicle hosts</p>
          </div>
          <a routerLink="/user/bookings" class="btn btn-sm btn-outline">View All Bookings</a>
        </div>

        <div class="table-container mt-4">
          <table class="zoom-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle Name</th>
                <th>Pickup & Return</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (booking of recentBookings; track booking._id) {
                <tr>
                  <td class="font-bold font-mono">#{{ booking.bookingId }}</td>
                  <td class="font-bold">{{ booking.vehicleId?.name || (booking.vehicleId?.brand + ' ' + booking.vehicleId?.model) }}</td>
                  <td>{{ booking.pickupDate | date:'mediumDate' }} ➔ {{ booking.returnDate | date:'mediumDate' }}</td>
                  <td class="font-bold text-green">₹{{ booking.totalAmount }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + booking.bookingStatus.toLowerCase()">
                      {{ booking.bookingStatus }}
                    </span>
                  </td>
                </tr>
              }
              @if (recentBookings.length === 0) {
                <tr>
                  <td colspan="5" class="empty-cell">No bookings found. Ready for your next journey?</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header-banner {
      background: linear-gradient(135deg, var(--dark-header) 0%, #1e293b 100%);
      color: white;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 20px;
    }
    .user-role-tag {
      font-size: 11px;
      font-weight: 800;
      background: rgba(16, 185, 129, 0.2);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .welcome-text { font-size: 32px; font-weight: 900; margin: 8px 0 4px; }
    .subtitle-text { color: #94a3b8; font-size: 15px; }

    .live-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow);
    }
    .stat-icon { font-size: 32px; background: var(--primary-light); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .stat-value { font-size: 28px; font-weight: 900; color: var(--text); }
    .stat-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; }

    .section-title-bar { display: flex; justify-content: space-between; align-items: center; }
    .zoom-table { width: 100%; border-collapse: collapse; text-align: left; }
    .zoom-table th { padding: 14px 16px; font-size: 12px; text-transform: uppercase; color: var(--text-secondary); border-bottom: 2px solid var(--border); }
    .zoom-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .text-green { color: #059669; }
    .empty-cell { text-align: center; padding: 40px 0; color: var(--text-secondary); }

    .badge-pending { background: #fffbeb; color: #b45309; }
    .badge-confirmed, .badge-active { background: #ecfdf5; color: #047857; }
    .badge-completed { background: #f0fdf4; color: #15803d; }
    .badge-cancelled, .badge-rejected { background: #fef2f2; color: #b91c1c; }

    @media (max-width: 768px) {
      .dashboard-header-banner { flex-direction: column; align-items: flex-start; gap: 20px; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  bookingService = inject(BookingService);
  socketService = inject(SocketService);
  
  user: User | null = null;
  recentBookings: any[] = [];
  activeBookingsCount = 0;
  completedBookingsCount = 0;

  private socketSub!: Subscription;

  ngOnInit() {
    this.user = this.auth.getCurrentUser() as User;
    this.fetchData();

    // ⚡ Real-Time Listener for Booking Status updates from Host
    this.socketSub = this.socketService.onBookingStatusUpdated().subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
  }

  fetchData() {
    this.bookingService.getUserBookings().subscribe(res => {
      const bookings = res.bookings || res.data || [];
      this.recentBookings = bookings;
      this.activeBookingsCount = bookings.filter((b: any) => ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.bookingStatus)).length;
      this.completedBookingsCount = bookings.filter((b: any) => b.bookingStatus === 'COMPLETED').length;
    });
  }
}
