const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    steps: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 }, // in Liters or ml
    sleepHours: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
