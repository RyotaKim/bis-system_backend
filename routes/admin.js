router.post('/complaints', protect, adminOnly, adminController.createComplaint);
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, adminController.dashboardStats);

// Request management
router.get('/requests', protect, adminOnly, adminController.getAllRequests);
router.get('/requests/:id', protect, adminOnly, adminController.getRequestById);
router.put('/requests/:id/status', protect, adminOnly, adminController.updateRequestStatus);
router.delete('/requests/:id', protect, adminOnly, adminController.deleteRequest);

// Complaint management
router.get('/complaints', protect, adminOnly, adminController.getAllComplaints);
router.get('/complaints/:id', protect, adminOnly, adminController.getComplaintById);
router.put('/complaints/:id/status', protect, adminOnly, adminController.updateComplaintStatus);
router.delete('/complaints/:id', protect, adminOnly, adminController.deleteComplaint);

module.exports = router;
