import Billing from "../models/Billing.js";
import mongoose from "mongoose";

const sendError = (res, msg, status = 500) =>
  res.status(status).json({ message: msg });

export const getProfitLoss = async (req, res) => {
  try {
    const filter = req.query.filter || "weekly";
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ====== GROUP LOGIC ======
    let groupStage;
    let labels = [];

    switch (filter) {
      case "weekly":
        groupStage = { $dayOfWeek: "$createdAt" };
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;

      case "monthly":
        groupStage = { $month: "$createdAt" };
        labels = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];
        break;

      case "yearly":
        groupStage = { $year: "$createdAt" };
        // yearly me dynamic labels banenge
        break;

      default:
        return sendError(res, "Invalid filter type", 400);
    }

    // ====== AGGREGATION ======
    const data = await Billing.aggregate([
      // 1️⃣ index friendly match
      { $match: { createdBy: userId } },

      // 2️⃣ only required fields
      {
        $project: {
          createdAt: 1,
          items: 1
        }
      },

      // 3️⃣ unwind
      { $unwind: "$items" },

      // 4️⃣ profit calc DB side
      {
        $group: {
          _id: { period: groupStage },

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

    // ====== RESPONSE MAPPING ======
    let values;
    let netProfit = 0;

    if (filter === "yearly") {
      // dynamic years
      labels = data.map(d => d._id.period.toString());
      values = data.map(d => {
        netProfit += d.profit;
        return d.profit;
      });
    } 
    else {
      // fixed size array
      values = Array(labels.length).fill(0);

      data.forEach(d => {
        const index = d._id.period - 1;

        if (index >= 0 && index < values.length) {
          values[index] = d.profit;
        }

        netProfit += d.profit;
      });
    }

    return res.json({
      labels,
      values,
      netProfit,
    });

  } catch (err) {
    console.error("🔥 PROFIT LOSS ERROR:", err);
    sendError(res, "Profit/Loss fetch failed");
  }
};
