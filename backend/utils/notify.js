import { io } from "../server.js";

export const notifyLowStock = (userId, product) => {
  io.to(userId.toString()).emit("low-stock", {
    type: "LOW_STOCK",
    message: `${product.productName} low stock pe aa gaya`,
    productId: product._id,
    stock: product.stock,
    time: new Date(),
  });
};
