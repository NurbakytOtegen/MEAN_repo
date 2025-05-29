import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-car-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Добавить новый автомобиль</h2>
    <form [formGroup]="carForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Марка</mat-label>
          <input matInput formControlName="brand" required>
          <mat-error *ngIf="carForm.get('brand')?.hasError('required')">
            Марка обязательна
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Модель</mat-label>
          <input matInput formControlName="model" required>
          <mat-error *ngIf="carForm.get('model')?.hasError('required')">
            Модель обязательна
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Год выпуска</mat-label>
          <input matInput type="number" formControlName="year" required>
          <mat-error *ngIf="carForm.get('year')?.hasError('required')">
            Год выпуска обязателен
          </mat-error>
          <mat-error *ngIf="carForm.get('year')?.hasError('min') || carForm.get('year')?.hasError('max')">
            Год должен быть между 1900 и {{ currentYear + 1 }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Цена</mat-label>
          <input matInput type="number" formControlName="price" required>
          <mat-error *ngIf="carForm.get('price')?.hasError('required')">
            Цена обязательна
          </mat-error>
          <mat-error *ngIf="carForm.get('price')?.hasError('min')">
            Цена должна быть больше 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Пробег</mat-label>
          <input matInput type="number" formControlName="mileage" required>
          <mat-error *ngIf="carForm.get('mileage')?.hasError('required')">
            Пробег обязателен
          </mat-error>
          <mat-error *ngIf="carForm.get('mileage')?.hasError('min')">
            Пробег не может быть отрицательным
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Трансмиссия</mat-label>
          <mat-select formControlName="transmission" required>
            <mat-option value="manual">Механическая</mat-option>
            <mat-option value="automatic">Автоматическая</mat-option>
            <mat-option value="robot">Робот</mat-option>
            <mat-option value="variator">Вариатор</mat-option>
          </mat-select>
          <mat-error *ngIf="carForm.get('transmission')?.hasError('required')">
            Трансмиссия обязательна
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Объем двигателя</mat-label>
          <input matInput type="number" formControlName="engine_vol" required>
          <mat-error *ngIf="carForm.get('engine_vol')?.hasError('required')">
            Объем двигателя обязателен
          </mat-error>
          <mat-error *ngIf="carForm.get('engine_vol')?.hasError('min')">
            Объем двигателя должен быть больше 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>URL изображения</mat-label>
          <input matInput formControlName="image_url">
        </mat-form-field>

        <mat-checkbox formControlName="is_new">Новый автомобиль</mat-checkbox>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Отмена</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!carForm.valid">
          Добавить
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-checkbox {
      margin-bottom: 15px;
    }
  `]
})
export class AddCarDialogComponent {
  carForm: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCarDialogComponent>
  ) {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear + 1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      transmission: ['', Validators.required],
      engine_vol: ['', [Validators.required, Validators.min(0)]],
      image_url: [''],
      is_new: [false]
    });
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const formValue = this.carForm.value;
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 