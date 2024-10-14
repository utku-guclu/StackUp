import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit"; // Correct the import
import type {
	UserResponse,
	LoginRequest,
	LogOutResponse,
	AuthState,
	RegisterResponse,
	RegisterRequest,
} from "./types";
import type { RootState } from "../../store";

// Create the API service
export const authBlogApi = createApi({
	baseQuery: fetchBaseQuery({
    	// Replace your address here if needed i.e. your forwarded address from a cloud environment
    	baseUrl: "http://127.0.0.1:4040/api/",
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
	reducers: {},
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
        	}
    	);
    	builder.addMatcher(authBlogApi.endpoints.logout.matchFulfilled, (state) => {
        	state.token = null;
        	state.user = null;
    	});
	},
});

export default authSlice.reducer;

// Export the hooks from the API
export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
} = authBlogApi;
