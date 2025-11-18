import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientAPI, Patient, CreatePatientBody } from './patientAPI';

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

// Async thunk for creating patient
export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: CreatePatientBody, { rejectWithValue }) => {
    try {
      const response = await patientAPI.createPatient(patientData);
      return response.patient;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create patient');
    }
  }
);

// Async thunk for fetching patients
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientAPI.fetchPatients();
      return response.patients;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch patients');
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createPatient cases
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patients.unshift(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchPatients cases
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default patientSlice.reducer;
