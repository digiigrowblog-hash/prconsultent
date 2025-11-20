import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllNotification } from './allNotificationAPI'; 

// Notification type matching your model's minimal props you want in UI
export interface Notification {
  _id: string;
  type: 'referral' | 'referral-response' | 'info';
  message: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await getAllNotification();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch notifications');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch notifications';
      });
  },
});

export default notificationSlice.reducer;
