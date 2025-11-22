const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleInitial: { type: String },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true },
  eduAttainment: { type: String },
  eduCourse: { type: String },
  age: { type: Number, required: true },
  maritalStatus: { type: String },
  docTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentType', required: true },
  uploadedFileId: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
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

module.exports = mongoose.model('Request', RequestSchema);
