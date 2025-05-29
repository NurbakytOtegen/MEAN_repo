const Car = require('../models/Car');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// Получение всех автомобилей
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    // Получаем средние рейтинги для всех автомобилей
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: '$carId',
          avg_rating: { $avg: '$rating' }
        }
      }
    ]);

    // Добавляем рейтинги к автомобилям
    const carsWithRatings = cars.map(car => {
      const rating = ratings.find(r => r._id.equals(car._id));
      const carObj = car.toObject();
      carObj.id = carObj._id;
      delete carObj._id;
      carObj.avg_rating = rating ? rating.avg_rating : 0;
      return carObj;
    });

    res.json(carsWithRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение автомобиля по ID
exports.getCarById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid car ID format' });
    }

    const car = await Car.findById(req.params.id).populate('reviews');
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Получаем средний рейтинг
    const rating = await Review.aggregate([
      {
        $match: { carId: car._id }
      },
      {
        $group: {
          _id: null,
          avg_rating: { $avg: '$rating' }
        }
      }
    ]);

    const carObj = car.toObject();
    carObj.id = carObj._id;
    delete carObj._id;
    carObj.avg_rating = rating.length > 0 ? rating[0].avg_rating : 0;

    res.json(carObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создание автомобиля
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    const carObj = car.toObject();
    carObj.id = carObj._id;
    delete carObj._id;
    res.status(201).json(carObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновление автомобиля
exports.updateCar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid car ID format' });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const carObj = car.toObject();
    carObj.id = carObj._id;
    delete carObj._id;
    res.json(carObj);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Удаление автомобиля
exports.deleteCar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid car ID format' });
    }

    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await car.deleteOne();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение топ рейтинговых автомобилей
exports.getTopRatedCars = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topCars = await Review.aggregate([
      {
        $group: {
          _id: '$carId',
          avg_rating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: { avg_rating: -1 }
      },
      {
        $limit: limit
      }
    ]);

    const carIds = topCars.map(car => car._id);
    const cars = await Car.find({ _id: { $in: carIds } });

    const result = cars.map(car => {
      const ratingInfo = topCars.find(tc => tc._id.equals(car._id));
      const carObj = car.toObject();
      carObj.avg_rating = ratingInfo.avg_rating;
      carObj.reviewCount = ratingInfo.reviewCount;
      return carObj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 