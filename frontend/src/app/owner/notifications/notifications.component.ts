import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  template: `
    <div class="container section">
      <h2>Notifications</h2>
      <div class="card mt-4">
        <p class="text-secondary text-center py-8">No new notifications.</p>
      </div>
    </div>
  `
})
export class NotificationsComponent {}
