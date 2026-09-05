import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Booking Management 📋</h1>
        <p>Manage all rental bookings from your customers</p>
      </div>
    </div>

    <div class="container" style="padding-bottom:48px">
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        @for (tab of tabs; track tab.value) {
          <button class="tab-btn" [class.active]="activeTab === tab.value" (click)="setTab(tab.value)">
            {{ tab.label }}
            @if (getCount(tab.value) > 0) {
              <span class="tab-count">{{ getCount(tab.value) }}</span>
            }
          </button>
        }
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="card">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton" style="height:56px;margin-bottom:8px"></div>
          }
        </div>
      }

      <!-- Empty State -->
      @if (!loading && filteredBookings.length === 0) {
        <div class="card empty-state">
          <div style="font-size:64px">📭</div>
          <h3>No bookings found</h3>
          <p>{{ activeTab === 'ALL' ? 'No bookings yet.' : 'No ' + activeTab.toLowerCase() + ' bookings.' }}</p>
        </div>
      }

      <!-- Bookings Table -->
      @if (!loading && filteredBookings.length > 0) {
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Qty</th>
                  <th>Pickup</th>
                  <th>Return</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (booking of filteredBookings; track booking._id) {
                  <tr>
                    <td>
                      <span class="bid">{{ booking.bookingId }}</span>
                    </td>
                    <td>
                      <div class="customer-cell">
                        <div class="c-avatar">{{ booking.userId?.name?.charAt(0) || 'C' }}</div>
                        <div>
                          <div class="c-name">{{ booking.userId?.name || 'Customer' }}</div>
                          <div class="c-mobile">📱 {{ booking.userId?.mobile || '-' }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="vehicle-cell">
                        <div class="v-emoji">{{ getEmoji(booking.vehicleId?.type) }}</div>
                        <div>
                          <div class="v-name">{{ booking.vehicleId?.name || 'Vehicle' }}</div>
                          <div class="v-type">{{ booking.vehicleId?.type }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{{ booking.quantity }}</td>
                    <td>
                      <div class="date-cell">
                        <div>{{ booking.pickupDate | date:'dd MMM yyyy' }}</div>
                        <div class="time">{{ booking.pickupTime }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="date-cell">
                        <div>{{ booking.returnDate | date:'dd MMM yyyy' }}</div>
                        <div class="time">{{ booking.returnTime }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="amount-cell">
                        <div class="amt">₹{{ booking.totalAmount | number }}</div>
                        <div class="pay-status" [class]="'pay-' + booking.paymentStatus.toLowerCase()">
                          {{ booking.paymentStatus }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" [class]="getStatusClass(booking.bookingStatus)">
                        {{ booking.bookingStatus }}
                      </span>
                    </td>
                    <td>
                      <div class="action-group">
                        @if (booking.bookingStatus === 'PENDING') {
                          <button class="action-btn accept" (click)="confirm(booking._id, 'CONFIRMED', booking.bookingId)" [disabled]="updating">
                            ✓ Accept
                          </button>
                          <button class="action-btn reject" (click)="confirm(booking._id, 'REJECTED', booking.bookingId)" [disabled]="updating">
                            ✗ Reject
                          </button>
                        }
                        @if (booking.bookingStatus === 'CONFIRMED') {
                          <button class="action-btn activate" (click)="confirm(booking._id, 'ACTIVE', booking.bookingId)" [disabled]="updating">
                            ▶ Activate
                          </button>
                        }
                        @if (booking.bookingStatus === 'ACTIVE') {
                          <button class="action-btn complete" (click)="confirm(booking._id, 'COMPLETED', booking.bookingId)" [disabled]="updating">
                            ✓ Complete
                          </button>
                        }
                        @if (!['PENDING','CONFIRMED','ACTIVE'].includes(booking.bookingStatus)) {
                          <span class="no-action">—</span>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Confirm Dialog -->
    @if (showConfirm) {
      <div class="dialog-overlay" (click)="cancelConfirm()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-icon">{{ confirmIcon }}</div>
          <h3>{{ confirmTitle }}</h3>
          <p>{{ confirmMsg }}</p>
          <div class="dialog-actions">
            <button class="btn btn-outline" (click)="cancelConfirm()">Cancel</button>
            <button class="btn" [class]="confirmBtnClass" (click)="doConfirm()">Confirm</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
    .tab-btn {
      padding: 10px 18px; border-radius: 100px; border: 2px solid var(--border);
      background: white; font-size: 13px; font-weight: 600; cursor: pointer;
      color: var(--text-secondary); transition: all 0.2s; display: flex; align-items: center; gap: 6px;
    }
    .tab-btn.active { border-color: var(--primary); background: var(--primary); color: white; }
    .tab-btn:hover:not(.active) { border-color: var(--primary); color: var(--primary); }
    .tab-count {
      background: rgba(255,255,255,0.3); color: white; padding: 2px 8px;
      border-radius: 100px; font-size: 11px;
    }
    .tab-btn:not(.active) .tab-count { background: rgba(26,35,126,0.1); color: var(--primary); }
    .bid { font-family: monospace; font-size: 12px; font-weight: 600; color: var(--text-secondary); }
    .customer-cell, .vehicle-cell { display: flex; align-items: center; gap: 10px; }
    .c-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg,#1a237e,#ff6f00);
      color: white; font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .c-name { font-weight: 600; font-size: 13px; }
    .c-mobile { font-size: 12px; color: var(--text-secondary); }
    .v-emoji { font-size: 24px; }
    .v-name { font-weight: 600; font-size: 13px; }
    .v-type { font-size: 12px; color: var(--text-secondary); }
    .date-cell div:first-child { font-size: 13px; font-weight: 600; }
    .time { font-size: 12px; color: var(--text-secondary); }
    .amt { font-size: 15px; font-weight: 700; color: var(--success); }
    .pay-status { font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .pay-pending { color: var(--warning); }
    .pay-paid { color: var(--success); }
    .pay-failed { color: var(--danger); }
    .badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #fff3e0; color: #e65100; }
    .badge-confirmed { background: #e3f2fd; color: #1565c0; }
    .badge-active { background: #e8f5e9; color: #2e7d32; }
    .badge-completed { background: #f3e5f5; color: #6a1b9a; }
    .badge-cancelled { background: #ffebee; color: #c62828; }
    .badge-rejected { background: #fce4ec; color: #880e4f; }
    .action-group { display: flex; gap: 6px; flex-wrap: wrap; }
    .action-btn {
      padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
      cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap;
    }
    .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .accept { background: #e8f5e9; color: #2e7d32; }
    .accept:hover { background: #2e7d32; color: white; }
    .reject { background: #ffebee; color: #c62828; }
    .reject:hover { background: #c62828; color: white; }
    .activate { background: #e3f2fd; color: #1565c0; }
    .activate:hover { background: #1565c0; color: white; }
    .complete { background: #f3e5f5; color: #6a1b9a; }
    .complete:hover { background: #6a1b9a; color: white; }
    .no-action { color: var(--text-secondary); font-size: 18px; }
    .empty-state { text-align: center; padding: 60px; }
    .empty-state h3 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; }
    .empty-state p { color: var(--text-secondary); }
    .dialog-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
    }
    .dialog {
      background: white; border-radius: 20px; padding: 40px; max-width: 380px; width: 90%;
      text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .dialog-icon { font-size: 48px; margin-bottom: 12px; }
    .dialog h3 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
    .dialog p { color: var(--text-secondary); margin-bottom: 28px; font-size: 15px; }
    .dialog-actions { display: flex; gap: 12px; justify-content: center; }
    .btn-accept { background: #2e7d32; color: white; }
    .btn-reject { background: var(--danger); color: white; }
    .btn-activate { background: #1565c0; color: white; }
    .btn-complete { background: #6a1b9a; color: white; }
    .text-center { text-align: center; }
  `]
})
export class OwnerBookingsComponent implements OnInit {
  allBookings: any[] = [];
  filteredBookings: any[] = [];
  loading = true;
  updating = false;
  activeTab = 'ALL';
  showConfirm = false;
  confirmTitle = '';
  confirmMsg = '';
  confirmIcon = '❓';
  confirmBtnClass = 'btn-primary';
  pendingAction: { id: string; status: string } | null = null;

  tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled/Rejected', value: 'CANCELLED' }
  ];

  constructor(private bookingService: BookingService, private toast: ToastService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.bookingService.getOwnerBookings().subscribe({
      next: (res: any) => {
        this.allBookings = res.bookings || [];
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.filter();
  }

  filter() {
    if (this.activeTab === 'ALL') {
      this.filteredBookings = this.allBookings;
    } else if (this.activeTab === 'CANCELLED') {
      this.filteredBookings = this.allBookings.filter(b => ['CANCELLED', 'REJECTED'].includes(b.bookingStatus));
    } else {
      this.filteredBookings = this.allBookings.filter(b => b.bookingStatus === this.activeTab);
    }
  }

  getCount(tab: string): number {
    if (tab === 'ALL') return this.allBookings.length;
    if (tab === 'CANCELLED') return this.allBookings.filter(b => ['CANCELLED', 'REJECTED'].includes(b.bookingStatus)).length;
    return this.allBookings.filter(b => b.bookingStatus === tab).length;
  }

  confirm(id: string, status: string, bookingId: string) {
    this.pendingAction = { id, status };
    const map: Record<string, any> = {
      'CONFIRMED': { title: 'Accept Booking?', msg: `Accept booking ${bookingId}? The customer will be notified.`, icon: '✅', cls: 'btn-success' },
      'REJECTED': { title: 'Reject Booking?', msg: `Reject booking ${bookingId}? This cannot be undone.`, icon: '❌', cls: 'btn-danger' },
      'ACTIVE': { title: 'Mark as Active?', msg: `Mark booking ${bookingId} as active? The rental has started.`, icon: '▶️', cls: 'btn-primary' },
      'COMPLETED': { title: 'Complete Booking?', msg: `Mark booking ${bookingId} as completed?`, icon: '✅', cls: 'btn-success' }
    };
    const cfg = map[status];
    if (cfg) {
      this.confirmTitle = cfg.title;
      this.confirmMsg = cfg.msg;
      this.confirmIcon = cfg.icon;
      this.confirmBtnClass = cfg.cls;
      this.showConfirm = true;
    }
  }

  cancelConfirm() {
    this.showConfirm = false;
    this.pendingAction = null;
  }

  doConfirm() {
    if (!this.pendingAction) return;
    this.updating = true;
    this.showConfirm = false;
    this.bookingService.updateBookingStatus(this.pendingAction.id, this.pendingAction.status).subscribe({
      next: () => {
        this.toast.success('Booking updated successfully');
        this.updating = false;
        this.pendingAction = null;
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to update booking');
        this.updating = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'badge-pending', 'CONFIRMED': 'badge-confirmed',
      'ACTIVE': 'badge-active', 'COMPLETED': 'badge-completed',
      'CANCELLED': 'badge-cancelled', 'REJECTED': 'badge-rejected'
    };
    return map[status] || '';
  }

  getEmoji(type: string): string {
    const m: Record<string, string> = { 'Car': '🚗', 'Bike': '🏍', 'Scooter': '🛵', 'SUV': '🚙', 'Sedan': '🚗', 'Hatchback': '🚗' };
    return m[type] || '🚗';
  }
}
