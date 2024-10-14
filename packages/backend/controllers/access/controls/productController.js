import ProductModel from "../../../models/ProductModel.js";

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, quantity } = req.body;
		const sellerId = req.user.id;

		const product = await ProductModel.create({
			sellerId,
			name,
			description,
			price,
			quantity,
		});

		res.status(201).json({ message: "Product created", product, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, price, quantity } = req.body;
		const sellerId = req.user.id;

		const product = await ProductModel.findOne({ where: { id, sellerId } });

		if (!product) {
			return res.status(404).json({ message: "Product not found or you're not authorized", ok: false });
		}

		await product.update({ name, description, price, quantity });

		res.status(200).json({ message: "Product updated", product, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const sellerId = req.user.id;

		const product = await ProductModel.findOne({ where: { id, sellerId } });

		if (!product) {
			return res.status(404).json({ message: "Product not found or you're not authorized", ok: false });
		}

		await product.destroy();

		res.status(200).json({ message: "Product deleted", ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const products = await ProductModel.findAll();
		res.status(200).json({ products, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const getProductsByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const products = await ProductModel.findAll({ where: { sellerId: userId } });
		res.status(200).json({ products, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};
