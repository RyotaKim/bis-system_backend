const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

router.post('/request', residentController.fileRequest);
router.get('/request/status', residentController.checkRequestStatus);
// Removed complaint route

module.exports = router;
