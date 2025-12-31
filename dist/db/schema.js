"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRelations = exports.productsRelations = exports.usersRelations = exports.comments = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey(), // clerkId
    email: (0, pg_core_1.text)("email").notNull().unique(),
    name: (0, pg_core_1.text)("name"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" }).notNull().defaultNow(),
});
exports.comments = (0, pg_core_1.pgTable)("comments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    content: (0, pg_core_1.text)("content").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.uuid)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    products: many(exports.products), // 🔴 One user → many products
    comments: many(exports.comments), // 🔴 One user → many comments
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one, many }) => ({
    comments: many(exports.comments),
    user: one(exports.users, { fields: [exports.products.userId], references: [exports.users.id] }), // one product → one user
}));
// Comments Relations: A comment belongs to one user and one product
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one }) => ({
    user: one(exports.users, { fields: [exports.comments.userId], references: [exports.users.id] }),
    product: one(exports.products, { fields: [exports.comments.productId], references: [exports.products.id] }), // One comment → one product
}));
