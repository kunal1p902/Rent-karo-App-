import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts$ | async; track toast.id) {
        <div class="toast" [ngClass]="toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toast {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-radius: var(--radius-sm);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border-left: 4px solid transparent;
    }
    .toast.success { border-left-color: var(--success); }
    .toast.error { border-left-color: var(--danger); }
    .toast.warning { border-left-color: var(--warning); }
    .toast.info { border-left-color: var(--primary); }
    
    .toast-icon {
      font-size: 20px;
      margin-right: 12px;
      font-weight: bold;
    }
    .toast.success .toast-icon { color: var(--success); }
    .toast.error .toast-icon { color: var(--danger); }
    .toast.warning .toast-icon { color: var(--warning); }
    .toast.info .toast-icon { color: var(--primary); }

    .toast-message { flex: 1; font-size: 14px; font-weight: 500; }
    .toast-close {
      background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
