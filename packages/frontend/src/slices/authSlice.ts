import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { username: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        userData,
      );
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    userData: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        userData,
      );
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
