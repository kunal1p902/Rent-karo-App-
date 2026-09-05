import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Placeholders for navbar, footer, toast - assuming these are created separately
// import { NavbarComponent } from './shared/navbar/navbar.component';
// import { FooterComponent } from './shared/footer/footer.component';
// import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // NavbarComponent, FooterComponent, ToastComponent
  template: `
    <!-- <app-navbar></app-navbar> -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <!-- <app-footer></app-footer> -->
    <!-- <app-toast></app-toast> -->
  `,
  styles: [`:host { display: block; min-height: 100vh; } .main-content { min-height: calc(100vh - 140px); }`]
})
export class AppComponent {}
