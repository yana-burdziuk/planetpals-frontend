import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null, isAuthenticated : false, photos : []},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
          state.username = action.payload;
          state.isAuthenticated = true;
    },
    //stocker les photos ici au cas ou on en a besoin ailleurs dans l'app
    addUserPhoto: (state, action) => {
  state.value.photos.push(action.payload)
}
  },
});

export const { loginSuccess, addUserPhoto } = userSlice.actions;
export default userSlice.reducer;
