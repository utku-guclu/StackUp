import { Router } from "express";
import tokenVerification from "../security/authentication.js";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductsByUser } from "../controllers/access/controls/productController.js";
import { getAllUsers, deleteUser, addUser } from "../controllers/access/controls/userController.js";
import { isAdmin, isSeller } from "../middleware/roleMiddleware.js";

const accessControlRoutes = Router({ mergeParams: true });

// Product routes
accessControlRoutes.post("/product/create", tokenVerification, isSeller, createProduct);
accessControlRoutes.put("/product/update", tokenVerification, isSeller, updateProduct);
accessControlRoutes.delete("/product/delete", tokenVerification, isSeller, deleteProduct);
accessControlRoutes.get("/products", getAllProducts);
accessControlRoutes.get("/products/user/:userId", getProductsByUser);

// User management routes (admin only)
accessControlRoutes.get("/users", tokenVerification, isAdmin, getAllUsers);
accessControlRoutes.post("/user/add", tokenVerification, isAdmin, addUser);
accessControlRoutes.delete("/user/delete/:userId", tokenVerification, isAdmin, deleteUser);

export default accessControlRoutes;
