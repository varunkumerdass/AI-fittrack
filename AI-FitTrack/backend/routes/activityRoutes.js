const express = require('express');
const router = express.Router();
const { logActivity, getActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, logActivity)
  .get(protect, getActivities);

module.exports = router;