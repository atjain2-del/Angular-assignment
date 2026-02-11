import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in AND is an admin
  const user = auth.currentUser();
  if (user && user.role === 'admin') {
    return true;
  }

  // Redirect unauthorized access
  return router.createUrlTree(['/access-denied']);
};
