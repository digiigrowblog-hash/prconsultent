import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const clinicDoctorSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Provide the phone number'],
  },
  specialization: {
    type: String,
    required: [true, 'Provide the specialization'],
  },
  experience: {
    type: Number,
    default: 0,
  }
}, { _id: false });

const ClinicDoctor = BaseUser.discriminator('clinicdoctor', clinicDoctorSchema);
export default ClinicDoctor;
