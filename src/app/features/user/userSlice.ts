import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: string | undefined;
}
const initialState: UserState = {
  user: undefined,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});
