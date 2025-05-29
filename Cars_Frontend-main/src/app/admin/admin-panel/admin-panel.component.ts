import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { Car } from '../../models/car.model';
import { CarService } from '../../core/services/car.service';
import { UserService, User } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { EditCarDialogComponent } from '../edit-car-dialog/edit-car-dialog.component';
import { AddCarDialogComponent } from '../add-car-dialog/add-car-dialog.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule
  ],
  template: `
    <div class="admin-panel">
      <mat-tab-group>
        <!-- Cars Management Tab -->
        <mat-tab label="Управление автомобилями">
          <div class="panel-header">
            <h2>Управление автомобилями</h2>
            <button mat-raised-button color="primary" class="add-button" (click)="openAddCarDialog()" *ngIf="canManageCars">
              <span>Добавить автомобиль</span>
            </button>
          </div>

          <div class="table-container mat-elevation-z8">
            <table mat-table [dataSource]="cars">
              <ng-container matColumnDef="brand">
                <th mat-header-cell *matHeaderCellDef>Марка</th>
                <td mat-cell *matCellDef="let car">{{car.brand}}</td>
              </ng-container>

              <ng-container matColumnDef="model">
                <th mat-header-cell *matHeaderCellDef>Модель</th>
                <td mat-cell *matCellDef="let car">{{car.model}}</td>
              </ng-container>

              <ng-container matColumnDef="year">
                <th mat-header-cell *matHeaderCellDef>Год</th>
                <td mat-cell *matCellDef="let car">{{car.year}}</td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>Цена</th>
                <td mat-cell *matCellDef="let car">{{car.price | currency:'USD'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Действия</th>
                <td mat-cell *matCellDef="let car" class="action-buttons">
                  <button mat-flat-button color="primary" (click)="openEditCarDialog(car)" *ngIf="canManageCars">
                    <span>Изменить</span>
                  </button>
                  <button mat-flat-button color="warn" (click)="deleteCar(car)" *ngIf="canManageCars">
                    <span>Удалить</span>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="carColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: carColumns;"></tr>
            </table>
          </div>
        </mat-tab>

        <!-- Users Management Tab (Only for SUPER_ADMIN) -->
        <mat-tab label="Управление пользователями" *ngIf="isSuperAdmin">
          <div class="panel-header">
            <h2>Управление пользователями</h2>
          </div>

          <div class="table-container mat-elevation-z8">
            <table mat-table [dataSource]="users">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Имя</th>
                <td mat-cell *matCellDef="let user">{{user.name}}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{user.email}}</td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Роль</th>
                <td mat-cell *matCellDef="let user">
                  <mat-select 
                    [(value)]="user.role" 
                    (selectionChange)="updateUserRole(user.id, $event.value)"
                    [disabled]="user.role === 'SUPER_ADMIN'"
                  >
                    <mat-option value="USER">Пользователь</mat-option>
                    <mat-option value="ADMIN">Администратор</mat-option>
                  </mat-select>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Статус</th>
                <td mat-cell *matCellDef="let user">
                  <span [style.color]="user.isBlocked ? '#dc3545' : '#28a745'">
                    {{user.isBlocked ? 'Заблокирован' : 'Активен'}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Действия</th>
                <td mat-cell *matCellDef="let user" class="action-buttons">
                  <button 
                    mat-flat-button 
                    [style.background-color]="user.isBlocked ? '#28a745' : '#dc3545'"
                    [style.color]="'white'"
                    (click)="toggleUserBlock(user)"
                    [disabled]="user.role === 'SUPER_ADMIN'"
                  >
                    <span>{{user.isBlocked ? 'Разблокировать' : 'Заблокировать'}}</span>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
            </table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 16px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;
    }

    .panel-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .add-button {
      height: 40px;
      padding: 0 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .mat-mdc-header-cell {
      background-color: #f5f5f5;
      color: #333;
      font-weight: 600;
      padding: 16px;
      font-size: 14px;
    }

    .mat-mdc-cell {
      padding: 16px;
      font-size: 14px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      padding: 8px 16px !important;
    }

    .action-button {
      min-width: 120px;
      line-height: 36px;
    }

    .mat-mdc-row:hover {
      background-color: #f8f9fa;
    }

    ::ng-deep .mat-tab-body-content {
      padding: 16px 0;
    }

    ::ng-deep .mat-select-value {
      color: inherit !important;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  cars: Car[] = [];
  users: User[] = [];
  carColumns: string[] = ['brand', 'model', 'year', 'price', 'actions'];
  userColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
  isSuperAdmin: boolean = false;
  canManageCars: boolean = false;
  currentUserRole: string = '';

  constructor(
    private carService: CarService,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.checkUserRole();
  }

  private checkUserRole(): void {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.currentUserRole = currentUser.role;
      this.isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
      this.canManageCars = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
      
      if (this.isSuperAdmin) {
        this.loadUsers();
      }
    }
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.showMessage('Ошибка при загрузке автомобилей');
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showMessage('Ошибка при загрузке пользователей');
      }
    });
  }

  openAddCarDialog(): void {
    const dialogRef = this.dialog.open(AddCarDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carService.createCar(result).subscribe({
          next: () => {
            this.loadCars();
            this.showMessage('Автомобиль успешно добавлен');
          },
          error: (error) => {
            console.error('Error creating car:', error);
            this.showMessage('Ошибка при добавлении автомобиля');
          }
        });
      }
    });
  }

  openEditCarDialog(car: Car): void {
    const dialogRef = this.dialog.open(EditCarDialogComponent, {
      width: '600px',
      data: { ...car }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carService.updateCar(car.id!, result).subscribe({
          next: () => {
            this.loadCars();
            this.showMessage('Автомобиль успешно обновлен');
          },
          error: () => {
            this.showMessage('Ошибка при обновлении автомобиля');
          }
        });
      }
    });
  }

  deleteCar(car: Car): void {
    if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      this.carService.deleteCar(car.id!).subscribe({
        next: () => {
          this.loadCars();
          this.showMessage('Автомобиль успешно удален');
        },
        error: () => {
          this.showMessage('Ошибка при удалении автомобиля');
        }
      });
    }
  }

  updateUserRole(userId: number, newRole: string): void {
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.showMessage('Роль пользователя успешно обновлена');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.showMessage('Ошибка при обновлении роли пользователя');
        this.loadUsers(); // Перезагружаем список в случае ошибки
      }
    });
  }

  toggleUserBlock(user: User): void {
    const newBlockedState = !user.isBlocked;
    this.userService.blockUser(user.id).subscribe({
      next: (response) => {
        // Update the user object in the users array
        const updatedUser = this.users.find(u => u.id === user.id);
        if (updatedUser) {
          updatedUser.isBlocked = newBlockedState;
        }
        this.showMessage(`Пользователь успешно ${newBlockedState ? 'заблокирован' : 'разблокирован'}`);
      },
      error: (error) => {
        console.error('Error toggling user block status:', error);
        this.showMessage(`Ошибка при ${newBlockedState ? 'блокировке' : 'разблокировке'} пользователя`);
        // Reload users to ensure UI is in sync with server state
        this.loadUsers();
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
} 