const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  engine_vol: {
    type: Number,
    required: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['manual', 'automatic']
  },
  is_new: {
    type: Boolean,
    default: false
  },
  image_url: {
    type: String,
    required: true
  },
  car_type: {
    type: String,
    required: true,
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'wagon', 'van', 'truck']
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

// Виртуальное поле для средней оценки
carSchema.virtual('avg_rating').get(function() {
  return this._avg_rating || 0;
});

carSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'carId'
});

carSchema.statics.calculateAverageRating = async function(carId) {
  const reviews = await this.model('Review').find({ carId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length;
  await this.findByIdAndUpdate(carId, { $set: { avg_rating: avgRating } });
};

const Car = mongoose.model('Car', carSchema);

module.exports = Car; 