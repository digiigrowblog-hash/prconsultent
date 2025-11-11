// models/ProfessionalDoctor.js
import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const professionalDoctorSchema = new mongoose.Schema({
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
  },
});

// Do NOT set _id: false for discriminators
const ProfessionalDoctor = BaseUser.discriminator('professional', professionalDoctorSchema);
export default ProfessionalDoctor;
