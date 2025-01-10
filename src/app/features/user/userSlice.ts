import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authActions";
// import type { PayloadAction } from "@reduxjs/toolkit";

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
  reducers: {},
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
          state.loading = false;
          state.userInfo = action.payload;
          state.token = action.payload.userToken;
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
export default authSlice.reducer;
