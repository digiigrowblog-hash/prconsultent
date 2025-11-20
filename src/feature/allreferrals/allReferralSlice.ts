import {getAllReferrals} from './allReferralAPI'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Referral {
  _id: string;
  clinicDoctor: string; // or object, depending on your API response
  clinicDoctorName: string;
  professionalDoctor: string; // or object
  patient: string; // or object
  status: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReferralState {
  referrals: Referral[];
  loading: boolean;
  error: string | null;
}

const initialState: ReferralState = {
  referrals: [],
  loading: false,
  error: null,
};

// Async thunk to fetch referrals
export const fetchReferrals = createAsyncThunk('referrals/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await getAllReferrals();
    return data;
  } catch (error) {
    // Handle error
    throw error;
  }
});

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch referrals';
      });
  },
});

export default referralSlice.reducer;
