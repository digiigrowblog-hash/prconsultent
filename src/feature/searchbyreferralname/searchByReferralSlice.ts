import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchReferralsByNameAPI } from "./searchByReferralAPI"; // adjust path

export interface Referral {
  // add your referral fields here, example:
  _id: string;
  patientName: string;
  doctorName?: string;
  referralDate?: string;
  // etc.
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

export const searchReferralsByName = createAsyncThunk<
  Referral[],
  string,
  { rejectValue: string }
>("referrals/searchByName", async (name, { rejectWithValue }) => {
  try {
    const referrals = await searchReferralsByNameAPI(name);
    return referrals;
  } catch (error: any) {
    if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to fetch referrals");
  }
});

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    clearReferrals(state) {
      state.referrals = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchReferralsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchReferralsByName.fulfilled,
        (state, action: PayloadAction<Referral[]>) => {
          state.loading = false;
          state.referrals = action.payload;
        }
      )
      .addCase(searchReferralsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch referrals";
      });
  },
});

export const { clearReferrals } = referralSlice.actions;
export default referralSlice.reducer;
