// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CarService } from '../../../core/services/car.service';

// @Component({
//   selector: 'app-car-list',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="cars-container">
//       <h2>Cars List</h2>
//       <div class="cars-grid">
//         <div *ngFor="let car of cars" class="car-card">
//           <h3>{{car.make}} {{car.model}}</h3>
//           <p>Year: {{car.year}}</p>
//           <p>Price: {{car.price}}</p>
//           <button (click)="viewDetails(car.id)">View Details</button>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .cars-container {
//       padding: 20px;
//     }
//     .cars-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//       gap: 20px;
//       padding: 20px;
//     }
//     .car-card {
//       border: 1px solid #ddd;
//       padding: 15px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//     }
//     button {
//       background-color: #007bff;
//       color: white;
//       border: none;
//       padding: 8px 16px;
//       border-radius: 4px;
//       cursor: pointer;
//     }
//     button:hover {
//       background-color: #0056b3;
//     }
//   `]
// })
// export class CarListComponent implements OnInit {
//   cars: any[] = [];

//   constructor(private carService: CarService) {}

//   ngOnInit(): void {
//     this.loadCars();
//   }

//   loadCars(): void {
//     this.carService.getCars().subscribe({
//       next: (cars) => this.cars = cars,
//       error: (error) => console.error('Error loading cars:', error)
//     });
//   }

//   viewDetails(id: number): void {
//     console.log('View details for car:', id);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../core/services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  brands = ['Toyota', 'Hyundai', 'Lada']; // Пример
  filters = {
    brand: '',
    mark: '',
    transmission: '',
    model: '',
    year: 0
  };

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCarss(this.filters).subscribe(data => {
      this.cars = data;
    });
  }

  applyFilters() {
    this.loadCars();
  }

  onPageChange(page: number) {
    // Реализуй пагинацию
  }
}
