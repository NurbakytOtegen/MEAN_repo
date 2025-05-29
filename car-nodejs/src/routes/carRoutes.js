const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const reviewController = require('../controllers/reviewController');
const { auth, checkRole } = require('../middleware/auth');

// Публичные маршруты
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.get('/top-rated', carController.getTopRatedCars);
router.get('/:id/reviews', reviewController.getCarReviews);

// Защищенные маршруты (требуют роли ADMIN или SUPER_ADMIN)
router.use(auth, checkRole(['ADMIN', 'SUPER_ADMIN']));
router.post('/', carController.createCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router; 