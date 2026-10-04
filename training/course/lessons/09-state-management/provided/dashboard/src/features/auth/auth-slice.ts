import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UserDto } from './types';

export interface AuthState {
  token: string | null;
  user: UserDto | null;
}

export const initialAuthState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; user: UserDto }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setUser(state, action: PayloadAction<UserDto>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { logout, setSession, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
