// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlices';

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export default store;
