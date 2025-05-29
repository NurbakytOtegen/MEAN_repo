import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="text" 
            id="email" 
            [(ngModel)]="email" 
            name="email" 
            required
            class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            [(ngModel)]="password" 
            name="password" 
            required
            class="form-control">
        </div>
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <button type="submit" class="login-button">Login</button>
        <div class="register-link">
          Don't have an account? <a routerLink="/register">Register</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    .login-button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    .login-button:hover {
      background-color: #0056b3;
    }
    .error-message {
      color: #dc3545;
      margin: 10px 0;
    }
    .register-link {
      text-align: center;
      margin-top: 15px;
    }
    .register-link a {
      color: #007bff;
      text-decoration: none;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/cars']);
        } else {
          this.errorMessage = 'Invalid response from server';
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        console.error('Login error:', error);
      }
    });
  }
}