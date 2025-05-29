import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';

interface CreateReviewDTO {
  carId: string;
  rating: number;
  comment: string;
}

interface UpdateReviewDTO {
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCarReviews(carId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/cars/${carId}/reviews`);
  }

  createReview(review: Review): Observable<Review> {
    const dto: CreateReviewDTO = {
      carId: review.carId,
      rating: review.rating,
      comment: review.comment
    };
    return this.http.post<Review>(`${this.apiUrl}/reviews`, dto);
  }

  updateReview(reviewId: string, review: Review): Observable<Review> {
    const dto: UpdateReviewDTO = {
      rating: review.rating,
      comment: review.comment
    };
    return this.http.put<Review>(`${this.apiUrl}/reviews/${reviewId}`, dto);
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${reviewId}`);
  }
} 