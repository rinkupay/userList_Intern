import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import react-hot-toast

// Define the structure of a user object
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// Define the structure for the user state (single user fetch)
export interface UserState {
  userDetails: User | null;
  loading: boolean;
  error: string | null;
}

// Define API URL from environment variables or constants
const baseUrl = import.meta.env.VITE_BASE_URL;

// Async thunk to fetch a single user by ID
export const fetchSingleUser = createAsyncThunk<User, number>(
  'user/fetchSingleUser',
  async (userId: number) => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/${userId}`);
      return response.data.data; // Return user data directly from the "data" field
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Async thunk to update a single user by ID
export const updateUserDetails = createAsyncThunk<User, User>(
  'user/updateUserDetails',
  async (updatedData: User) => {
    try {
      const response = await axios.patch(`${baseUrl}/api/users/${updatedData.id}`, updatedData);
      console.log(response)
      return response.data.data; // Return updated user data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Async thunk to delete a user by ID
export const deleteUser = createAsyncThunk<number, number>(
  'user/deleteUser',
  async (userId: number) => {
    try {
      await axios.delete(`${baseUrl}/api/users/${userId}`);
      return userId; // Return user ID after successful deletion
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const initialState: UserState = {
  userDetails: null,
  loading: false,
  error: null,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userDetails = action.payload; // Store fetched user details
       
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user details';
        toast.error(state.error); // Show error toast
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userDetails = action.payload; 
        toast.success('User updated successfully!'); 
       
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user details';
        toast.error(state.error); 
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.userDetails = null; // Clear user details from the store after deletion
        toast.success('User deleted successfully!'); // Show success toast
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
        toast.error(state.error); // Show error toast
      });
  },
});

export default userSlice.reducer;

// Selector to get user details from the Redux store
export const selectUserDetails = (state: any) => state.user.userDetails;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;
