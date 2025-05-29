const Favorite = require('../models/Favorite');

// Добавление автомобиля в избранное
exports.addToFavorites = async (req, res) => {
  try {
    const favorite = new Favorite({
      userId: req.user._id,
      carId: req.params.carId
    });

    await favorite.save();
    await favorite.populate('carId');
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: 'Car is already in favorites' });
    }
    res.status(400).json({ error: error.message });
  }
};

// Удаление автомобиля из избранного
exports.removeFromFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      carId: req.params.carId
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение списка избранных автомобилей пользователя
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('carId');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Проверка, находится ли автомобиль в избранном
exports.checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      carId: req.params.carId
    });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 