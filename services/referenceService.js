const Request = require('../models/Request');
const Complaint = require('../models/Complaint');

// Generate auto-incremented reference numbers
exports.generateRequestRef = async () => {
  const count = await Request.countDocuments();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  return `REQ-${year}-${month}-${String(count + 1).padStart(5, '0')}`;
};

exports.generateComplaintRef = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  return `CMPL-${year}-${month}-${String(count + 1).padStart(5, '0')}`;
};
