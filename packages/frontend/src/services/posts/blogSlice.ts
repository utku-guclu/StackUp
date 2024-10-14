import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	ProductCreateRequest,
	ProductDeleteRequest,
	ProductModel,
	ProductResponse,
	ProductUpdateRequest,
} from "./types";
import type { RootState } from "../../store";
import type { ErrorResponse } from "../error-types";

export const productApi = createApi({
	reducerPath: "productApi",
	baseQuery: fetchBaseQuery({
    	baseUrl: "http://localhost:4040/api/",
    	prepareHeaders: (headers, { getState }) => {
        	const token = (getState() as RootState).auth.token;
        	if (token) {
            	headers.set("Authorization", `Bearer ${token}`);
        	}
        	return headers;
    	},
    	credentials: "include",
	}),
	tagTypes: ["ProductModel"],
	refetchOnFocus: true,
	refetchOnReconnect: true,
	endpoints: (builder) => ({
    	getAllProducts: builder.query<ProductModel[], void>({
        	query: () => "products",
        	transformResponse: (response: { products: ProductModel[] }) => response.products,
        	transformErrorResponse: (response) => response.data as ErrorResponse,
        	providesTags: ["ProductModel"],
    	}),
    	getProductsByUser: builder.query<ProductModel[], number>({
        	query: (userId) => `products/user/${userId}`,
        	transformResponse: (response: { products: ProductModel[] }) => response.products,
        	transformErrorResponse: (response) => response.data as ErrorResponse,
        	providesTags: ["ProductModel"],
    	}),
    	createProduct: builder.mutation<ProductResponse, ProductCreateRequest>({
        	query: (body) => ({
            	url: "product/create",
            	method: "POST",
            	body,
        	}),
        	invalidatesTags: ["ProductModel"],
        	transformErrorResponse: (response) => response.data as ErrorResponse,
    	}),
    	deleteProduct: builder.mutation<ProductResponse, ProductDeleteRequest>({
        	query: (id) => ({
            	url: `product/delete/${id}`,
            	method: "DELETE",
        	}),
        	invalidatesTags: ["ProductModel"],
        	transformErrorResponse: (response) => response.data as ErrorResponse,
    	}),
    	updateProduct: builder.mutation<ProductResponse, ProductUpdateRequest>({
        	query: (body) => ({
            	url: `product/update/${body.id}`,
            	method: "PUT",
            	body,
        	}),
        	invalidatesTags: ["ProductModel"],
        	transformErrorResponse: (response) => response.data as ErrorResponse,
    	}),
	}),
});

export const {
	useGetAllProductsQuery,
	useGetProductsByUserQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productApi;
