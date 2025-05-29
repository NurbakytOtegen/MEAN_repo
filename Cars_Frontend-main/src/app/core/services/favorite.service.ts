import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car } from '../../models/car.model';

export interface Favorite {
  _id: string;
  userId: string;
  carId: Car;  // Это вложенный объект Car
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {
    console.log('FavoriteService initialized with API URL:', this.apiUrl);
  }

  // Получить список избранных автомобилей
  getFavorites(): Observable<Favorite[]> {
    console.log('Getting favorites from:', this.apiUrl);
    return this.http.get<Favorite[]>(this.apiUrl).pipe(
      tap({
        next: (response) => console.log('Favorites response:', response),
        error: (error) => console.error('Error getting favorites:', error)
      })
    );
  }

  // Добавить автомобиль в избранное
  addToFavorites(carId: string): Observable<Favorite> {
    const url = `${this.apiUrl}/${carId}`;
    console.log('Adding to favorites:', url);
    return this.http.post<Favorite>(url, {}).pipe(
      tap({
        next: (response) => console.log('Add to favorites response:', response),
        error: (error) => console.error('Error adding to favorites:', error)
      })
    );
  }

  // Удалить автомобиль из избранного
  removeFromFavorites(carId: string): Observable<void> {
    const url = `${this.apiUrl}/${carId}`;
    console.log('Removing from favorites:', url);
    return this.http.delete<void>(url).pipe(
      tap({
        next: () => console.log('Successfully removed from favorites'),
        error: (error) => console.error('Error removing from favorites:', error)
      })
    );
  }

  // Проверить, находится ли автомобиль в избранном
  isFavorite(carId: string): Observable<{ is_favorite: boolean }> {
    const url = `${this.apiUrl}/check/${carId}`;
    console.log('Checking if favorite:', url);
    return this.http.get<{ is_favorite: boolean }>(url).pipe(
      tap({
        next: (response) => console.log('Is favorite response:', response),
        error: (error) => console.error('Error checking favorite status:', error)
      })
    );
  }
} 