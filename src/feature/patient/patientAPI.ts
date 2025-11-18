import axios from 'axios';

const API_BASE_URL = '/api/patients'; // Adjust this base URL to your API route path if different

export interface CreatePatientBody {
  patientName: string;
  age: number;
  disease: string;
  summary?: string;
  image?: string;
  phone?: string;
  appointmentDate?: string;
  referredDoctorName?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  disease: string;
  summary?: string;
  image?: string;
  isVisited?: boolean;
  clinicDoctorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const patientAPI = {
  createPatient: async (data: CreatePatientBody) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  },

  fetchPatients: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },
};
