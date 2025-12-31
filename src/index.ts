import express from "express";
import cors from "cors";
import path from "path";

import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

/* =======================
   MIDDLEWARES
======================= */

app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   HEALTH CHECK
======================= */

app.get("/api/health", (req, res) => {
  res.json({
    message:
      "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

/* =======================
   ROUTES
======================= */

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

/* =======================
   SERVER START (FIXED)
======================= */

// 🚨 Railway fix: use platform PORT first
const PORT = process.env.PORT || ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is up and running on PORT:", PORT);
});
