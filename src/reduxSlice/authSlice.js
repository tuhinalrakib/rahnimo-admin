import { createSlice } from "@reduxjs/toolkit";

export const AUTH_STATUS = Object.freeze({
  IDLE: "idle",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOADING: "loading",
})

const createInitialState = () => ({
  accessToken: null,
  status: AUTH_STATUS.IDLE,
});

const authSlice = createSlice({
  name: "auth",
  initialState : createInitialState(),
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload ?? null
      state.status = action.payload ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.status = AUTH_STATUS.IDLE;
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setAccessToken, clearAuth, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
