import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createReferral,
  getReferrals,
  updateReferralStatus,
} from './referralAPI';
import type { Referral } from '@/type';

interface ReferralState {
  referrals: Referral[];
  loading: boolean;
  error: string | null;
  selectedReferralId: string | null;
}

const initialState: ReferralState = {
  referrals: [],
  loading: false,
  error: null, 
  selectedReferralId: null,
};

export const fetchReferrals = createAsyncThunk<Referral[], void, { rejectValue: string }>(
  'referral/fetchReferrals',
  async (_, { rejectWithValue }) => {
    try {
      return await getReferrals();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch referrals');
    }
  }
);

export const addReferral = createAsyncThunk<Referral, { patientId: string; professionalDoctorId: string }, { rejectValue: string }>(
  'referral/addReferral',
  async (payload, { rejectWithValue }) => {
    try {
      return await createReferral(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create referral');
    }
  }
);

export const updateReferral = createAsyncThunk<Referral, { referralId: string; status: 'passed' | 'cancelled' | 'confirmed'; message?: string }, { rejectValue: string }>(
  'referral/updateReferral',
  async (payload, { rejectWithValue }) => {
    try {
      return await updateReferralStatus(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update referral');
    }
  }
);

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    selectReferral(state, action: PayloadAction<string | null>) {
      state.selectedReferralId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
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
        state.error = action.payload ?? 'Failed to fetch referrals';
      })
      .addCase(addReferral.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals.push(action.payload);
      })
      .addCase(addReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create referral';
      })
      .addCase(updateReferral.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReferral.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.referrals.findIndex(r => r._id === action.payload._id);
        if(index >= 0) {
          state.referrals[index] = action.payload;
        }
      })
      .addCase(updateReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update referral';
      });
  },
});

export const { selectReferral, clearError } = referralSlice.actions;
export default referralSlice.reducer;
