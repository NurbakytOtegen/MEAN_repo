import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUserValue();
  
  // SUPER_ADMIN всегда имеет доступ
  if (currentUser?.role === 'SUPER_ADMIN') {
    return true;
  }

  // Проверяем требуемые роли из route.data
  const requiredRoles = route.data?.['roles'] || ['ADMIN'];
  const hasAccess = currentUser && requiredRoles.includes(currentUser.role);

  if (!hasAccess) {
    router.navigate(['/cars']);
    return false;
  }

  return true;
}; 