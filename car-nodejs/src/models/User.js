const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
    default: 'USER'
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Метод для генерации JWT токена
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      _id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: '24h'
    }
  );
};

// Виртуальное поле для отзывов пользователя
userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'userId'
});

// Виртуальное поле для избранных автомобилей
userSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'userId'
});

const User = mongoose.model('User', userSchema);

module.exports = User; 