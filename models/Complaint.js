const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  reporterName: { type: String, required: true },
  contactNumber: { type: String },
  address: { type: String },
  complaintType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Convert timestamps to Philippine Time (UTC+8)
      if (ret.createdAt) {
        ret.createdAt = new Date(ret.createdAt.getTime() + (8 * 60 * 60 * 1000));
      }
      if (ret.updatedAt) {
        ret.updatedAt = new Date(ret.updatedAt.getTime() + (8 * 60 * 60 * 1000));
      }
      return ret;
    }
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
