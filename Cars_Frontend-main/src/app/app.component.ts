import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand a {
      font-size: 1.5rem;
      color: #333;
      text-decoration: none;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-links a {
      color: #666;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: #007bff;
    }

    .nav-links a.active {
      color: #007bff;
      font-weight: 500;
    }

    .logout-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      transition: color 0.3s;
    }

    .logout-btn:hover {
      color: #dc3545;
    }

    .admin-btn {
      color: #28a745 !important;
    }

    .admin-btn:hover {
      color: #218838 !important;
    }

    .main-content {
      min-height: calc(100vh - 120px);
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer {
      background: #f8f9fa;
      padding: 1rem;
      text-align: center;
      color: #666;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Car Dealership';
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.updateAdminStatus();
    
    // Подписываемся на изменения пользователя
    this.authService.currentUser$.subscribe(() => {
      this.updateAdminStatus();
    });
  }

  private updateAdminStatus(): void {
    const roles = this.authService.getUserRoles();
    this.isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}