import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, LoginRequest, RegisterRequest, UserResponse } from "./types";
import { RootState } from "../../store";

// ... (keep all the existing type definitions)

export const refreshToken = createAsyncThunk<UserResponse, void, { state: RootState }>(
  "auth/refreshToken",
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth.token) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("http://localhost:4040/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: auth.token }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: UserResponse = await response.json();
    return data;
  }
);

// ... (keep any existing functions in this file)
