import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-owner-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="zoom-auth-container">
      <div class="auth-box card">
        <div class="auth-header text-center">
          <div class="logo-icon">🏪</div>
          <h2 class="auth-title">Host Business Partner Registration</h2>
          <p class="auth-sub">List your cars, bikes & scooters to earn daily rental income</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Owner Full Name</label>
              <input type="text" formControlName="name" class="form-control" placeholder="e.g. Rajesh Kumar" />
            </div>

            <div class="form-group">
              <label class="form-label">Business / Shop Name</label>
              <input type="text" formControlName="businessName" class="form-control" placeholder="e.g. Rajesh Rentals" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" formControlName="email" class="form-control" placeholder="e.g. rajesh&#64;example.com" />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input type="text" formControlName="mobile" class="form-control" placeholder="10-digit mobile number" />
            </div>

            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" formControlName="city" class="form-control" placeholder="e.g. Mumbai" />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" formControlName="password" class="form-control" placeholder="Create password (min 6 chars)" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Business Address</label>
            <input type="text" formControlName="address" class="form-control" placeholder="Shop/Hub location address" />
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full submit-btn" [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Registering Host Account...' : 'Register Host Business 🏪' }}
          </button>
        </form>

        <div class="auth-footer text-center">
          <p>Already a registered Host? <a routerLink="/owner/login" class="link-green">Host Login</a></p>
          <p class="mt-2">Looking to rent a ride? <a routerLink="/register" class="link-green">Customer Registration</a></p>
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
      max-width: 580px;
      width: 100%;
      background: #ffffff;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .logo-icon {
      background: var(--primary);
      width: 48px; height: 48px; border-radius: 14px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 26px; margin-bottom: 12px;
    }
    .auth-title { font-size: 24px; font-weight: 900; color: var(--text); }
    .auth-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .submit-btn { margin-top: 12px; width: 100%; height: 48px; }
    .auth-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-secondary); }
    .link-green { color: var(--primary); font-weight: 800; }
    .link-green:hover { text-decoration: underline; }
    .mt-2 { margin-top: 8px; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OwnerRegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  registerForm = this.fb.group({
    name: ['', Validators.required],
    businessName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    address: ['', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;

    this.auth.registerOwner(this.registerForm.value).subscribe({
      next: () => {
        this.toast.success('Host Business registered successfully! Welcome aboard 🏪');
        this.router.navigate(['/owner/dashboard']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }
}
