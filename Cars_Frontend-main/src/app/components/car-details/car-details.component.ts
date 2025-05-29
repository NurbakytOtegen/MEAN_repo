import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../models/car.model';
import { CarService } from '../../core/services/car.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, ReviewsComponent],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit, OnDestroy {
  car: Car | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params['id'];
      if (!id || typeof id !== 'string') {
        this.error = 'Invalid car ID';
        this.loading = false;
        return;
      }
      this.loadCarDetails(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCarDetails(id: string): void {
    if (!id) {
      this.error = 'Car ID is required';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    console.log('Loading car with ID:', id);

    this.carService.getCarById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (car) => {
        this.car = car;
        this.loading = false;
        console.log('Loaded car:', car);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.error = 'Car not found. It might have been removed.';
        } else {
          this.error = 'Failed to load car details. Please try again later.';
        }
        console.error('Error loading car details:', error);
      }
    });
  }

  getRatingStars(rating: number): string[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? '★' : '☆');
  }

  goToCarsList(): void {
    this.router.navigate(['/cars']);
  }
} 