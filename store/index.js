import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import vpnReducer from './vpnSlice';

export const store = configureStore({
  reducer: {
 
    vpn: vpnReducer,  
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger],
});
