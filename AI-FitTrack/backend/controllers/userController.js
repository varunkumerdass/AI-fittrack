const User = require('../models/User');

// Helper function to calculate BMI & Calorie Target
const calculateMetrics = (weight, height, age, activityLevel) => {
  let bmi = 0;
  if (weight > 0 && height > 0) {
    const heightInMeters = height / 100;
    bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  let bmr = 10 * (weight || 60) + 6.25 * (height || 170) - 5 * (age || 25) + 5;
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const dailyCalories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
  return { bmi, dailyCalories };
};

// @desc    Get user profile
// @route   GET /api/user/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const metrics = calculateMetrics(user.weight, user.height, user.age, user.activityLevel);

    res.status(200).json({
      ...user.toObject(),
      ...metrics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      user.activityLevel = req.body.activityLevel || user.activityLevel;
      user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;

      const updatedUser = await user.save();
      const metrics = calculateMetrics(
        updatedUser.weight,
        updatedUser.height,
        updatedUser.age,
        updatedUser.activityLevel
      );

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        activityLevel: updatedUser.activityLevel,
        fitnessGoal: updatedUser.fitnessGoal,
        ...metrics,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};