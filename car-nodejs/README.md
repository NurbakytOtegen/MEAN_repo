# Car Shop API

REST API для магазина автомобилей с возможностью просмотра, добавления в избранное и оставления отзывов.

## Технологии

- Node.js
- Express
- MongoDB с Mongoose
- JWT для аутентификации
- bcryptjs для хеширования паролей
- cors для обработки CORS
- morgan для логирования

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd car-nodejs
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корневой директории и добавьте следующие переменные:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-shop
JWT_SECRET=your-super-secret-jwt-key
```

4. Запустите MongoDB:
```bash
# Убедитесь, что MongoDB запущен на вашей системе
```

5. Запустите сервер:
```bash
# Для разработки (с nodemon)
npm run dev

# Для продакшена
npm start
```

## API Endpoints

### Автомобили
- GET /api/cars - Получить список всех автомобилей
- GET /api/cars/:id - Получить информацию об автомобиле
- POST /api/cars - Создать новый автомобиль (только админ)
- PUT /api/cars/:id - Обновить информацию об автомобиле (только админ)
- DELETE /api/cars/:id - Удалить автомобиль (только админ)
- GET /api/cars/top-rated - Получить топ рейтинговых автомобилей

### Отзывы
- GET /api/reviews/:id - Получить отзыв
- GET /api/reviews/car/:id - Получить все отзывы для автомобиля
- GET /api/reviews/car/:id/stats - Получить статистику рейтинга автомобиля
- POST /api/reviews - Создать новый отзыв (требуется аутентификация)
- PUT /api/reviews/:id - Обновить отзыв (требуется аутентификация)
- DELETE /api/reviews/:id - Удалить отзыв (требуется аутентификация)

### Избранное
- POST /api/cars/:carId/favorite - Добавить автомобиль в избранное
- DELETE /api/cars/:carId/favorite - Удалить автомобиль из избранного
- GET /api/favorites - Получить список избранных автомобилей
- GET /api/cars/:carId/favorite - Проверить, находится ли автомобиль в избранном

## Модели данных

### Car
- brand: String (required)
- model: String (required)
- carType: String (required)
- year: Number (required)
- imageUrl: String (required)
- mileage: Number (required)
- transmission: String (required)
- engineVolume: Number (required)
- price: Number (required)
- isNewCar: Boolean
- avgRating: Number

### Review
- carId: ObjectId (required, ref: 'Car')
- userId: ObjectId (required, ref: 'User')
- rating: Number (required, 1-5)
- comment: String (required, 3-1000 chars)

### User
- email: String (required, unique)
- password: String (required)
- name: String (required)
- role: String (enum: ['USER', 'ADMIN', 'SUPER_ADMIN'])
- isBlocked: Boolean

### Favorite
- userId: ObjectId (required, ref: 'User')
- carId: ObjectId (required, ref: 'Car') 