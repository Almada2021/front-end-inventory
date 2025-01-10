import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface LoginRequest {
  email?: string;
  password?: string;
}
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email = "", password = "" }: LoginRequest, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password },
        config
      );
      // store user's token in local storage
      localStorage.setItem("token", data.token);
      return data;
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue((error as Error).message);
      }
    }
  }
);
