import { Car } from "./car.model";

export interface Review {
  id?: string;
  carId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
  car?: Car;
}

export interface RatingStats {
  avgRating: number;
  totalReviews: number;
  rating5Count: number;
  rating4Count: number;
  rating3Count: number;
  rating2Count: number;
  rating1Count: number;
} 