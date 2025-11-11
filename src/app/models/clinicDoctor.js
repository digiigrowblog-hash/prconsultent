import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const clinicDoctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Provide the username'],
  },
  phone: {
    type: String,
    required: [true, 'Provide the phone number'],
  },
  specialization: {
    type: String,
    required: [true, 'Provide the specialization'],
  },
}, { _id: false });

const ClinicDoctor = BaseUser.discriminator('clinic', clinicDoctorSchema);
export default ClinicDoctor;
