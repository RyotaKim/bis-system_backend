const Request = require('../models/Request');
const Complaint = require('../models/Complaint');

// Generate auto-incremented reference numbers
exports.generateRequestRef = async () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Find the highest existing reference number for this month
  const latestRequest = await Request.findOne({
    ref: new RegExp(`^REQ-${year}-${month}-`)
  }).sort({ ref: -1 }).limit(1);
  
  let nextNumber = 1;
  if (latestRequest && latestRequest.ref) {
    const lastNumber = parseInt(latestRequest.ref.split('-').pop());
    nextNumber = lastNumber + 1;
  }
  
  return `REQ-${year}-${month}-${String(nextNumber).padStart(5, '0')}`;
};

exports.generateComplaintRef = async () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Find the highest existing reference number for this month
  const latestComplaint = await Complaint.findOne({
    ref: new RegExp(`^CMPL-${year}-${month}-`)
  }).sort({ ref: -1 }).limit(1);
  
  let nextNumber = 1;
  if (latestComplaint && latestComplaint.ref) {
    const lastNumber = parseInt(latestComplaint.ref.split('-').pop());
    nextNumber = lastNumber + 1;
  }
  
  return `CMPL-${year}-${month}-${String(nextNumber).padStart(5, '0')}`;
};
