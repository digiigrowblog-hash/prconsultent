import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import notificationReducer from '../feature/notification/notificationSlice';
import referralReducer from '../feature/referral/referralSlice';
import patientReducer from '../feature/patient/patientSlice';
import allPatientsReducer from '../feature/allpatients/allPatientSlice';
import allreferral from '../feature/allreferrals/allReferralSlice';
import allnotifications from '../feature/allnotifications/allNotificationSlice';
import searchByPatientReducer from '../feature/searchbypatientname/searchByPatientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    referral: referralReducer,
    patient: patientReducer,
    patients: allPatientsReducer,
    referrals: allreferral,
    notifications: allnotifications,
    patientSearch: searchByPatientReducer,


  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
