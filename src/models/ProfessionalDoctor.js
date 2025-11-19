import BaseUser from './baseUser.js';
import mongoose from 'mongoose';

const professionalDoctorSchema = new mongoose.Schema({
  phone: {
    type: String,
    
  },
  specialization: {
    type: String,
    
  },
  experience: {
    type: Number,
    default: null,
  },
});

// Note: Do NOT set _id: false for discriminators with own data
const ProfessionalDoctor = BaseUser.discriminator('professionaldoctor', professionalDoctorSchema);
export default ProfessionalDoctor;
