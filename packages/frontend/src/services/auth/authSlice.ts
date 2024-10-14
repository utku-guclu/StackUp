import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  UserResponse,
  LoginRequest,
  LogOutResponse,
  AuthState,
  RegisterResponse,
  RegisterRequest,
} from "./types";
import type { RootState } from "../../store";

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  await dispatch(authBlogApi.endpoints.logout.initiate());
});

// Create the API service
export const authBlogApi = createApi({
  baseQuery: fetchBaseQuery({
    // Replace your address here if needed i.e. your forwarded address from a cloud environment
    baseUrl: "http://localhost:4040/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // Include credentials for CORS
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<LogOutResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (info) => ({
        url: "auth/register",
        method: "POST",
        body: info,
      }),
    }),
  }),
});

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  } as AuthState,
  reducers: {
    refreshAuthentication: (state) => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") {
        const userSession = sessionStorage.getItem("user");
        const response: UserResponse = JSON.parse(
          userSession as string,
        ) as UserResponse;
        state.token = response.token;
        state.user = {
          username: response.username,
          id: response.userId,
          email: response.email,
          role: response.role,
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authBlogApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        };
        // Set session storage
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify(payload));
        // Set cookie (this won't actually set the cookie, but it's a hint for the server)
        document.cookie = "advanced-state-management-user=true; path=/; secure; samesite=strict";
      },
    );
    builder.addMatcher(authBlogApi.endpoints.logout.matchFulfilled, (state) => {
      state.token = null;
      state.user = null;
      // Clear session storage
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("user");
      // Clear cookie (this won't actually clear the cookie, but it's a hint for the server)
      document.cookie = "advanced-state-management-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return state;
    });
  },
});

export default authSlice.reducer;

export const { refreshAuthentication } = authSlice.actions;
// Export the hooks from the API
export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authBlogApi;
// The logout function is already exported at the top of the file, so we don't need to export it again here.
