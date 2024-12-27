// src/slices/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
    email: string | null;
  adminId: string | null;
}

const initialState: AdminState = {
    email: null,
  adminId: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<{ email: string | null; adminId: string | null }>) => {
      state.email = action.payload.email;
      state.adminId = action.payload.adminId;
    },
    clearAdmin: (state) => {
      state.email = null;
      state.adminId = null;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
