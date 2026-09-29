const express = require('express');
const router = express.Router();
const { logWorkout, getWorkouts } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, logWorkout)
  .get(protect, getWorkouts);

module.exports = router;