import { createSlice } from "@reduxjs/toolkit";
import { createProviders } from "./supplierActions";

export interface SupplierInfo {
  name: string;
  sellerName: string;
  phoneNumber: string;
  id?: string;
  sheet?: string;
  productsIds?: string[];
  orders?: string[];
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
      .addCase(createProviders.fulfilled, (state: SupplierState, action) => {
        if (action.payload) {
          state.suppliers.push(action.payload);
        }
        return state;
      })
      .addCase(createProviders.rejected, (state: SupplierState) => {
        return state;
      });
  },
});

export const { resetSuppliers } = supplierSlice.actions;
export default supplierSlice.reducer;
