import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'vehicles', loadComponent: () => import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent) },
  { path: 'vehicles/:id', loadComponent: () => import('./pages/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },
  { path: 'compare', loadComponent: () => import('./pages/compare/compare.component').then(m => m.CompareComponent) },
  // Auth
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'owner/login', loadComponent: () => import('./auth/owner-login/owner-login.component').then(m => m.OwnerLoginComponent) },
  { path: 'owner/register', loadComponent: () => import('./auth/owner-register/owner-register.component').then(m => m.OwnerRegisterComponent) },
  // User Panel
  { path: 'user', canActivate: [authGuard, roleGuard], data: { role: 'USER' }, children: [
    { path: 'dashboard', loadComponent: () => import('./user/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'bookings', loadComponent: () => import('./user/bookings/bookings.component').then(m => m.BookingsComponent) },
    { path: 'wishlist', loadComponent: () => import('./user/wishlist/wishlist.component').then(m => m.WishlistComponent) },
    { path: 'profile', loadComponent: () => import('./user/profile/profile.component').then(m => m.UserProfileComponent) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},
  // Booking flow
  { path: 'booking/:vehicleId', canActivate: [authGuard], loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent) },
  { path: 'payment/:bookingId', canActivate: [authGuard], loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'invoice/:bookingId', canActivate: [authGuard], loadComponent: () => import('./pages/invoice/invoice.component').then(m => m.InvoiceComponent) },
  // Owner Panel
  { path: 'owner', canActivate: [authGuard, roleGuard], data: { role: 'OWNER' }, children: [
    { path: 'dashboard', loadComponent: () => import('./owner/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
    { path: 'vehicles', loadComponent: () => import('./owner/vehicles/owner-vehicles.component').then(m => m.OwnerVehiclesComponent) },
    { path: 'vehicles/add', loadComponent: () => import('./owner/add-vehicle/add-vehicle.component').then(m => m.AddVehicleComponent) },
    { path: 'vehicles/edit/:id', loadComponent: () => import('./owner/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent) },
    { path: 'bookings', loadComponent: () => import('./owner/bookings/owner-bookings.component').then(m => m.OwnerBookingsComponent) },
    { path: 'earnings', loadComponent: () => import('./owner/earnings/earnings.component').then(m => m.EarningsComponent) },
    { path: 'reviews', loadComponent: () => import('./owner/reviews/owner-reviews.component').then(m => m.OwnerReviewsComponent) },
    { path: 'profile', loadComponent: () => import('./owner/profile/owner-profile.component').then(m => m.OwnerProfileComponent) },
    { path: 'notifications', loadComponent: () => import('./owner/notifications/notifications.component').then(m => m.NotificationsComponent) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},
  { path: '**', redirectTo: '' }
];
