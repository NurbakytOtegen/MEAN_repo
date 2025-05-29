import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile, UpdateNameRequest, UpdatePasswordRequest } from './profile.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = true;
  error: string | null = null;

  // Формы изменения данных
  newName: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  isEditingName = false;
  isChangingPassword = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
        this.newName = data.user.name;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile';
        this.loading = false;
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // Начать редактирование имени
  startEditName(): void {
    this.isEditingName = true;
  }

  // Отменить редактирование имени
  cancelEditName(): void {
    this.isEditingName = false;
    this.newName = this.profile?.user.name || '';
  }

  // Сохранить новое имя
  saveName(): void {
    if (!this.newName || this.newName === this.profile?.user.name) {
      this.cancelEditName();
      return;
    }

    const request: UpdateNameRequest = { name: this.newName };
    this.profileService.updateName(request).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.isEditingName = false;
        this.showMessage('Имя успешно обновлено');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Ошибка при обновлении имени');
      }
    });
  }

  // Начать изменение пароля
  startChangePassword(): void {
    this.isChangingPassword = true;
    this.oldPassword = '';
    this.newPassword = '';
  }

  // Отменить изменение пароля
  cancelChangePassword(): void {
    this.isChangingPassword = false;
    this.oldPassword = '';
    this.newPassword = '';
  }

  // Сохранить новый пароль
  savePassword(): void {
    if (!this.oldPassword || !this.newPassword) {
      this.showMessage('Пожалуйста, заполните все поля');
      return;
    }

    const request: UpdatePasswordRequest = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.profileService.updatePassword(request).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.showMessage('Пароль успешно обновлен');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Ошибка при обновлении пароля');
      }
    });
  }

  // Показать сообщение пользователю
  private showMessage(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Форматирование даты для отображения
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  // Получить среднюю оценку отзывов пользователя
  getAverageRating(): number {
    if (!this.profile?.reviews || this.profile.reviews.length === 0) {
      return 0;
    }
    const sum = this.profile.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.profile.reviews.length;
  }

  // Получить количество отзывов
  getReviewsCount(): number {
    return this.profile?.reviews?.length || 0;
  }

  // Получить звезды для рейтинга
  getRatingStars(rating: number): string[] {
    return Array(5).fill('★').map((star, index) => index < Math.round(rating) ? '★' : '☆');
  }
} 