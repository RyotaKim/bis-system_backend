const mongoose = require('mongoose');

const DocumentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  requiredFields: { 
    type: [String], 
    default: [],
    enum: ['eduAttainment', 'eduCourse']
  }
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

module.exports = mongoose.model('DocumentType', DocumentTypeSchema);
