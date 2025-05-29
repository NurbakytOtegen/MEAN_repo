// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// export interface Car {
//   id: string;
//   brand: string;
//   model: string;
//   year: number;
//   price: number;
//   image_url: string;
//   mileage: number;
//   transmission: string;
//   car_type: string;
//   engine_volume: number;
//   is_new: boolean;
//   avg_rating: number;
// }

// export interface Favorite {
//   _id: string;
//   userId: string;
//   carId: Car;
//   createdAt: string;
//   updatedAt: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class FavoritesService {
//   private apiUrl = `${environment.apiUrl}/api/favorites`;

//   constructor(private http: HttpClient) {}

//   getFavorites(): Observable<Favorite[]> {
//     return this.http.get<Favorite[]>(this.apiUrl);
//   }

//   addFavorite(carId: string): Observable<Favorite> {
//     return this.http.post<Favorite>(this.apiUrl, { carId });
//   }

//   removeFavorite(carId: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${carId}`);
//   }
// }