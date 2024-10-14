import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (
    userData: { username: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post("/api/users", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
