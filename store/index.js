// store/index.js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // Import the logger middleware
import useReducer from './useReducer';

export const store = configureStore({
  reducer: {
    user: useReducer, // Use the correct reducer import
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger], // Include logger middleware
});

export default store;
