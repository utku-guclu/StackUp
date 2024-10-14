import express from "express";
import cors from "cors";
import authenticationRoutes from "./routes/authenticationRoutes.js";
import accessControlRoutes from "./routes/authorisationRoutes.js";

console.log("Server starting...");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authenticationRoutes);
app.use("/api", accessControlRoutes);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
