const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(auth);

router.post('/:carId/', favoriteController.addToFavorites);
router.delete('/:carId/', favoriteController.removeFromFavorites);
router.get('/', favoriteController.getUserFavorites);
router.get('/:carId/', favoriteController.checkFavorite);

module.exports = router; 