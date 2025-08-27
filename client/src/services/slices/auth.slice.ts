import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  data: {
    access_token: string;
  };
};

const initialState: AuthState = {
  data: {
    access_token: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.data.access_token = action.payload;
    },
  },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
