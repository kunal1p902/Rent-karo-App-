import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';

@Component({
  selector: 'app-owner-reviews',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div class="container section">
      <h1 class="text-3xl font-bold mb-8">Customer Reviews</h1>
      
      <div class="grid-2" style="grid-template-columns: 1fr 2fr; gap: 32px;">
        <div>
          <div class="card text-center sticky" style="top: 90px;">
            <h3 class="font-bold text-xl mb-4">Overall Rating</h3>
            <div class="text-6xl font-bold text-primary mb-2">4.8</div>
            <app-star-rating [rating]="4.8" size="lg"></app-star-rating>
            <p class="text-secondary mt-4">Based on 124 reviews</p>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="flex justify-between items-center mb-6 border-b pb-4">
              <h3 class="font-bold text-xl">Recent Reviews</h3>
              <select class="form-control" style="width: auto;">
                <option value="all">All Vehicles</option>
                <option value="honda">Honda City</option>
              </select>
            </div>

            <div class="reviews-list">
              @for (review of reviews; track review.id) {
                <div class="review-item mb-6 border-b pb-6">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <div class="font-bold">{{ review.customer }}</div>
                      <div class="text-xs text-secondary">Rented: {{ review.vehicle }}</div>
                    </div>
                    <div class="text-right">
                      <app-star-rating [rating]="review.rating" size="sm"></app-star-rating>
                      <div class="text-xs text-secondary mt-1">{{ review.date | date }}</div>
                    </div>
                  </div>
                  <p class="mt-4 text-sm">{{ review.comment }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-3xl { font-size: 32px; }
    .text-xl { font-size: 20px; }
    .text-6xl { font-size: 64px; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary); }
    .sticky { position: sticky; }
    .border-b { border-bottom: 1px solid var(--border); }
    .pb-4 { padding-bottom: 16px; }
    .pb-6 { padding-bottom: 24px; }
    .text-xs { font-size: 12px; }
    .text-sm { font-size: 14px; }
    .review-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  `]
})
export class OwnerReviewsComponent {
  reviews = [
    { id: 1, customer: 'Rahul Sharma', vehicle: 'Honda City', rating: 5, date: new Date(), comment: 'Excellent car, very clean and well maintained. Owner was polite.' },
    { id: 2, customer: 'Priya Patel', vehicle: 'Royal Enfield', rating: 4, date: new Date(Date.now() - 86400000 * 2), comment: 'Good bike, but pickup location was a bit hard to find.' },
    { id: 3, customer: 'Amit Singh', vehicle: 'Hyundai Creta', rating: 5, date: new Date(Date.now() - 86400000 * 5), comment: 'Smooth booking process. Will definitely rent again.' }
  ];
}
