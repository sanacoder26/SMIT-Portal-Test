import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import studentReducer from './slices/studentSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    students: studentReducer,
    leaves: leaveReducer,
  },
});
