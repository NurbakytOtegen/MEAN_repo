const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// Публичные маршруты
router.get('/top-rated-cars', reviewController.getTopRatedCars);
router.get('/:id', reviewController.getReview);

// Маршруты для статистики
router.get('/car/:id/reviews', reviewController.getCarReviews);
router.get('/car/:id/rating-stats', reviewController.getCarStats);

// Защищенные маршруты
router.use(auth);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router; 