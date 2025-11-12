const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'resident'], default: 'admin' },
  name: { type: String, required: true },
  contactNumber: { type: String }
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

module.exports = mongoose.model('User', UserSchema);
