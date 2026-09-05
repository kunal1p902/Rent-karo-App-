import { Injectable, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private resolveFn: ((value: boolean) => void) | null = null;
  public showDialog = false;
  public title = '';
  public message = '';

  show(title: string, message: string): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.showDialog = true;
    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  close(result: boolean) {
    this.showDialog = false;
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialogService.showDialog) {
      <div class="dialog-overlay">
        <div class="dialog-card card animate-in">
          <h3 class="dialog-title">{{ dialogService.title }}</h3>
          <p class="dialog-message">{{ dialogService.message }}</p>
          <div class="dialog-actions">
            <button class="btn btn-outline" (click)="dialogService.close(false)">Cancel</button>
            <button class="btn btn-primary" (click)="dialogService.close(true)">Confirm</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 10000;
    }
    .dialog-card {
      width: 100%; max-width: 400px;
      padding: 32px;
    }
    .dialog-title { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
    .dialog-message { color: var(--text-secondary); margin-bottom: 24px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogService: ConfirmDialogService) {}
}
