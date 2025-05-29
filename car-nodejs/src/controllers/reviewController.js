const Review = require('../models/Review');
const Car = require('../models/Car');
const mongoose = require('mongoose');

// Создание нового отзыва
exports.createReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const review = new Review({
      ...req.body,
      userId: req.user._id
    });
    await review.save();
    await review.populate('carId userId');
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'You have already reviewed this car' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Получение отзыва по ID
exports.getReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findById(req.params.id).populate('carId userId');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновление отзыва
exports.updateReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }

    Object.assign(review, req.body);
    await review.save();
    await review.populate('carId userId');
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удаление отзыва
exports.deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }

    // await review.remove();
    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение отзывов для конкретного автомобиля
exports.getCarReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const reviews = await Review.find({ carId: req.params.id })
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    res.json(reviews);
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

    // Получаем детали автомобилей
    const carIds = topCars.map(car => car._id);
    const cars = await Car.find({ _id: { $in: carIds } });

    // Объединяем информацию о рейтингах с данными автомобилей
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

// Получение статистики рейтинга для автомобиля
exports.getCarStats = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const carId = mongoose.Types.ObjectId(req.params.id);

    const stats = await Review.aggregate([
      {
        $match: { carId }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      });
    }

    // Подсчитываем распределение рейтингов
    const distribution = stats[0].ratingDistribution.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    // Форматируем ответ
    res.json({
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: {
        1: distribution[1] || 0,
        2: distribution[2] || 0,
        3: distribution[3] || 0,
        4: distribution[4] || 0,
        5: distribution[5] || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 