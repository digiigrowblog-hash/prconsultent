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

// Note: Do NOT set _id: false for discriminators with own data
const ProfessionalDoctor = BaseUser.discriminator('professionaldoctor', professionalDoctorSchema);
export default ProfessionalDoctor;
