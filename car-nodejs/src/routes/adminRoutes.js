const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, checkRole } = require('../middleware/auth');

// Все маршруты требуют аутентификации и роли SUPER_ADMIN
router.use(auth, checkRole(['SUPER_ADMIN']));

// Управление пользователями
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/block', adminController.toggleUserBlock);
router.put('/users/:id/role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router; 