const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true },
  eduAttainment: { type: String },
  eduCourse: { type: String },
  age: { type: Number, required: true },
  maritalStatus: { type: String },
  docTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentType', required: true },
  uploadedFileId: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
