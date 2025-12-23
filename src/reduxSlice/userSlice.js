import { createSlice } from "@reduxjs/toolkit";

export const USER_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
});

const createInitialState = () => ({
  user: null,
  status: USER_STATUS.IDLE,
});

const userSlice = createSlice({
  name: "user",
  initialState : createInitialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload ?? null;
      state.status = action.payload ? USER_STATUS.READY : USER_STATUS.IDLE
    },
    updateUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
    clearUser: createInitialState()
  },
});

export const { 
  setUser, 
  updateUser,
  setUserStatus,
  clearUser 
} = userSlice.actions;
export default userSlice.reducer;
