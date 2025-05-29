import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-container" [class.disabled]="disabled">
      <span class="star" 
            *ngFor="let i of [1,2,3,4,5]"
            (click)="onRate(i)"
            (mouseover)="onHover(i)"
            (mouseout)="onHover(0)"
            [class.filled]="i <= value"
            [class.hover]="!disabled && i <= hoverValue">
        ★
      </span>
    </div>
  `,
  styles: [`
    .star-container {
      display: inline-block;
    }
    .star-container:not(.disabled) {
      cursor: pointer;
    }
    .star {
      font-size: 24px;
      color: #ddd;
      transition: color 0.2s;
    }
    .star.filled {
      color: #ffc107;
    }
    .star.hover {
      color: #ffdb70;
    }
    .disabled .star {
      cursor: default;
      opacity: 0.7;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() set value(val: number) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }
  get value(): number {
    return this._value;
  }

  private _value = 0;
  hoverValue = 0;
  private onChange = (value: number) => {};
  private onTouched = () => {};

  onRate(rating: number): void {
    if (!this.disabled) {
      this.value = rating;
      this.onTouched();
    }
  }

  onHover(rating: number): void {
    if (!this.disabled) {
      this.hoverValue = rating;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this._value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 