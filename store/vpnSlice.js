import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  server: null,
  connectedAt: null,
  ipAddress: null,
};

export const vpnSlice = createSlice({
  name: 'vpn',
  initialState,
  reducers: {
    connectVpn: (state, action) => {
      state.isConnected = true;
      state.server = action.payload.server;
      state.connectedAt = new Date().toLocaleTimeString();
      state.ipAddress = action.payload.ipAddress;
    },
    disconnectVpn: (state) => {
      state.isConnected = false;
      state.server = null;
      state.connectedAt = null;
      state.ipAddress = null;
    },
    setIpAddress: (state, action) => {
      state.ipAddress = action.payload;
    },
  },
});

export const { connectVpn, disconnectVpn, setIpAddress } = vpnSlice.actions;
export const selectVpn = (state) => state.vpn;
export default vpnSlice.reducer;
