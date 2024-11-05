import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './signIn.slice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    email: emailReducer,
    auth: authReducer,
  },
});
