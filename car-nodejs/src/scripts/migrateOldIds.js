const mongoose = require('mongoose');
const Car = require('../models/Car');

async function migrateOldIds() {
  try {
    // Подключаемся к базе данных
    await mongoose.connect('mongodb://localhost:27017/cars', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Получаем все автомобили без oldId
    const cars = await Car.find({ oldId: { $exists: false } });
    console.log(`Found ${cars.length} cars without oldId`);

    // Находим максимальный существующий oldId
    const maxOldId = await Car.findOne({}, { oldId: 1 })
      .sort({ oldId: -1 });
    
    let nextId = maxOldId ? (maxOldId.oldId + 1) : 1;

    // Обновляем каждый автомобиль
    for (const car of cars) {
      car.oldId = nextId++;
      await car.save();
      console.log(`Updated car ${car._id} with oldId ${car.oldId}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateOldIds(); 