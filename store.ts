import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/redux/authentocation/authentication"; 
import userSlice from "./src/redux/fetchUsers/fetchUsers";
import userDetailsSlice from "./src/redux/fetchSingleUser/fetchSingleUser"

const store = configureStore({
  reducer: {
    auth: authReducer,
    users:userSlice,
    user:userDetailsSlice,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
