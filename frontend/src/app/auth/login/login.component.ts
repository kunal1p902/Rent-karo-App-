import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="zoom-auth-container">
      <div class="auth-box card">
        <!-- Brand Header -->
        <div class="auth-header text-center">
          <div class="logo-icon">⚡</div>
          <h2 class="auth-title">Welcome to RentKaro</h2>
          <p class="auth-sub">Rent cars, bikes & scooters with zero hassle</p>
        </div>

        <!-- Role Toggle Tabs -->
        <div class="mode-tabs">
          <button class="tab-btn" [class.active]="activeRole === 'USER'" (click)="setRole('USER')">
            👤 Customer Login
          </button>
          <button class="tab-btn" [class.active]="activeRole === 'OWNER'" (click)="setRole('OWNER')">
            🏪 Host / Owner Login
          </button>
        </div>

        <!-- One-Click Demo Login Banner -->
        <div class="demo-box">
          <span class="demo-label">⚡ Quick Demo Access:</span>
          <div class="demo-buttons">
            <button type="button" class="btn btn-sm btn-outline-demo" (click)="fillDemoUser()">
              Fill Customer Demo
            </button>
            <button type="button" class="btn btn-sm btn-outline-demo" (click)="fillDemoHost()">
              Fill Host Demo
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-4">
          <div class="form-group">
            <label class="form-label">Email or Mobile Number</label>
            <input 
              type="text" 
              formControlName="email" 
              class="form-control" 
              placeholder="e.g. rohan&#64;example.com or 9876543210" 
            />
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <span class="error-msg">Please enter a valid email or mobile number</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Enter your password" 
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <span class="error-msg">Password is required</span>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full submit-btn" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing in...' : (activeRole === 'USER' ? 'Login as Customer 🚀' : 'Login to Host Console 🏪') }}
          </button>
        </form>

        <!-- Footer Links -->
        <div class="auth-footer text-center">
          @if (activeRole === 'USER') {
            <p>New to RentKaro? <a routerLink="/register" class="link-green">Create an Account</a></p>
          } @else {
            <p>Want to list your fleet? <a routerLink="/owner/register" class="link-green">Register as Host</a></p>
          }
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
    .auth-title {
      font-size: 26px;
      font-weight: 900;
      color: var(--text);
    }
    .auth-sub {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .mode-tabs {
      display: flex;
      gap: 8px;
      background: #f1f5f9;
      padding: 6px;
      border-radius: 14px;
      margin-bottom: 20px;
    }
    .tab-btn {
      flex: 1;
      border: none;
      padding: 10px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: #ffffff;
      color: var(--primary-dark);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .demo-box {
      background: #ecfdf5;
      border: 1px dashed #10b981;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 16px;
      text-align: left;
    }
    .demo-label {
      font-size: 12px;
      font-weight: 800;
      color: #047857;
      display: block;
      margin-bottom: 8px;
    }
    .demo-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-outline-demo {
      background: white;
      border: 1px solid #10b981;
      color: #047857;
      font-size: 12px;
      font-weight: 700;
    }
    .btn-outline-demo:hover {
      background: #10b981;
      color: white;
    }

    .submit-btn {
      margin-top: 12px;
      width: 100%;
      height: 48px;
    }
    .error-msg {
      font-size: 12px;
      color: var(--danger);
      margin-top: 4px;
      display: block;
    }

    .auth-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 14px;
      color: var(--text-secondary);
    }
    .link-green {
      color: var(--primary);
      font-weight: 800;
    }
    .link-green:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  activeRole: 'USER' | 'OWNER' = 'USER';
  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  setRole(role: 'USER' | 'OWNER') {
    this.activeRole = role;
  }

  fillDemoUser() {
    this.activeRole = 'USER';
    this.loginForm.patchValue({
      email: 'rohan@example.com',
      password: 'password123'
    });
    this.toast.info('Filled Customer Demo credentials!');
  }

  fillDemoHost() {
    this.activeRole = 'OWNER';
    this.loginForm.patchValue({
      email: 'rajesh@example.com',
      password: 'password123'
    });
    this.toast.info('Filled Host Demo credentials!');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;

    const payload = this.loginForm.value;

    if (this.activeRole === 'USER') {
      this.auth.login(payload).subscribe({
        next: () => {
          this.toast.success('Logged in successfully! Welcome back.');
          this.router.navigate(['/user/dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Invalid email or password');
          this.loading = false;
        }
      });
    } else {
      this.auth.loginOwner(payload).subscribe({
        next: () => {
          this.toast.success('Logged into Host Console!');
          this.router.navigate(['/owner/dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Invalid host credentials');
          this.loading = false;
        }
      });
    }
  }
}
