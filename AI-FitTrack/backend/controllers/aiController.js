const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get AI-generated fitness & nutrition recommendations
// @route   GET /api/ai/recommendations
exports.getAIRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recentActivities = await Activity.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    // Calculate basic metrics for tailored feedback
    const heightMeters = user.height ? user.height / 100 : 1.7;
    const weight = user.weight || 70;
    const bmi = parseFloat((weight / (heightMeters * heightMeters)).toFixed(1));

    // Dynamic AI Rules Engine
    let workoutAdvice = '';
    let dietAdvice = '';

    if (user.fitnessGoal === 'Weight Loss') {
      workoutAdvice = 'Focus on 150 minutes of moderate cardio (running, cycling) per week paired with full-body HIIT routines twice a week.';
      dietAdvice = 'Aim for a 300-500 kcal deficit. Prioritize high-protein foods (lean meats, legumes) and high-fiber vegetables.';
    } else if (user.fitnessGoal === 'Muscle Gain') {
      workoutAdvice = 'Prioritize progressive resistance training 4 days a week with a split focused on compound movements (squats, bench press, deadlifts).';
      dietAdvice = 'Aim for a 250-400 kcal surplus with 1.6-2.0g of protein per kg of body weight daily.';
    } else {
      workoutAdvice = 'Maintain a balanced routine: 3 days of moderate resistance training and 2 days of low-impact cardio or mobility work.';
      dietAdvice = 'Maintain balanced macronutrients: 50% complex carbs, 30% lean protein, and 20% healthy fats.';
    }

    res.status(200).json({
      userGoal: user.fitnessGoal || 'Maintain Weight',
      currentBMI: bmi,
      recentActivityCount: recentActivities.length,
      recommendations: {
        workoutPlan: workoutAdvice,
        nutritionStrategy: dietAdvice,
        dailyWaterTargetLiters: Math.round((weight * 0.033) * 10) / 10,
        suggestedRestDays: '2 days per week for optimal recovery',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};