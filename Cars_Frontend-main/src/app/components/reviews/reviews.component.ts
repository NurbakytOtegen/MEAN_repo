import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review, RatingStats } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/services/user.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StarRatingComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  @Input() carId!: string;
  
  reviews: Review[] = [];
  ratingStats: RatingStats | null = null;
  reviewForm: FormGroup;
  isEditing = false;
  editingReviewId: string | null = null;
  currentUserId: string | null = null;
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(0.5), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUser = this.authService.getCurrentUserValue();
    console.log("currentUserId", this.currentUserId);
    console.log("currentUser", this.currentUser);
    console.log("carId", this.carId);
    console.log("Can write review", this.canWriteReview());
    this.loadReviews();
  }

  // Проверяем, может ли пользователь оставлять отзывы
  canWriteReview(): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.isBlocked) return false;
    return true;
  }

  loadReviews(): void {
    if (!this.carId) return;
    
    this.loading = true;
    this.error = null;

    this.reviewService.getCarReviews(this.carId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateRatingStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.error = error.message || 'Failed to load reviews';
        this.loading = false;
      }
    });
  }

  calculateRatingStats(): void {
    if (!this.reviews.length) {
      this.ratingStats = {
        avgRating: 0,
        totalReviews: 0,
        rating5Count: 0,
        rating4Count: 0,
        rating3Count: 0,
        rating2Count: 0,
        rating1Count: 0
      };
      return;
    }

    let stats = {
      rating5Count: 0,
      rating4Count: 0,
      rating3Count: 0,
      rating2Count: 0,
      rating1Count: 0
    };

    let totalRating = 0;

    this.reviews.forEach(review => {
      totalRating += review.rating;
      const roundedRating = Math.round(review.rating);
      switch (roundedRating) {
        case 5: stats.rating5Count++; break;
        case 4: stats.rating4Count++; break;
        case 3: stats.rating3Count++; break;
        case 2: stats.rating2Count++; break;
        case 1: stats.rating1Count++; break;
      }
    });

    this.ratingStats = {
      ...stats,
      avgRating: totalRating / this.reviews.length,
      totalReviews: this.reviews.length
    };
  }

  calculateRatingPercentage(count: number): number {
    if (!this.ratingStats?.totalReviews) return 0;
    return (count / this.ratingStats.totalReviews) * 100;
  }

  getRatingCount(rating: number): number {
    if (!this.ratingStats) return 0;
    switch (rating) {
      case 5: return this.ratingStats.rating5Count;
      case 4: return this.ratingStats.rating4Count;
      case 3: return this.ratingStats.rating3Count;
      case 2: return this.ratingStats.rating2Count;
      case 1: return this.ratingStats.rating1Count;
      default: return 0;
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const review: Review = {
        carId: this.carId,
        userId: this.currentUserId!,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };

      this.loading = true;
      this.error = null;

      if (this.isEditing && this.editingReviewId) {
        this.reviewService.updateReview(this.editingReviewId, review).subscribe({
          next: () => {
            this.loadReviews();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating review:', error);
            this.error = error.message || 'Failed to update review';
            this.loading = false;
          }
        });
      } else {
        this.reviewService.createReview(review).subscribe({
          next: () => {
            this.loadReviews();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error creating review:', error);
            this.error = error.message || 'Failed to create review';
            this.loading = false;
          }
        });
      }
    }
  }

  editReview(review: Review): void {
    this.isEditing = true;
    this.editingReviewId = review.id!;
    this.reviewForm.patchValue({
      rating: review.rating,
      comment: review.comment
    });
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.loading = true;
      this.error = null;

      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.loadReviews();
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          this.error = error.message || 'Failed to delete review';
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.isEditing = false;
    this.editingReviewId = null;
    this.loading = false;
    this.error = null;
  }

  canModifyReview(review: Review): boolean {
    let reviewUserId: string | undefined;
    if (typeof review.userId === 'object' && review.userId !== null) {
      reviewUserId = (review.userId as { id?: string; _id?: string }).id || (review.userId as { _id?: string })._id;
    } else {
      reviewUserId = review.userId as string;
    }
    return String(this.currentUserId) === String(reviewUserId);
  }
} 