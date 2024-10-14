import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authenticationRoutes.js";
import morgan from "morgan";
import accessControlRoutes from "./routes/authorisationRoutes.js";
import dotenv from "dotenv";
import healthCheck from "./controllers/healthCheck.js";
dotenv.config();
const config = process.env;

import cors from "cors";

const PORT = 4040;
const app = express();

app.use(morgan("dev"));
app.use(cookieParser(config.TOKEN));

const corsOptions = {
  // Add your address here i.e. your forwarded address from a cloud environment
  origin: [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4040",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://[::1]:4173",
    "http://[::1]:5173",
  ],
  credentials: true, //included credentials as true
  preflightContinue: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin, X-Requested-With,content-type,Content-Type, Authorization,Authentication,withCredentials, Content-Length, X-Requested-With, Accept, x-access-token,credentials, Origin, X-Content-Type-Options",
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, Authorization, Authentication, withCredentials, credentials, Set-Cookie",
  );
  res.header("Access-Control-Allow-Credentials", true);

  // You might want to hard-code this if necessary.
  const origin = req.get("origin") || req.get("referer");
  res.header("Access-Control-Allow-Origin", origin);

  next();
});

app.use(express.json());

// Set Cors Options before other routes for all possible routes, enabling preflight across the board
app.options("*", cors(corsOptions));

app.use("/api/auth/", authRoute);
app.use("/api/posts/", accessControlRoutes);
app.get("/api/health", healthCheck);

// Log all routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
});

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Connected and listening on port ${PORT}.`);
    console.log('Available routes:');
    console.log('  /api/auth/');
    console.log('  /api/posts/');
  });
} catch (err) {
  console.error(`Failed to start the server with error:`, err);
}
