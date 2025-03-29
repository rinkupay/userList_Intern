import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast"; 

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

const baseUrl = import.meta.env.VITE_BASE_URL;

// 🔹 Get token from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// 🔹 Check if the user is logged in by looking at localStorage
const getIsLoggedIn = () => {
  return !!getTokenFromLocalStorage();
};

// 🔹 Initial State
const initialState: AuthState = {
  user: null,
  loading: false,
  isLoggedIn: getIsLoggedIn(),
  error: null,
};

// Fetch user on page reload
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axios.get<User>(`${baseUrl}/api/v1/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ token: string; user: User }>(`${baseUrl}/api/login`, loginData);
    // Store the token in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("isLoggedIn", "true");
    
    toast.success("Logged in successfully!"); // Success toast for login
    return response.data.user;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Invalid email or password"); // Error toast for login failure
    return rejectWithValue(error.response?.data?.message || "Invalid email or password");
  }
});

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${baseUrl}/api/v1/logout`);
    // Clear the token and login state from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    
    toast.success("Logged out successfully!"); // Success toast for logout
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Logout failed"); // Error toast for logout failure
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
  return null;
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
