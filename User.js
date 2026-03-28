const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  // Doctor-specific fields
  specialty: { type: String },
  location: { type: String },
  experience: { type: Number },
  rating: { type: Number, default: 4.5 },
  department: { type: String },
  // Patient-specific fields
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  contact: { type: String },
  status: { type: String, enum: ['Active', 'Pending', 'Discharged'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
