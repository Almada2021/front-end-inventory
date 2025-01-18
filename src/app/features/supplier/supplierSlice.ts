import { createSlice } from "@reduxjs/toolkit";
import { createProviders } from "./supplierActions";

export interface SupplierInfo {
  name: string;
  sellerName: string;
  phoneNumber: string;
}

export interface SupplierState {
  suppliers: SupplierInfo[];
}

const initialState: SupplierState = {
  suppliers: [],
};

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    resetSuppliers: (state: SupplierState) => {
      state.suppliers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProviders.pending, (state: SupplierState) => {
        console.log(state);
      })
      .addCase(createProviders.fulfilled, () => {})
      .addCase(createProviders.rejected, () => {});
  },
});

export const { resetSuppliers } = supplierSlice.actions;
export default supplierSlice.reducer;
