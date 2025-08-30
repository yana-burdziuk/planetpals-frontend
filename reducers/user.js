import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  email: null,
  token: null,
  isAuthenticated: false,
  photos: [],
  currentPoints: 0,
  currentCO2: 0,
  departmentId: null,
  // stats département (sinon trop de fetch à faire)
  departmentStats: {
    totalPoints: 0,
    totalCO2: 0,
    name: "",
  },
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
      state.departmentId = action.payload.departmentId;
      state.departmentStats.name = action.payload.deptName;
      state.isAuthenticated = true;
    },
    // on met à jour les points après validation/annulation - partie globale et user
    updatePoints: (state, action) => {
      state.currentPoints = action.payload.userPoints;
      state.currentCO2 = action.payload.userCO2;
      state.departmentStats.totalPoints = action.payload.deptPoints;
      state.departmentStats.totalCO2 = action.payload.deptCO2;
    },

    // on met à jour les stats du dept - partie depts, utile pour /users/team ou /department-stats
    updateDepartmentStats: (state, action) => {
      state.departmentStats.totalPoints = action.payload.totalPoints;
      state.departmentStats.totalCO2 = action.payload.totalCO2;
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

export const {
  loginSuccess,
  addUserPhoto,
  addPoints,
  updatePoints,
  updateDepartmentStats,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
