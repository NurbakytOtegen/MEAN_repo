import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService, Favorite } from '../../core/services/favorite.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  loading = false;
  error: string | null = null;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.error = null;
    
    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load favorites. Please try again later.';
        this.loading = false;
        console.error('Error loading favorites:', err);
      }
    });
  }

  removeFromFavorites(carId: string): void {
    this.favoriteService.removeFromFavorites(carId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(favorite => favorite.carId._id !== carId);
      },
      error: (err: any) => {
        console.error('Error removing from favorites:', err);
      }
    });
  }

  getRatingStars(rating: number): string[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? '★' : '☆');
  }
} 