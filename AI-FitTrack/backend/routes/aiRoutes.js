const express = require('express');
const router = express.Router();
const { getAIRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getAIRecommendations);

module.exports = router;