const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  reporterName: { type: String, required: true },
  contactNumber: { type: String },
  address: { type: String },
  complaintType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
