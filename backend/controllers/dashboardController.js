import Billing from "../models/Billing.js";
import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";

const sendError = (res, msg, status = 500) =>
  res.status(status).json({ message: msg });

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

    // 👉 1. TODAY SALES
    const [todaySalesAgg] = await Billing.aggregate([
      {
        $match: {
          createdBy: userId,
          createdAt: { $gte: today },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalAmount" } },
      },
    ]);

    // 👉 2. MONTHLY REVENUE
    const [monthlyAgg] = await Billing.aggregate([
      {
        $match: {
          createdBy: userId,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalAmount" } },
      },
    ]);

    // 👉 3. PROFIT — FULL DB SIDE CALCULATION
    const [profitAgg] = await Billing.aggregate([
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

    // 👉 4. LOW STOCK
    const lowStockItems = await Inventory.find({
      userId,
      stock: { $lte: 10 },
    }).select("productName stock -_id");

    res.json({
      todaySales: todaySalesAgg?.total || 0,
      monthlyRevenue: monthlyAgg?.total || 0,
      profit: profitAgg?.profit || 0,

      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.map((i) => ({
        name: i.productName,
        stock: i.stock,
      })),
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    sendError(res, "Dashboard fetch failed");
  }
};
