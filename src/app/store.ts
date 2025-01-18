import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/app/features/counter/counterSlice";
import authReducer from "@/app/features/user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  // Si solo quieres persistir el estado de 'auth', puedes usar 'whitelist':
  whitelist: ["auth"], // Opcional: solo persistir el reducer 'auth'
};

import { combineReducers } from "redux";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
