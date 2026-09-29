const Workout = require('../models/Workout');

// @desc    Log new workout
// @route   POST /api/workout
exports.logWorkout = async (req, res) => {
  try {
    const { title, exercises, date } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      title,
      exercises,
      date: date || Date.now(),
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user workouts
// @route   GET /api/workout
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};