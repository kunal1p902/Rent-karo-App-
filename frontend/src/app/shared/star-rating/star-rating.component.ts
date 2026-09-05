import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class]="size">
      @for (star of stars; track $index) {
        <span class="star" [class.filled]="star === 'full'" [class.half]="star === 'half'">★</span>
      }
      @if (showText) {
        <span class="rating-text">{{ rating.toFixed(1) }}</span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      color: #e0e0e0;
    }
    .star { position: relative; }
    .star.filled { color: #FFB400; }
    .star.half { color: #e0e0e0; }
    .star.half::after {
      content: '★';
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      overflow: hidden;
      color: #FFB400;
    }
    .sm { font-size: 14px; }
    .md { font-size: 18px; }
    .lg { font-size: 24px; gap: 4px; }
    .rating-text {
      margin-left: 4px;
      font-size: 0.9em;
      font-weight: 600;
      color: var(--text-secondary);
    }
  `]
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showText: boolean = false;
  
  stars: string[] = [];

  ngOnChanges() {
    this.calculateStars();
  }

  private calculateStars() {
    this.stars = [];
    const fullStars = Math.floor(this.rating);
    const hasHalfStar = this.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        this.stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        this.stars.push('half');
      } else {
        this.stars.push('empty');
      }
    }
  }
}
