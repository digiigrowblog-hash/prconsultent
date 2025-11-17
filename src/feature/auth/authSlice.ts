import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import {
  signupAPI,
  loginAPI,
  logoutAPI,
  fetchProfileAPI,
  updateProfileAPI,
  User,
  getAllProfilesAPI,
} from './authAPI';

interface AuthState {
  user: User | null;
  userList: User[];          // New state for storing all profiles
  loading: boolean;
  loadingProfiles: boolean;  // separate loading state for getAllProfiles
  error: string | null;
  profilesError: string | null; // separate error for getAllProfiles
}

const initialState: AuthState = {
  user: null,
  userList: [],
  loading: false,
  loadingProfiles: false,
  error: null,
  profilesError: null,
};

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error occurred';
}

export const signup = createAsyncThunk<User, Parameters<typeof signupAPI>[0], { rejectValue: string }>(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      return await signupAPI(data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk<User, Parameters<typeof loginAPI>[0], { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const user = await loginAPI(data);
      console.log('Login user:', user);
      return user; // should be profile object
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
;

export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
  await logoutAPI();
});

export const fetchProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProfileAPI();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProfile = createAsyncThunk<User, Parameters<typeof updateProfileAPI>[0], { rejectValue: string }>(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await updateProfileAPI(data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllProfiles = createAsyncThunk<User[], void, { rejectValue: string }>(
  'auth/getAllProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const profiles = await getAllProfilesAPI();
      return profiles;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || error.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      state.profilesError = null;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Signup failed';
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Fetching profile failed';
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Update profile failed';
      })
      .addCase(getAllProfiles.pending, (state) => {
        state.loadingProfiles = true;
        state.profilesError = null;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.loadingProfiles = false;
        state.userList = action.payload;
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.loadingProfiles = false;
        state.profilesError = action.payload ?? 'Failed to fetch profiles';
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
