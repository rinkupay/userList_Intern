// usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';





// types.ts
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }
  


  interface UsersApiResponse {
    data: User[];
    total: number;
    total_pages: number;
  }
  const baseUrl = import.meta.env.VITE_BASE_URL;

/// Async thunk to fetch users from an API using axios, with a page parameter
export const fetchUsers = createAsyncThunk<UsersApiResponse, number>(
  'users/fetchUsers',
  async (page: number) => {
    try {
      const response = await axios.get(`${baseUrl}/api/users`, {
        params: { page }, // Dynamically pass the page number as a query parameter
      });

      // Destructure the response to match the expected format
      const { data, total, total_pages } = response.data;

      return { data, total, total_pages }; // Return full response data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);
// Define the initial state
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
};
// Create the slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersApiResponse>) => {
        state.loading = false;
        state.users = action.payload.data; // Store users for the current page
        state.total = action.payload.total; // Store the total number of users
        state.totalPages = action.payload.total_pages; // Store the total number of pages
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;