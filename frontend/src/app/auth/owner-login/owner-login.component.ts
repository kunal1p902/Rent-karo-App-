import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-owner-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="zoom-auth-container">
      <div class="auth-box card">
        <div class="auth-header text-center">
          <div class="logo-icon">🏪</div>
          <h2 class="auth-title">Host Console Login</h2>
          <p class="auth-sub">Manage your vehicle fleet, bookings & earnings</p>
        </div>

        <div class="demo-box">
          <span class="demo-label">⚡ Host Quick Demo Access:</span>
          <button type="button" class="btn btn-sm btn-outline-demo w-full" (click)="fillDemoHost()">
            Fill Host Demo Credentials (rajesh&#64;example.com)
          </button>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-4">
          <div class="form-group">
            <label class="form-label">Email or Mobile Number</label>
            <input 
              type="text" 
              formControlName="email" 
              class="form-control" 
              placeholder="e.g. rajesh&#64;example.com or 1111111111" 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Enter your password" 
            />
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full submit-btn" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing into Host Console...' : 'Login as Host 🏪' }}
          </button>
        </form>

        <div class="auth-footer text-center">
          <p>Looking to rent a vehicle instead? <a routerLink="/login" class="link-green">Customer Login</a></p>
          <p class="mt-2">Want to register a new fleet? <a routerLink="/owner/register" class="link-green">Register as Host</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .zoom-auth-container {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, var(--dark-header) 0%, #0f172a 100%);
      padding: 40px 20px;
    }
    .auth-box {
      max-width: 460px;
      width: 100%;
      background: #ffffff;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .logo-icon {
      background: var(--primary);
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 12px;
    }
    .auth-title { font-size: 26px; font-weight: 900; color: var(--text); }
    .auth-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }

    .demo-box {
      background: #ecfdf5;
      border: 1px dashed #10b981;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 16px;
      text-align: left;
    }
    .demo-label { font-size: 12px; font-weight: 800; color: #047857; display: block; margin-bottom: 8px; }
    .btn-outline-demo { background: white; border: 1px solid #10b981; color: #047857; font-size: 12px; font-weight: 700; }
    .btn-outline-demo:hover { background: #10b981; color: white; }

    .submit-btn { margin-top: 12px; width: 100%; height: 48px; }
    .auth-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-secondary); }
    .link-green { color: var(--primary); font-weight: 800; }
    .link-green:hover { text-decoration: underline; }
    .mt-2 { margin-top: 8px; }
  `]
})
export class OwnerLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  fillDemoHost() {
    this.loginForm.patchValue({
      email: 'rajesh@example.com',
      password: 'password123'
    });
    this.toast.info('Filled Host Demo credentials!');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;

    this.auth.loginOwner(this.loginForm.value).subscribe({
      next: () => {
        this.toast.success('Logged into Host Console successfully!');
        this.router.navigate(['/owner/dashboard']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Invalid host email or password');
        this.loading = false;
      }
    });
  }
}
