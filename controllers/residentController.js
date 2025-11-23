const Request = require('../models/Request');
const DocumentType = require('../models/DocumentType');
const referenceService = require('../services/referenceService');

exports.fileRequest = async (req, res) => {
  try {
    const { lastName, firstName, middleInitial, contactNumber, address, purpose, eduAttainment, eduCourse, age, maritalStatus, docTypeId } = req.body;

    if (!lastName || !firstName || !contactNumber || !address || !purpose || !age || !docTypeId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate if file was uploaded
    if (!req.file || !req.file.id) {
      return res.status(400).json({ message: 'ID image is required' });
    }

    const docType = await DocumentType.findById(docTypeId);
    if (!docType) {
      return res.status(404).json({ message: 'Document type not found' });
    }

    // Validate education fields if required by document type
    if (docType.requiredFields && docType.requiredFields.length > 0) {
      if (docType.requiredFields.includes('eduAttainment') && !eduAttainment) {
        return res.status(400).json({ 
          message: `Educational Attainment is required for ${docType.name}` 
        });
      }
      if (docType.requiredFields.includes('eduCourse') && !eduCourse) {
        return res.status(400).json({ 
          message: `Educational Course is required for ${docType.name}` 
        });
      }
    }

    const ref = await referenceService.generateRequestRef();
    const request = new Request({
      ref,
      lastName,
      firstName,
      middleInitial,
      contactNumber,
      address,
      purpose,
      eduAttainment,
      eduCourse,
      age,
      maritalStatus,
      docTypeId,
      uploadedFileId: req.file.id,
      status: 'pending'
    });

    await request.save();
    
    // Include file URL in response
    const fileUrl = `/api/files/${req.file.id}`;
    res.status(201).json({ 
      message: 'Request filed successfully', 
      request: { ...request.toJSON(), idImageUrl: fileUrl }, 
      ref 
    });
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
