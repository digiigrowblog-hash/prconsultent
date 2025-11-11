import mongoose from 'mongoose';

const options = {
  discriminatorKey: 'role', 
  timestamps: true,
};

const baseUserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Provide the full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Provide the email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Provide the password hash'],
  },
  refreshToken: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, options);

baseUserSchema.index({ email: 1 });

const BaseUser = mongoose.models.BaseUser || mongoose.model('BaseUser', baseUserSchema);
export default BaseUser;
