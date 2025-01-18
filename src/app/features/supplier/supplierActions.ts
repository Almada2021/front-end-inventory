import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface CreateSupplierDto {
  name: string;
  sellerName: string;
  phoneNumber: string;
}

export const createProviders = createAsyncThunk(
  "providers/create",
  async ({ name, sellerName, phoneNumber }: CreateSupplierDto) => {
    try {
      const config = {
        headers: {
          "Content-Type": "appication/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/providers/create`,
        { name, sellerName, phoneNumber, sheet: name },
        config
      );
      if (data) {
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        console.log(error.name);
        return false;
      }
    }
  }
);
