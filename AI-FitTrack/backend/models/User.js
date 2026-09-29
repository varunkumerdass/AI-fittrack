const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name']
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please enter a password']
    },
    age: { type: Number, default: null },
    height: { type: Number, default: null }, // Height in cm
    weight: { type: Number, default: null }, // Weight in kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'sedentary'
    },
    fitnessGoal: { type: String, default: 'maintain' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
