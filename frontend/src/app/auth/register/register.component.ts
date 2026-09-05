import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="zoom-auth-container">
      <div class="auth-box card">
        <div class="auth-header text-center">
          <div class="logo-icon">⚡</div>
          <h2 class="auth-title">Join RentKaro Today</h2>
          <p class="auth-sub">Create your customer account to start renting rides instantly</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Rahul Sharma" />
            @if (registerForm.get('name')?.touched && registerForm.get('name')?.invalid) {
              <span class="error-msg">Full Name is required</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" formControlName="email" class="form-control" placeholder="e.g. rahul&#64;example.com" />
            @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
              <span class="error-msg">Please enter a valid email address</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="text" formControlName="mobile" class="form-control" placeholder="10-digit mobile number" />
            @if (registerForm.get('mobile')?.touched && registerForm.get('mobile')?.invalid) {
              <span class="error-msg">Please enter a valid 10-digit mobile number</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Create a password (min 6 chars)" />
            @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
              <span class="error-msg">Password must be at least 6 characters</span>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full submit-btn" [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Creating Account...' : 'Register & Start Exploring 🚀' }}
          </button>
        </form>

        <div class="auth-footer text-center">
          <p>Already have an account? <a routerLink="/login" class="link-green">Sign In Here</a></p>
          <p class="mt-2">Are you a vehicle host? <a routerLink="/owner/register" class="link-green">Register as Host</a></p>
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
      width: 48px; height: 48px; border-radius: 14px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 26px; margin-bottom: 12px;
    }
    .auth-title { font-size: 26px; font-weight: 900; color: var(--text); }
    .auth-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    .submit-btn { margin-top: 12px; width: 100%; height: 48px; }
    .error-msg { font-size: 12px; color: var(--danger); margin-top: 4px; display: block; }
    .auth-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-secondary); }
    .link-green { color: var(--primary); font-weight: 800; }
    .link-green:hover { text-decoration: underline; }
    .mt-2 { margin-top: 8px; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.toast.success('Registration successful! Welcome to RentKaro 🎉');
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }
}
