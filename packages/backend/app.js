import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";

console.log("Server starting...");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with a real database in production)
let users = [];
let products = [];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
};

// Register new user
app.post("/api/register", (req, res) => {
  console.log("Received registration request:", req.body);
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user = {
    id: users.length + 1,
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role,
  };
  users.push(user);

  const token = jwt.sign({ id: user.id }, "your-secret-key", {
    expiresIn: 86400,
  });
  console.log("User registered:", {
    id: user.id,
    username: user.username,
    role: user.role,
  });
  res.status(200).send({
    auth: true,
    token: token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// Login
app.post("/api/login", (req, res) => {
  console.log("Received login request:", req.body);
  const user = users.find((u) => u.username === req.body.username);
  if (!user) return res.status(404).send("No user found.");

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordIsValid)
    return res.status(401).send({ auth: false, token: null });

  const token = jwt.sign({ id: user.id }, "your-secret-key", {
    expiresIn: 86400,
  });
  console.log("User logged in:", {
    id: user.id,
    username: user.username,
    role: user.role,
  });
  res.status(200).send({
    auth: true,
    token: token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});

// Add a new product (seller only)
app.post("/api/products", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (user.role !== "seller")
    return res.status(403).send({ message: "Only sellers can add products." });

  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    sellerId: user.id,
  };
  products.push(product);
  res.status(201).send(product);
});

// Buy a product (shopper only)
app.post("/api/products/:id/buy", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (user.role !== "shopper")
    return res.status(403).send({ message: "Only shoppers can buy products." });

  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send({ message: "Product not found." });

  if (product.quantity < req.body.quantity)
    return res.status(400).send({ message: "Not enough stock." });

  product.quantity -= req.body.quantity;
  res.status(200).send(product);
});

// Get all users (admin only)
app.get("/api/users", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (user.role !== "admin")
    return res.status(403).send({ message: "Only admins can view all users." });

  res
    .status(200)
    .send(users.map((u) => ({ id: u.id, username: u.username, role: u.role })));
});

// Delete a user (admin only)
app.delete("/api/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (user.role !== "admin")
    return res.status(403).send({ message: "Only admins can delete users." });

  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.status(200).send({ message: "User deleted successfully." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
