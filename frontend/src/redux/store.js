import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/admin.slice.js";

export default configureStore({
  reducer: {
    admin: adminReducer,
  },
});
