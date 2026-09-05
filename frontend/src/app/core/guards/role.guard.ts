import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'] as string;
  const isOwner = authService.isOwner();
  const isUser = authService.isUser();

  if (expectedRole === 'OWNER' && !isOwner) {
    router.navigate(['/user/dashboard']);
    return false;
  }
  
  if (expectedRole === 'USER' && !isUser) {
    router.navigate(['/owner/dashboard']);
    return false;
  }

  return true;
};
