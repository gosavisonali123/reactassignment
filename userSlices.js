
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  users: [],
  loading: false,
  hasMore: true,
  sort: { key: 'id', order: 'asc' },
  filter: { gender: '', country: '' },
};

// Create async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ skip, limit }, { getState }) => {
    const response = await axios.get('https://dummyjson.com/users', {
      params: { skip, limit }
    });
    return response.data;
  }
);

// Create slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [...state.users, ...action.payload.users];
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSort, setFilter } = userSlice.actions;
export default userSlice.reducer;
