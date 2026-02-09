import Inventory from "../models/Inventory.js";
import Billing from "../models/Billing.js";
import mongoose from "mongoose";

const sendError = (res, msg, status = 400) =>
  res.status(status).json({ message: msg });

const getStockStatus = (stock) => {
  if (stock === 0) return "Out of Stock";
  if (stock < 20) return "Low Stock";
  return "In Stock";
};

/* =========================
   ADD PRODUCT
========================= */
export const addProduct = async (req, res) => {
  try {
    const { productName, category, stock, costPrice, sellingPrice } = req.body;

    if (!productName || !stock || !costPrice || !sellingPrice) {
      return sendError(res, "Required fields missing");
    }

    const product = await Inventory.create({
      productName,
      category,
      stock,
      costPrice,
      sellingPrice,
      value: stock * costPrice,
      status: getStockStatus(stock),
      userId: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

/* =========================
   GET PRODUCTS (USER BASED)
========================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Inventory.find({ userId: req.user.id });
    res.json(products);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const { stock, costPrice } = req.body;

    const updated = await Inventory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // 🔥 security
      {
        ...req.body,
        value: stock * costPrice,
        status: getStockStatus(stock),
      },
      { new: true }
    );

    if (!updated) return sendError(res, "Product not found", 404);

    res.json(updated);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Inventory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) return sendError(res, "Product not found", 404);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

/* =========================
   REDUCE STOCK (SAFE)
========================= */
export const reduceStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!product) return sendError(res, "Product not found", 404);

    if (product.stock < quantity)
      return sendError(res, "Insufficient stock");

    product.stock -= quantity;
    product.value = product.stock * product.costPrice;
    product.status = getStockStatus(product.stock);

    await product.save();

    res.json({ message: "Stock updated", product });
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

/* =========================
   DAILY SALES (FROM BILLING)
========================= */
export const getDailySales = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Billing.aggregate([
      { $match: { createdBy: userId } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          sales: {
            $sum: {
              $multiply: ["$items.quantity", "$items.unitPrice"],
            },
          },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    sendError(res, "Failed to fetch daily sales", 500);
  }
};

/* =========================
   DASHBOARD OVERVIEW
========================= */
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const [todaySales] = await Billing.aggregate([
      { $match: { createdBy: userId, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const [monthly] = await Billing.aggregate([
      { $match: { createdBy: userId, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const [profit] = await Billing.aggregate([
      { $match: { createdBy: userId } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          profit: {
            $sum: {
              $multiply: [
                { $subtract: ["$items.unitPrice", "$items.costPrice"] },
                "$items.quantity",
              ],
            },
          },
        },
      },
    ]);

    const lowStock = await Inventory.countDocuments({
      userId,
      stock: { $lte: 10 },
    });

    res.json({
      todaySales: todaySales?.total || 0,
      monthlyRevenue: monthly?.total || 0,
      profit: profit?.profit || 0,
      lowStock,
    });
  } catch (err) {
    sendError(res, "Dashboard fetch failed", 500);
  }
};
