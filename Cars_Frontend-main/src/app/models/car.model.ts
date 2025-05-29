import { Review } from './review.model';

export interface Car {
  id: string;  // Основной идентификатор
  _id?: string; // Опциональный для обратной совместимости
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image_url: string;
  description?: string;
  is_new: boolean;
  avg_rating?: number;
  car_type: string;
  transmission: string;
  engine_vol: number;
  engine_volume?: number;
  updatedAt?: string;
  reviews?: Review[];
} 