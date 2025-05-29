import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { User } from './user.service';

interface JwtPayload {
  _id: string;
  role: string | string[];
  exp: number;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFromLocalStorage();
    }
  }

  private initializeFromLocalStorage(): void {
    try {
      const token = localStorage.getItem('token');
      if (token && this.isTokenValid(token)) {
        this.tokenSubject.next(token);
      } else {
        this.logout();
      }

      const user = localStorage.getItem('user');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }

  private setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }

  private removeFromLocalStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password }).pipe(
      tap(response => {
        this.setLocalStorage('token', response.token);
        this.setLocalStorage('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.setLocalStorage('token', response.token);
          this.setLocalStorage('user', JSON.stringify(response.user));
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    this.removeFromLocalStorage('token');
    this.removeFromLocalStorage('user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.tokenSubject.value;
    return !!token && this.isTokenValid(token);
  }

  getToken(): string | null {
    const token = this.tokenSubject.value;
    if (!token) {
      if (isPlatformBrowser(this.platformId)) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.tokenSubject.next(storedToken);
          return storedToken;
        }
      }
      return null;
    }
    const isValid = this.isTokenValid(token);
    return isValid ? token : null;
  }

  getCurrentUserId(): string | null {
    const token = this.tokenSubject.value;
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded._id;
    } catch {
      return null;
    }
  }

  getUserRoles(): string[] {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      return [currentUser.role];
    }
    return [];
  }

  hasRole(role: string | string[]): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;

    const roles = Array.isArray(role) ? role : [role];
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return roles.includes(currentUser.role);
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap(user => {
        this.setLocalStorage('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isSuperAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'SUPER_ADMIN';
  }
}
