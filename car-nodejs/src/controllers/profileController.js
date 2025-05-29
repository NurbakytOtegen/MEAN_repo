const User = require('../models/User');
const Review = require('../models/Review');

// Получение моего профиля
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'reviews',
        populate: { path: 'carId' }
      });

    const reviews = await Review.find({ userId: req.user._id })
      .populate('carId')
      .sort({ createdAt: -1 });

    res.json({
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение профиля по ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'reviews',
        populate: { path: 'carId' }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = await Review.find({ userId: req.params.id })
      .populate('carId')
      .sort({ createdAt: -1 });

    res.json({
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение профиля по email
exports.getProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .select('-password')
      .populate({
        path: 'reviews',
        populate: { path: 'carId' }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = await Review.find({ userId: user._id })
      .populate('carId')
      .sort({ createdAt: -1 });

    res.json({
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение профиля по имени
exports.getProfileByName = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name })
      .select('-password')
      .populate({
        path: 'reviews',
        populate: { path: 'carId' }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = await Review.find({ userId: user._id })
      .populate('carId')
      .sort({ createdAt: -1 });

    res.json({
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновление имени пользователя
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await User.findById(req.user._id);
    user.name = name;
    await user.save();

    res.json({ user: user.toObject({ hide: 'password' }) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновление пароля
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    const user = await User.findById(req.user._id);
    const isValidPassword = await user.comparePassword(oldPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный текущий пароль' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 