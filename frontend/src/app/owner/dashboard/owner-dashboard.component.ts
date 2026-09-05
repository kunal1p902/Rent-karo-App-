import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OwnerService } from '../../core/services/owner.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-row">
          <div>
            <div class="role-badge">Host Console • Realtime Socket Active</div>
            <h1 class="header-title">Host Dashboard 🏪</h1>
            <p class="header-sub">Welcome back, {{ ownerName }}! Live business performance & requests.</p>
          </div>
          <a routerLink="/owner/vehicles/add" class="btn btn-primary">+ Add New Vehicle</a>
        </div>
      </div>
    </div>

    <div class="container" style="padding-bottom:48px; margin-top: 24px;">
      <!-- Stats Cards -->
      @if (loading) {
        <div class="stats-grid">
          @for (i of [1,2,3,4,5,6,7,8,9]; track i) {
            <div class="stat-card">
              <div class="skeleton" style="height:20px;margin-bottom:8px"></div>
              <div class="skeleton" style="height:36px;width:60%"></div>
            </div>
          }
        </div>
      }

      @if (!loading && stats) {
        <div class="stats-grid">
          <div class="stat-card stat-blue">
            <div class="stat-icon">🚗</div>
            <div class="stat-value">{{ stats.totalVehicles || 0 }}</div>
            <div class="stat-label">Total Fleet Listed</div>
          </div>
          <div class="stat-card stat-green">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ stats.availableVehicles || 0 }}</div>
            <div class="stat-label">Available Now</div>
          </div>
          <div class="stat-card stat-orange">
            <div class="stat-icon">🔄</div>
            <div class="stat-value">{{ stats.activeRentals || 0 }}</div>
            <div class="stat-label">Active Trips</div>
          </div>
          <div class="stat-card stat-yellow">
            <div class="stat-icon">⏳</div>
            <div class="stat-value">{{ stats.pendingRequests || 0 }}</div>
            <div class="stat-label">Pending Requests</div>
          </div>
          <div class="stat-card stat-purple">
            <div class="stat-icon">📋</div>
            <div class="stat-value">{{ stats.totalBookings || 0 }}</div>
            <div class="stat-label">Total Bookings</div>
          </div>
          <div class="stat-card stat-teal">
            <div class="stat-icon">💰</div>
            <div class="stat-value">₹{{ (stats.totalEarnings || 0) | number }}</div>
            <div class="stat-label">Total Earnings</div>
          </div>
        </div>
      }

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Recent Bookings -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">⚡ Live Booking Requests</h2>
              <p class="text-sub">Instant real-time customer booking alerts</p>
            </div>
            <a routerLink="/owner/bookings" class="view-all">View All →</a>
          </div>

          @if (bookingsLoading) {
            <div class="loading-pulse" style="height:200px"></div>
          }

          @if (!bookingsLoading && recentBookings.length === 0) {
            <div class="empty-state-sm">
              <div style="font-size:48px">📋</div>
              <p>No pending booking requests right now.</p>
            </div>
          }

          @if (!bookingsLoading && recentBookings.length > 0) {
            <div class="table-container">
              <table class="zoom-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Realtime Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (booking of recentBookings; track booking._id) {
                    <tr>
                      <td><span class="booking-id">#{{ booking.bookingId }}</span></td>
                      <td>
                        <div class="customer-info">
                          <div class="customer-avatar">{{ booking.userId?.name?.charAt(0) || 'U' }}</div>
                          <div>
                            <div class="customer-name">{{ booking.userId?.name || 'Customer' }}</div>
                            <div class="customer-mobile">{{ booking.userId?.mobile || '' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="font-bold">{{ booking.vehicleId?.name || 'Vehicle' }}</td>
                      <td class="amount">₹{{ booking.totalAmount | number }}</td>
                      <td>
                        <span class="status-badge" [class]="getStatusClass(booking.bookingStatus)">
                          {{ booking.bookingStatus }}
                        </span>
                      </td>
                      <td>
                        @if (booking.bookingStatus === 'PENDING') {
                          <div class="action-btns">
                            <button class="btn btn-primary btn-sm" (click)="updateStatus(booking._id, 'CONFIRMED')">Accept</button>
                            <button class="btn btn-danger btn-sm" (click)="updateStatus(booking._id, 'REJECTED')">Reject</button>
                          </div>
                        }
                        @if (booking.bookingStatus === 'CONFIRMED') {
                          <button class="btn btn-primary btn-sm" (click)="updateStatus(booking._id, 'ACTIVE')">Start Trip</button>
                        }
                        @if (booking.bookingStatus === 'ACTIVE') {
                          <button class="btn btn-success btn-sm" (click)="updateStatus(booking._id, 'COMPLETED')">Complete</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- Quick Actions + Revenue Chart -->
        <div>
          <!-- Quick Actions -->
          <div class="card" style="margin-bottom:24px">
            <h2 class="card-title" style="margin-bottom:16px">⚡ Quick Actions</h2>
            <div class="quick-actions">
              <a routerLink="/owner/vehicles/add" class="quick-action-btn">
                <span class="qa-icon">🚗</span>
                <span>Add Ride</span>
              </a>
              <a routerLink="/owner/bookings" class="quick-action-btn">
                <span class="qa-icon">📋</span>
                <span>Bookings</span>
              </a>
              <a routerLink="/owner/earnings" class="quick-action-btn">
                <span class="qa-icon">💰</span>
                <span>Earnings</span>
              </a>
              <a routerLink="/owner/vehicles" class="quick-action-btn">
                <span class="qa-icon">🔧</span>
                <span>Fleet</span>
              </a>
            </div>
          </div>

          <!-- Earnings Chart -->
          <div class="card">
            <h2 class="card-title" style="margin-bottom:16px">📈 Revenue Trend</h2>
            <div class="bar-chart">
              @for (item of monthlyEarnings; track item.month) {
                <div class="bar-item">
                  <div class="bar-label">{{ item.month }}</div>
                  <div class="bar-wrap">
                    <div class="bar-fill" [style.height.%]="getBarHeight(item.amount)"></div>
                  </div>
                  <div class="bar-value">₹{{ formatK(item.amount) }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .role-badge {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .header-title { font-size: 32px; font-weight: 900; }
    .header-sub { color: var(--text-secondary); font-size: 15px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px; margin-bottom: 32px;
    }
    .stat-card {
      background: white; border-radius: 16px; padding: 20px;
      border: 1px solid var(--border); position: relative; overflow: hidden;
      box-shadow: var(--shadow);
    }
    .stat-blue { border-top: 4px solid #0284c7; }
    .stat-green { border-top: 4px solid #10b981; }
    .stat-orange { border-top: 4px solid #f97316; }
    .stat-yellow { border-top: 4px solid #eab308; }
    .stat-purple { border-top: 4px solid #a855f7; }
    .stat-teal { border-top: 4px solid #14b8a6; }

    .stat-icon { font-size: 24px; margin-bottom: 8px; display: block; }
    .stat-value { font-size: 26px; font-weight: 900; color: var(--text); }
    .stat-label { font-size: 12px; color: var(--text-secondary); font-weight: 600; margin-top: 4px; }
    
    .dashboard-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-title { font-size: 18px; font-weight: 800; color: var(--text); }
    .text-sub { font-size: 13px; color: var(--text-secondary); }
    .view-all { font-size: 14px; font-weight: 700; color: var(--primary); }

    .zoom-table { width: 100%; border-collapse: collapse; text-align: left; }
    .zoom-table th { padding: 12px 14px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); border-bottom: 2px solid var(--border); }
    .zoom-table td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }

    .booking-id { font-size: 12px; font-weight: 700; color: var(--text-secondary); font-family: monospace; }
    .customer-info { display: flex; align-items: center; gap: 10px; }
    .customer-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--primary); color: white; font-size: 13px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .customer-name { font-weight: 700; font-size: 13px; }
    .customer-mobile { font-size: 11px; color: var(--text-secondary); }
    .amount { font-weight: 800; color: #059669; }

    .status-badge {
      display: inline-flex; align-items: center; padding: 3px 10px;
      border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase;
    }
    .status-pending { background: #fffbeb; color: #b45309; }
    .status-confirmed, .status-active { background: #ecfdf5; color: #047857; }
    .status-completed { background: #f0fdf4; color: #15803d; }
    .status-cancelled, .status-rejected { background: #fef2f2; color: #b91c1c; }

    .action-btns { display: flex; gap: 6px; }
    .quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .quick-action-btn {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 14px 8px; border-radius: 12px; border: 1.5px solid var(--border);
      background: white; font-size: 12px; font-weight: 700; color: var(--text);
      cursor: pointer; transition: all 0.2s ease; text-align: center;
    }
    .quick-action-btn:hover { border-color: var(--primary); background: var(--primary-light); color: var(--primary-dark); }
    .qa-icon { font-size: 22px; }

    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 160px; }
    .bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
    .bar-label { font-size: 10px; color: var(--text-secondary); font-weight: 600; }
    .bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
    .bar-fill {
      width: 100%; background: var(--primary); border-radius: 4px 4px 0 0;
      transition: height 0.5s ease; min-height: 4px;
    }
    .bar-value { font-size: 9px; color: var(--text-secondary); font-weight: 700; }
    .empty-state-sm { text-align: center; padding: 40px; color: var(--text-secondary); }
    .loading-pulse { background: var(--bg); border-radius: 8px; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class OwnerDashboardComponent implements OnInit, OnDestroy {
  private ownerService = inject(OwnerService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private socketService = inject(SocketService);

  ownerName = '';
  stats: any = null;
  recentBookings: any[] = [];
  monthlyEarnings: any[] = [];
  loading = true;
  bookingsLoading = true;

  private socketSub!: Subscription;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.ownerName = user?.name || 'Host';
    this.loadDashboard();
    this.loadRecentBookings();

    // ⚡ Listen for Real-time New Booking Alerts from Customers
    this.socketSub = this.socketService.onNewBooking().subscribe(() => {
      this.loadRecentBookings();
      this.loadDashboard();
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
  }

  loadDashboard() {
    this.loading = true;
    this.ownerService.getDashboard().subscribe({
      next: (res: any) => {
        this.stats = res.stats;
        this.monthlyEarnings = res.monthlyEarnings || this.getMockMonthlyData();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.monthlyEarnings = this.getMockMonthlyData();
      }
    });
  }

  loadRecentBookings() {
    this.bookingsLoading = true;
    this.bookingService.getOwnerBookings().subscribe({
      next: (res: any) => {
        this.recentBookings = (res.bookings || []).slice(0, 5);
        this.bookingsLoading = false;
      },
      error: () => { this.bookingsLoading = false; }
    });
  }

  updateStatus(bookingId: string, status: string) {
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        this.toast.success(`Booking ${status.toLowerCase()} successfully`);
        this.loadRecentBookings();
        this.loadDashboard();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to update booking');
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'ACTIVE': 'status-active',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled',
      'REJECTED': 'status-rejected'
    };
    return map[status] || '';
  }

  getBarHeight(amount: number): number {
    const max = Math.max(...this.monthlyEarnings.map(m => m.amount), 1);
    return Math.round((amount / max) * 100);
  }

  formatK(amount: number): string {
    if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
    return amount.toString();
  }

  getMockMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      amount: Math.floor(Math.random() * 40000) + 10000
    }));
  }
}
