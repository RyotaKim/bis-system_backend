const express = require('express');
const router = express.Router();
const DocumentType = require('../models/DocumentType');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const docTypes = await DocumentType.find();
    res.json({ docTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const docType = new DocumentType({ name, description });
    await docType.save();
    res.status(201).json({ message: 'Document type created', docType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
