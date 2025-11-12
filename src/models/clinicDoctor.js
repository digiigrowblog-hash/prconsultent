import mongoose from 'mongoose';
import BaseUser from './baseUser.js';

const clinicDoctorSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, default: null },
});

// Check if discriminator already exists, else create
const ClinicDoctor = mongoose.models.ClinicDoctor || BaseUser.discriminator('clinicdoctor', clinicDoctorSchema);

export default ClinicDoctor;
