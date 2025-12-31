"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const express_2 = require("@clerk/express");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.ENV.FRONTEND_URL, credentials: true }));
app.use((0, express_2.clerkMiddleware)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api/health", (req, res) => {
    res.json({
        message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments",
        },
    });
});
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
if (env_1.ENV.NODE_ENV === "production") {
    const __dirname = path_1.default.resolve();
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../frontend/dist/index.html"));
    });
}
app.listen(env_1.ENV.PORT, () => console.log("Server is up and running on PORT:", env_1.ENV.PORT));
