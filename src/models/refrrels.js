// models/Referral.js
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  clinicDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser',      // points to BaseUser (role: 'clinic')
    required: true
  },
  clinicDoctorName: {
    type: String,
    required: true
  },
  professionalDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser',      // points to BaseUser (role: 'professional')
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'passed', 'cancelled', 'confirmed'],
    default: 'pending'
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser'
  },
  respondedAt: {
    type: Date
  }
}, { timestamps: true });

// useful index for queries (clinic/professional/status)
referralSchema.index({ clinicDoctor: 1, professionalDoctor: 1, status: 1 });

const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
export default Referral;
