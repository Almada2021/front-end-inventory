import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authActions";
// import type { PayloadAction } from "@reduxjs/toolkit";
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

console.log(userToken ? "Logged" : "unlogged");
export interface UserInfo {
  id: string;
  email: string;
  name: string;
}
export interface UserState {
  loading: boolean;
  userInfo: UserInfo | undefined;
  token: string | null;
  error: string | null;
  success: boolean;
}
const initialState: UserState = {
  loading: false,
  userInfo: undefined, // for user object
  token: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};
export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state: UserState) => {
      state.userInfo = undefined;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        userLogin.fulfilled,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: UserState, action: { payload: any }) => {
          console.log(action);
          state.loading = false;
          state.userInfo = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(
        userLogin.rejected,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: UserState, action: { payload: any }) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export const { signOut } = authSlice.actions;
export default authSlice.reducer;
