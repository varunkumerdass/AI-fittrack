const Activity = require('../models/Activity');

// @desc    Log new activity
// @route   POST /api/activity
exports.logActivity = async (req, res) => {
  try {
    const { activityType, duration, caloriesBurned, steps, date } = req.body;

    const activity = await Activity.create({
      user: req.user._id,
      activityType,
      duration,
      caloriesBurned,
      steps: steps || 0,
      date: date || Date.now(),
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user activities
// @route   GET /api/activity
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};