import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container section">
      <div class="grid-2" style="grid-template-columns: 1fr 2fr; gap: 32px;">
        <!-- Left: Profile Summary -->
        <div>
          <div class="card text-center sticky" style="top: 90px;">
            <div class="profile-avatar mb-4">
              {{ profileForm.get('name')?.value?.charAt(0) || 'U' }}
            </div>
            <h2 class="font-bold text-xl mb-1">{{ profileForm.get('name')?.value }}</h2>
            <p class="text-secondary mb-4">{{ profileForm.get('email')?.value }}</p>
            
            <div class="flex flex-col gap-2 border-t pt-4 text-left">
              <div class="flex justify-between">
                <span class="text-secondary">Role</span>
                <span class="badge badge-primary">Customer</span>
              </div>
              <div class="flex justify-between mt-2">
                <span class="text-secondary">Member Since</span>
                <span class="font-bold">{{ userCreatedAt | date:'MMM yyyy' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Edit Form -->
        <div>
          <div class="card">
            <h2 class="font-bold text-2xl mb-6 border-b pb-4">Profile Information</h2>
            
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" formControlName="name" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" formControlName="email" class="form-control" readonly>
                  <span class="text-xs text-secondary mt-1">Email cannot be changed</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input type="text" formControlName="mobile" class="form-control">
                </div>
              </div>

              <h3 class="font-bold text-lg mt-6 mb-4">Address Details</h3>
              
              <div class="form-group">
                <label class="form-label">Address</label>
                <textarea formControlName="address" class="form-control" rows="3"></textarea>
              </div>
              
              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" formControlName="city" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">State</label>
                  <input type="text" formControlName="state" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">Pincode</label>
                  <input type="text" formControlName="pincode" class="form-control">
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || loading">
                  {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-2xl { font-size: 24px; }
    .text-xl { font-size: 20px; }
    .text-lg { font-size: 18px; }
    .font-bold { font-weight: 700; }
    .profile-avatar { width: 120px; height: 120px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 900; margin: 0 auto; box-shadow: var(--shadow); }
    .border-b { border-bottom: 1px solid var(--border); }
    .border-t { border-top: 1px solid var(--border); }
    .pb-4 { padding-bottom: 16px; }
    .pt-4 { padding-top: 16px; }
    .text-xs { font-size: 12px; }
    .sticky { position: sticky; }
  `]
})
export class UserProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  userService = inject(UserService);
  toast = inject(ToastService);

  loading = false;
  userCreatedAt: any = new Date();

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: [''],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: [''],
    city: [''],
    state: [''],
    pincode: ['']
  });

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.profileForm.patchValue(user);
      this.userCreatedAt = user.createdAt;
    }
    
    this.userService.getProfile().subscribe(res => {
      if (res.data) {
        this.profileForm.patchValue(res.data);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully');
        this.auth.me().subscribe(); // refresh local storage user
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to update profile');
        this.loading = false;
      }
    });
  }
}
