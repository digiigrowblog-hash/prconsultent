import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import notificationReducer from '../feature/notification/notificationSlice';
import referralReducer from '../feature/referral/referralSlice';
import patientReducer from '../feature/patient/patientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    referral: referralReducer,
    patient: patientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
