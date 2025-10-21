const Request = require('../models/Request');
const referenceService = require('../services/referenceService');
const DocumentType = require('../models/DocumentType');
const referenceService = require('../services/referenceService');

exports.fileRequest = async (req, res) => {
  try {
    const { fullName, contactNumber, address, purpose, eduAttainment, eduCourse, age, maritalStatus, docTypeId } = req.body;

    if (!fullName || !contactNumber || !address || !purpose || !age || !docTypeId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const docType = await DocumentType.findById(docTypeId);
    if (!docType) {
      return res.status(404).json({ message: 'Document type not found' });
    }

    const ref = await referenceService.generateRequestRef();
    const request = new Request({
      ref,
      fullName,
      contactNumber,
      address,
      purpose,
      eduAttainment,
      eduCourse,
      age,
      maritalStatus,
      docTypeId,
      uploadedFileId: req.file?.id || null,
      status: 'pending'
    });

    await request.save();
    res.status(201).json({ message: 'Request filed successfully', request, ref });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkRequestStatus = async (req, res) => {
  try {
    const { ref } = req.query;

    if (!ref) {
      return res.status(400).json({ message: 'Reference number required' });
    }

    const request = await Request.findOne({ ref }).populate('docTypeId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Removed fileComplaint export
