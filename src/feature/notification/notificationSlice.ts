"use client";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getNotifications, markNotificationRead } from './notificationAPI';
import type { Notification } from '@/type';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  selectedNotificationId: string | null;
}
 
const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  selectedNotificationId: null,
};

export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await getNotifications();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch notifications');
    }
  }
);

export const markReadNotification = createAsyncThunk<Notification, string, { rejectValue: string }>(
  'notification/markReadNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      return await markNotificationRead(notificationId);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to mark notification as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    selectNotification(state, action: PayloadAction<string | null>) {
      state.selectedNotificationId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
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
      })
      .addCase(markReadNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReadNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index >= 0) {
          state.notifications[index].read = true;
        }
      })
      .addCase(markReadNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to mark notification as read';
      });
  },
});

export const { selectNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
