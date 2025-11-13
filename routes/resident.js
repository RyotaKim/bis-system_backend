const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { upload, uploadToGridFS } = require('../middleware/upload');

router.post('/request', upload.single('idImage'), uploadToGridFS, residentController.fileRequest);
router.get('/request/status', residentController.checkRequestStatus);
// Removed complaint route

module.exports = router;
