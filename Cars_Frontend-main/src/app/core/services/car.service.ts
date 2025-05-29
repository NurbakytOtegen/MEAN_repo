import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Car } from '../../models/car.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car).pipe(
      catchError(this.handleError)
    );
  }

  updateCar(id: string, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car).pipe(
      catchError(this.handleError)
    );
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getCarsWithFilters(filters: Record<string, string>): Observable<Car[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get<Car[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getTopRatedCars(limit: number = 5): Observable<Car[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Car[]>(`${this.apiUrl}/top-rated`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('CarService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
