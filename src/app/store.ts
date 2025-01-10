import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/app/features/counter/counterSlice";
import authReducer from "@/app/features/user/userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
