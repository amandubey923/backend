"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentById = exports.deleteComment = exports.createComment = exports.deleteProduct = exports.updateProduct = exports.getProductsByUserId = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.upsertUser = exports.updateUser = exports.getUserById = exports.createUser = void 0;
const index_1 = require("./index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const createUser = async (data) => {
    const [user] = await index_1.db.insert(schema_1.users).values(data).returning();
    return user;
};
exports.createUser = createUser;
const getUserById = async (id) => {
    return index_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.id, id) });
};
exports.getUserById = getUserById;
const updateUser = async (id, data) => {
    const existingUser = await (0, exports.getUserById)(id);
    if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
    }
    const [user] = await index_1.db.update(schema_1.users).set(data).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning();
    return user;
};
exports.updateUser = updateUser;
const upsertUser = async (data) => {
    const [user] = await index_1.db
        .insert(schema_1.users)
        .values(data)
        .onConflictDoUpdate({
        target: schema_1.users.id,
        set: data,
    })
        .returning();
    return user;
};
exports.upsertUser = upsertUser;
// PRODUCT QUERIES
const createProduct = async (data) => {
    const [product] = await index_1.db.insert(schema_1.products).values(data).returning();
    return product;
};
exports.createProduct = createProduct;
const getAllProducts = async () => {
    return index_1.db.query.products.findMany({
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)], // desc means: you will see the latest products first
        // the square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column.
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return index_1.db.query.products.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.products.id, id),
        with: {
            user: true,
            comments: {
                with: { user: true },
                orderBy: (comments, { desc }) => [desc(comments.createdAt)],
            },
        },
    });
};
exports.getProductById = getProductById;
const getProductsByUserId = async (userId) => {
    return index_1.db.query.products.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.products.userId, userId),
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
};
exports.getProductsByUserId = getProductsByUserId;
const updateProduct = async (id, data) => {
    const existingProduct = await (0, exports.getProductById)(id);
    if (!existingProduct) {
        throw new Error(`Product with id ${id} not found`);
    }
    const [product] = await index_1.db.update(schema_1.products).set(data).where((0, drizzle_orm_1.eq)(schema_1.products.id, id)).returning();
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const existingProduct = await (0, exports.getProductById)(id);
    if (!existingProduct) {
        throw new Error(`Product with id ${id} not found`);
    }
    const [product] = await index_1.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id)).returning();
    return product;
};
exports.deleteProduct = deleteProduct;
// COMMENT QUERIES
const createComment = async (data) => {
    const [comment] = await index_1.db.insert(schema_1.comments).values(data).returning();
    return comment;
};
exports.createComment = createComment;
const deleteComment = async (id) => {
    const existingComment = await (0, exports.getCommentById)(id);
    if (!existingComment) {
        throw new Error(`Comment with id ${id} not found`);
    }
    const [comment] = await index_1.db.delete(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.id, id)).returning();
    return comment;
};
exports.deleteComment = deleteComment;
const getCommentById = async (id) => {
    return index_1.db.query.comments.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.comments.id, id),
        with: { user: true },
    });
};
exports.getCommentById = getCommentById;
