import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./reducers/todoSlice.js";

export const store = configureStore({
  reducer: todoReducer,
});
