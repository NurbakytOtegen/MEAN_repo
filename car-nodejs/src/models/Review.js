const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Составной индекс для предотвращения дублирования отзывов
reviewSchema.index({ userId: 1, carId: 1 }, { unique: true });

// Middleware для обновления средней оценки автомобиля после сохранения/обновления отзыва
reviewSchema.post('save', async function() {
  await this.constructor.model('Car').calculateAverageRating(this.carId);
});

reviewSchema.post('remove', async function() {
  await this.constructor.model('Car').calculateAverageRating(this.carId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 