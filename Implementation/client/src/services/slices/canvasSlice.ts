import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CanvasState = {
  canvasWidth: number;
  canvasHeight: number;
};

const initialState: CanvasState = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  // canvasWidth: 800,
  // canvasHeight: 600,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    updateCanvasSize: (state, action: PayloadAction<CanvasState>) => {
      state.canvasWidth = action.payload.canvasWidth;
      state.canvasHeight = action.payload.canvasHeight;
    },
  },
});

export const { updateCanvasSize } = canvasSlice.actions;

export default canvasSlice.reducer;
