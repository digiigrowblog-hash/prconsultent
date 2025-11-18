import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  clinicDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaseUser',
    required: [true, 'Clinic doctor id is required'],
  },
  clinicDoctorName: {
    type: String,
    required: [true, 'Clinic doctor name is required'],
  },
  name: {
    type: String,
    required: [true, 'Provide the name of the patient'],
  },
  age: {
    type: Number,
    required: [true, 'Provide the age'],
  },
  summary: {
    type: String,
    default: '',
  },
  phone:{
    type: String,
  },
  disease: {
    type: String,
    required: [true, 'Provide the disease'],
  },
  image: {
    type: String,
    default: '',  // store URL or base64 string of image
  },
  isVisited: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

patientSchema.index({ clinicDoctorId: 1 });

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
export default Patient;
