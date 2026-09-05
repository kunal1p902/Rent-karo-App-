import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container grid-4">
        <div class="footer-col">
          <h3>RENT-KARO</h3>
          <p>India's premier vehicle rental platform. Find cars, bikes, and scooters near you at affordable prices.</p>
          <div class="social-links mt-4">
            <a href="#">FB</a>
            <a href="#">TW</a>
            <a href="#">IG</a>
            <a href="#">LI</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a routerLink="/vehicles">Browse Vehicles</a>
          <a routerLink="/">How It Works</a>
          <a routerLink="/">About Us</a>
          <a routerLink="/">Contact</a>
        </div>
        <div class="footer-col">
          <h4>For Owners</h4>
          <a routerLink="/owner/register">List Your Vehicle</a>
          <a routerLink="/owner/login">Owner Login</a>
          <a routerLink="/">Earnings</a>
          <a routerLink="/">Owner FAQ</a>
        </div>
        <div class="footer-col">
          <h4>Contact Us</h4>
          <p>Email: support@rentkaro.com</p>
          <p>Phone: 1800-123-4567</p>
          <p>Address: 123 Tech Park, Bangalore, India</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Rent-Karo. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--text);
      color: white;
      padding-top: 64px;
      margin-top: auto;
    }
    .footer-col h3 {
      font-weight: 900;
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }
    .footer-col h4 {
      font-size: 16px;
      margin-bottom: 24px;
      color: white;
    }
    .footer-col p { color: var(--text-secondary); font-size: 14px; }
    .footer-col a {
      display: block;
      color: var(--text-secondary);
      margin-bottom: 12px;
      font-size: 14px;
      transition: color 0.2s;
    }
    .footer-col a:hover { color: var(--accent); }
    .social-links { display: flex; gap: 16px; }
    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      color: white;
    }
    .social-links a:hover { background: var(--accent); }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 48px;
      padding: 24px 0;
      text-align: center;
    }
    .footer-bottom p { color: var(--text-secondary); font-size: 14px; }
  `]
})
export class FooterComponent {}
