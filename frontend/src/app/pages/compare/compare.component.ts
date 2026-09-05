import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Compare Vehicles</h1>
      </div>
    </div>
    <div class="container section pt-0">
      <div class="card text-center py-12">
        <h3 class="text-xl font-bold mb-2">Compare Tool</h3>
        <p class="text-secondary">Select vehicles to compare specs side by side.</p>
        <p class="mt-4 text-xs">Note: Placeholder compare page.</p>
      </div>
    </div>
  `
})
export class CompareComponent {}
