import Billing from "../models/Billing.js";
import mongoose from "mongoose";

const sendError = (res, msg, status = 500) =>
  res.status(status).json({ message: msg });

export const getProfitLoss = async (req, res) => {
  try {
    const { filter = "weekly" } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    let groupBy;
    let labels = [];

    if (filter === "weekly") {
      groupBy = { $dayOfWeek: "$createdAt" };
      labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    } 
    else if (filter === "monthly") {
      groupBy = { $month: "$createdAt" };
      labels = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];
    } 
    else {
      groupBy = { $year: "$createdAt" };
    }

    const data = await Billing.aggregate([
      // 🔐 USER FILTER MOST IMPORTANT
      { $match: { createdBy: userId } },

      { $unwind: "$items" },

      {
        $group: {
          _id: { period: groupBy },

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

      { $sort: { "_id.period": 1 } },
    ]);

    // 👉 Proper mapping so graph kabhi na toote
    const values = Array(labels.length).fill(0);
    let netProfit = 0;

    data.forEach((d) => {
      const index = d._id.period - 1;
      values[index] = d.profit;
      netProfit += d.profit;
    });

    res.json({
      labels,
      values,
      netProfit,
    });

  } catch (err) {
    console.error("🔥 PROFIT LOSS ERROR:", err);
    sendError(res, "Profit/Loss fetch failed");
  }
};
