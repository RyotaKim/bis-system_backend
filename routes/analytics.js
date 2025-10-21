const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/weekly-requests', protect, adminOnly, analyticsController.getWeeklyRequestStats);
router.get('/complaint-resolution', protect, adminOnly, analyticsController.getComplaintResolutionRate);
router.get('/all', protect, adminOnly, analyticsController.getAllAnalytics);

module.exports = router;
