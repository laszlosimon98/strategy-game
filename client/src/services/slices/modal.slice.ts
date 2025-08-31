import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalState = {
  isModalVisible: boolean;
};

const initialState: ModalState = {
  isModalVisible: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.isModalVisible = action.payload;
    },
  },
});

export const { setModalVisibility } = modalSlice.actions;

export default modalSlice.reducer;
