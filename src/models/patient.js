import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  clinicDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                      // <-- use 'User' (or 'BaseUser') if you used discriminators
    required: [true, 'Clinic doctor id is required']
  },
  clinicDoctorName: {
    type: String,
    required: [true, 'Clinic doctor name is required']
  },
  name: {
    type: String,
    required: [true, 'Provide the name of the patient']
  },
  age: {
    type: Number,
    required: [true, 'Provide the age']
  },
  summary: {
    type: String,
    default: ''
  },
  disease: {
    type: String,
    required: [true, 'Provide the disease']
  },
  image: {
    type: String,
    default: ''
  },
  isVisited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

patientSchema.index({ clinicDoctorId: 1 });

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
export default Patient;
