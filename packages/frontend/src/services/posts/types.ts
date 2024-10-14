export interface ProductModel {
	id: number;
	sellerId: number;
	sellerUserName: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export type AllProductResponse = {
	message: string;
	status: number;
	ok: boolean;
	products: ProductModel[];
};

export interface ProductCreateRequest {
	name: string;
	description: string;
	price: number;
	quantity: number;
}

export interface ProductDeleteRequest {
	id: number;
}

export interface ProductUpdateRequest extends ProductDeleteRequest {
	name?: string;
	description?: string;
	price?: number;
	quantity?: number;
}

export interface ProductResponse {
	message?: string;
	status?: number;
	ok?: boolean;
	error?: string;
	reason?: string;
}
