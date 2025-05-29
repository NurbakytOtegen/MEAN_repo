const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(auth);

// Получение профилей
router.get('/me', profileController.getMyProfile);
router.get('/id/:id', profileController.getProfileById);
router.get('/email/:email', profileController.getProfileByEmail);
router.get('/name/:name', profileController.getProfileByName);

// Обновление профиля
router.put('/update/name', profileController.updateName);
router.put('/update/password', profileController.updatePassword);

module.exports = router; 