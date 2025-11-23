import {fetchPatients} from './allParientAPI'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export interface Patient {
  _id: string;
  clinicDoctorId: string;
  clinicDoctorName: string;
  name: string;
  age: number;
  summary?: string;
  phone?: string;
  disease: string;
  image?: string;
  isVisited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
};

// Async thunk action to fetch patients
export const getPatients = createAsyncThunk('patients/getPatients', async () => {
  const patients = await fetchPatients();
  return patients;
});

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      });
  },
});

export default patientSlice.reducer;
