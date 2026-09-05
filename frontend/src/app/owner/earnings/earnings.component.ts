import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../core/services/owner.service';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container section">
      <h1 class="text-3xl font-bold mb-8">Earnings Report</h1>

      <div class="stats-grid mb-8">
        <div class="stat-card">
          <div class="stat-label mb-2">Today</div>
          <div class="stat-value text-accent">₹{{ earnings.today || 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label mb-2">This Week</div>
          <div class="stat-value text-accent">₹{{ earnings.week || 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label mb-2">This Month</div>
          <div class="stat-value text-accent">₹{{ earnings.month || 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label mb-2">Total Earnings</div>
          <div class="stat-value text-primary">₹{{ earnings.total || 0 }}</div>
        </div>
      </div>

      <div class="card mb-8">
        <h3 class="text-xl font-bold mb-6">Monthly Revenue (Last 6 Months)</h3>
        <!-- Inline SVG Chart -->
        <div class="chart-container" style="height: 300px; display: flex; align-items: flex-end; gap: 10%; padding: 20px 0; border-bottom: 2px solid var(--border);">
          @for (month of chartData; track month.label) {
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%;">
              <div class="bar" [style.height.%]="month.percentage" style="width: 100%; max-width: 60px; background: linear-gradient(to top, var(--primary), var(--primary-light)); border-radius: 4px 4px 0 0; transition: height 1s ease;">
                <div class="tooltip">₹{{ month.value }}</div>
              </div>
              <div class="mt-2 text-sm text-secondary font-bold">{{ month.label }}</div>
            </div>
          }
        </div>
      </div>

      <div class="card">
        <h3 class="text-xl font-bold mb-6">Recent Transactions</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Duration</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of transactions; track tx._id) {
                <tr>
                  <td>{{ tx.date | date }}</td>
                  <td class="font-bold">#{{ tx.bookingId }}</td>
                  <td>{{ tx.vehicle }}</td>
                  <td>{{ tx.duration }} Days</td>
                  <td class="text-right font-bold text-success">+ ₹{{ tx.amount }}</td>
                </tr>
              }
              @if (transactions.length === 0) {
                <tr>
                  <td colspan="5" class="text-center py-4 text-secondary">No recent transactions.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-3xl { font-size: 32px; }
    .text-xl { font-size: 20px; }
    .font-bold { font-weight: 700; }
    .text-accent { color: var(--accent); }
    .text-primary { color: var(--primary); }
    .text-success { color: var(--success); }
    .text-sm { font-size: 14px; }
    .py-4 { padding: 16px 0; }
    .bar { position: relative; cursor: pointer; }
    .tooltip {
      position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
      background: var(--text); color: white; padding: 4px 8px; border-radius: 4px;
      font-size: 12px; opacity: 0; transition: opacity 0.2s; pointer-events: none;
    }
    .bar:hover .tooltip { opacity: 1; }
  `]
})
export class EarningsComponent implements OnInit {
  ownerService = inject(OwnerService);
  
  earnings: any = { today: 1200, week: 8400, month: 32000, total: 145000 };
  chartData = [
    { label: 'Apr', value: 20000, percentage: 40 },
    { label: 'May', value: 25000, percentage: 50 },
    { label: 'Jun', value: 30000, percentage: 60 },
    { label: 'Jul', value: 45000, percentage: 90 },
    { label: 'Aug', value: 35000, percentage: 70 },
    { label: 'Sep', value: 32000, percentage: 64 }
  ];
  transactions = [
    { _id: '1', date: new Date(), bookingId: 'BK123', vehicle: 'Honda City', duration: 2, amount: 4000 },
    { _id: '2', date: new Date(Date.now() - 86400000), bookingId: 'BK122', vehicle: 'Royal Enfield', duration: 1, amount: 1500 },
    { _id: '3', date: new Date(Date.now() - 86400000 * 3), bookingId: 'BK120', vehicle: 'Hyundai Creta', duration: 3, amount: 9000 }
  ];

  ngOnInit() {
    this.ownerService.getOwnerEarnings().subscribe(res => {
      if (res.data) {
        // override with real data if API returns
      }
    });
  }
}
