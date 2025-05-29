const User = require('../models/User');

// Получение всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Блокировка/разблокировка пользователя
exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Нельзя блокировать SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Cannot block SUPER_ADMIN users' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: user.toObject({ hide: 'password' })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Изменение роли пользователя
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверка валидности роли
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Нельзя изменять роль SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Cannot change SUPER_ADMIN role' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: user.toObject({ hide: 'password' })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Нельзя удалить SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Cannot delete SUPER_ADMIN users' });
    }

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 