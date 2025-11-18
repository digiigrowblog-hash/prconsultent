import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser',
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser',
  },
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
  },
  type: {
    type: String,
    enum: ['referral', 'referral-response', 'info'],
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
  patientInfo: {
    name: { type: String, default: '' },
    age: { type: Number },
    disease: { type: String, default: '' },
    phone: { type: String, default: '' },
    // Add other patient fields as necessary
  },
}, { timestamps: true });

notificationSchema.index({ to: 1, read: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
