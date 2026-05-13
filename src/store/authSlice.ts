import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  phoneNumber: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  phoneNumber: null,
};

// pretty straightforward — just tracks whether the user has verified OTP
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.phoneNumber = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.phoneNumber = null;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
