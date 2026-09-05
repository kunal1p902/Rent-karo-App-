import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="grid-3">
      @for (item of items; track $index) {
        <div class="card" style="padding: 0;">
          <div class="skeleton" style="height: 200px; border-radius: 16px 16px 0 0;"></div>
          <div style="padding: 20px;">
            <div class="skeleton" style="height: 24px; width: 60%; margin-bottom: 12px;"></div>
            <div class="skeleton" style="height: 16px; width: 40%; margin-bottom: 24px;"></div>
            <div class="flex justify-between items-center">
              <div class="skeleton" style="height: 28px; width: 30%;"></div>
              <div class="skeleton" style="height: 36px; width: 100px; border-radius: 8px;"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LoadingSkeletonComponent {
  @Input() count: number = 6;
  get items() { return new Array(this.count); }
}
