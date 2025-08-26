import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  email: null,
  token: null,
  isAuthenticated: false,
  photos: [],
  currentPoints: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.currentPoints = action.payload.currentPoints;
      state.isAuthenticated = true;
    },
    //stocker les photos ici au cas ou on en a besoin ailleurs dans l'app
    addUserPhoto: (state, action) => {
      state.photos.push(action.payload);
    },
    addPoints: (state, action) => {
      state.currentPoints += action.payload;
      },
    logout: (state, action) => {
      return initialState; // reset complet au logout
    },
  },
});

export const { loginSuccess, addUserPhoto, addPoints, logout } = userSlice.actions;
export default userSlice.reducer;
