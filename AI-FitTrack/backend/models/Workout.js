const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    exerciseName: {
      type: String,
      required: [true, 'Please enter an exercise name']
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Please enter duration in minutes']
    },
    caloriesBurned: {
      type: Number,
      required: [true, 'Please enter calories burned']
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
