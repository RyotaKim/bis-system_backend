const referenceService = require('../services/referenceService');
exports.createComplaint = async (req, res) => {
  try {
    const { reporterName, contactNumber, address, complaintType, description } = req.body;
    if (!reporterName || !complaintType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ref = await referenceService.generateComplaintRef();
    const complaint = new Complaint({
      ref,
      reporterName,
      contactNumber,
      address,
      complaintType,
      description,
      status: 'pending'
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint encoded successfully', complaint, ref });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Request = require('../models/Request');
const Complaint = require('../models/Complaint');

exports.dashboardStats = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const approvedRequests = await Request.countDocuments({ status: 'approved' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });

    res.json({
      totalRequests,
      totalComplaints,
      pendingRequests,
      resolvedComplaints,
      approvedRequests,
      rejectedRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('docTypeId').sort({ createdAt: -1 });
    
    // Add file URLs to each request
    const requestsWithUrls = requests.map(request => {
      const requestObj = request.toJSON();
      if (requestObj.uploadedFileId) {
        requestObj.idImageUrl = `/api/files/${requestObj.uploadedFileId}`;
      }
      return requestObj;
    });
    
    res.json({ requests: requestsWithUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('docTypeId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Add file URL to response
    const requestObj = request.toJSON();
    if (requestObj.uploadedFileId) {
      requestObj.idImageUrl = `/api/files/${requestObj.uploadedFileId}`;
    }
    
    res.json({ request: requestObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('docTypeId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request status updated', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Delete associated file from GridFS if exists
    if (request.uploadedFileId) {
      const { deleteFromGridFS } = require('../middleware/upload');
      try {
        await deleteFromGridFS(request.uploadedFileId);
      } catch (err) {
        console.error('Error deleting file from GridFS:', err);
        // Continue even if file deletion fails
      }
    }
    
    res.json({ message: 'Request deleted successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint status updated', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
