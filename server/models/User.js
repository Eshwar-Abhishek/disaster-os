const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  full_name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, default: 'VICTIM', uppercase: true },
  phone: { type: String },
  region: { type: String },
  is_active: { type: Boolean, default: true },
  emergency_contact: { type: String },
  blood_group: { type: String },
  location: { type: String },
  medical_conditions: { type: String },
  last_login: { type: Date }
}, { 
  timestamps: true 
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
