import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  reviews: {
    id: number;
    car_id: number;
    user_id: number;
    rating: number;
    comment: string;
    createdAt: string;
    carId: {
      id: number;
      brand: string;
      model: string;
      year: number;
      image_url: string;
      price: number;
      mileage: number;
      transmission: string;
      engine_vol: number;
      is_new: boolean;
      avg_rating: number;
    };
  }[];
}

export interface UpdateNameRequest {
  name: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  // Получить профиль текущего пользователя
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  // Получить профиль по ID
  getProfileById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/id/${id}`);
  }

  // Получить профиль по email
  getProfileByEmail(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/email/${email}`);
  }

  // Получить профиль по имени
  getProfileByName(name: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/name/${name}`);
  }

  // Обновить имя пользователя
  updateName(request: UpdateNameRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/update/name`, request);
  }

  // Обновить пароль пользователя
  updatePassword(request: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/password`, request);
  }
} 