import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchByPatientAPI } from './searchByPatientAPI'; 

export interface Patient {
  name: string;
  age: number;
  disease: string;
  clinicDoctorName: string;
  phone: string;
  isVisited: boolean;
  summary: string;
}

interface PatientSearchState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientSearchState = {
  patients: [],
  loading: false,
  error: null,
};

// Async thunk to search patients by name
export const searchPatients = createAsyncThunk<
  Patient[],
  string,
  { rejectValue: string }
>('patients/searchByName', async (name, { rejectWithValue }) => {
  try {
    const patients = await searchByPatientAPI(name);
    return patients;
  } catch (error: any) {
    if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || 'Failed to search patients');
  }
});

const patientSearchSlice = createSlice({
  name: 'patientSearch',
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.patients = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to search patients';
      });
  },
});

export const { clearSearchResults } = patientSearchSlice.actions;
export default patientSearchSlice.reducer;
