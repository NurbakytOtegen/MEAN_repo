import { Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { 
    path: 'cars',
    component: CarListComponent,
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
  },
  {
    path: 'cars/:id',
    component: CarDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard, adminGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/cars' }
];