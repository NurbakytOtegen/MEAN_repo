import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Car } from '../../models/car.model';
import { CarService } from '../../core/services/car.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 12;
  loading = true;
  error: string | null = null;
  favorites = new Set<string>();
  private destroy$ = new Subject<void>();

  // Фильтры
  searchTerm = '';
  filters = {
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    carType: '',
    transmission: '',
    condition: ''
  };

  // Уникальные значения для фильтров
  uniqueBrands: string[] = [];
  filteredModels: string[] = [];
  carTypes = ['sedan', 'suv', 'hatchback', 'coupe', 'wagon', 'van', 'truck'];
  transmissionTypes = ['manual', 'automatic'];
  conditions = ['new', 'used'];

  constructor(
    private carService: CarService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCars(): void {
    this.loading = true;
    this.error = null;
    
    this.carService.getCars().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.updateFilters();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.error = error.message || 'Failed to load cars. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        // Фильтруем только те избранные, у которых есть carId и id
        const validFavorites = favorites.filter(fav => fav.carId?.id);
        // Преобразуем в Set<string>, отфильтровывая undefined
        this.favorites = new Set(validFavorites.map(fav => fav.carId.id).filter((id): id is string => id !== undefined));
        console.log('Loaded favorites:', this.favorites);
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.favorites = new Set<string>();
      }
    });
  }

  toggleFavorite(car: Car): void {
    if (!car.id) {
      console.error('Cannot toggle favorite: car.id is undefined');
      return;
    }

    const carId = car.id; // Сохраняем id в переменную, чтобы TypeScript знал, что это string

    if (this.favorites.has(carId)) {
      this.favoriteService.removeFromFavorites(carId).subscribe({
        next: () => {
          const newFavorites = new Set(this.favorites);
          newFavorites.delete(carId);
          this.favorites = newFavorites;
          console.log('Removed from favorites:', carId);
        },
        error: (error) => console.error('Error removing from favorites:', error)
      });
    } else {
      this.favoriteService.addToFavorites(carId).subscribe({
        next: (favorite) => {
          if (favorite.carId?.id) {
            const newFavorites = new Set(this.favorites);
            newFavorites.add(favorite.carId.id);
            this.favorites = newFavorites;
            console.log('Added to favorites:', favorite.carId.id);
          }
        },
        error: (error) => console.error('Error adding to favorites:', error)
      });
    }
  }

  updateFilters(): void {
    this.uniqueBrands = [...new Set(this.cars.map(car => car.brand))].sort();
    this.updateModelFilter();
  }

  updateModelFilter(): void {
    if (this.filters.brand) {
      this.filteredModels = [...new Set(
        this.cars
          .filter(car => car.brand === this.filters.brand)
          .map(car => car.model)
      )].sort();
    } else {
      this.filteredModels = [...new Set(this.cars.map(car => car.model))].sort();
    }
  }

  onBrandChange(): void {
    this.filters.model = '';
    this.updateModelFilter();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCars = this.cars.filter(car => {
      const matchesSearch = !this.searchTerm || 
        car.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesBrand = !this.filters.brand || car.brand === this.filters.brand;
      const matchesModel = !this.filters.model || car.model === this.filters.model;
      
      const matchesYearFrom = !this.filters.yearFrom || car.year >= +this.filters.yearFrom;
      const matchesYearTo = !this.filters.yearTo || car.year <= +this.filters.yearTo;
      
      const matchesPriceFrom = !this.filters.priceFrom || car.price >= +this.filters.priceFrom;
      const matchesPriceTo = !this.filters.priceTo || car.price <= +this.filters.priceTo;
      
      const matchesCarType = !this.filters.carType || car.car_type === this.filters.carType;
      const matchesTransmission = !this.filters.transmission || car.transmission === this.filters.transmission;
      const matchesCondition = !this.filters.condition || 
        (this.filters.condition === 'new' ? car.is_new : !car.is_new);

      return matchesSearch && matchesBrand && matchesModel && 
             matchesYearFrom && matchesYearTo && 
             matchesPriceFrom && matchesPriceTo && 
             matchesCarType && matchesTransmission && matchesCondition;
    });

    this.totalPages = Math.ceil(this.filteredCars.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      carType: '',
      transmission: '',
      condition: ''
    };
    this.currentPage = 1;
    this.updateModelFilter();
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getRatingStars(rating: number): string[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? '★' : '☆');
  }

  getDisplayedCars(): Car[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredCars.slice(start, end);
  }
} 