import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            [(ngModel)]="username" 
            name="username" 
            required
            class="form-control">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
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
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            [(ngModel)]="confirmPassword" 
            name="confirmPassword" 
            required
            class="form-control">
        </div>
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <button type="submit" class="register-button">Register</button>
        <div class="login-link">
          Already have an account? <a routerLink="/login">Login</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
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
    .register-button {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    .register-button:hover {
      background-color: #218838;
    }
    .error-message {
      color: #dc3545;
      margin: 10px 0;
    }
    .login-link {
      text-align: center;
      margin-top: 15px;
    }
    .login-link a {
      color: #007bff;
      text-decoration: none;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response: { token: string; message?: string }) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error: { error?: { message: string } }) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
