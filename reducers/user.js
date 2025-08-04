import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null, isAuthenticated : false },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
          state.username = action.payload;
          state.isAuthenticated = true;
    },

  },
});

export const { loginSuccess } = userSlice.actions;
export default userSlice.reducer;
