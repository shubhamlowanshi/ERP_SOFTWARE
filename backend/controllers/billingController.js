import Billing from "../models/Billing.js";
import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";

const generateBillNo = () => `BILL-${Date.now()}`;

const sendError = (res, msg, status = 400) =>
  res.status(status).json({ message: msg });

/* =========================
   CREATE BILL (ATOMIC)
   LOGIC SAME – SPEED BETTER
========================= */
export const createBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      items,
      paymentMode,
      totalAmount,
      paidAmount = 0,
    } = req.body;

    if (!customerName || !customerMobile)
      return sendError(res, "Customer name & mobile required");

    if (!items?.length) return sendError(res, "No items in bill");

    // 👉 lean use = fast read
    const productIds = items.map((i) => i.productId);

    const products = await Inventory.find({
      _id: { $in: productIds },
    })
      .session(session)
      .lean();       // 👈 BIG PERFORMANCE WIN

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    const itemsWithCost = [];
    const bulkOps = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        await session.abortTransaction();
        return sendError(res, `Product not found`);
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return sendError(res, `${product.productName} out of stock`);
      }

      // 👉 instead of save() in loop → bulkWrite
      const newStock = product.stock - item.quantity;
      const newSold = (product.soldQty || 0) + item.quantity;

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              stock: newStock,
              soldQty: newSold,
              value: newStock * product.costPrice,
            },
          },
        },
      });

      itemsWithCost.push({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costPrice: product.costPrice,
        total: item.unitPrice * item.quantity,
      });
    }

    // 👉 1 DB HIT FOR ALL STOCK UPDATE
    if (bulkOps.length) {
      await Inventory.bulkWrite(bulkOps, { session });
    }

    const dueAmount = totalAmount - paidAmount;

    const paymentStatus =
      paidAmount >= totalAmount
        ? "Paid"
        : paidAmount > 0
          ? "Partial"
          : "Pending";

    const bill = await Billing.create(
      [
        {
          billNo: generateBillNo(),
          customerName,
          customerMobile,
          customerEmail,
          paymentMode,
          totalAmount,
          paidAmount,
          dueAmount,
          paymentStatus,
          items: itemsWithCost,
          createdBy: req.user.id,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({ bill: bill[0] });
  } catch (err) {
    await session.abortTransaction();
    console.error("🔥 BILL ERROR:", err);
    sendError(res, "Billing failed", 500);
  } finally {
    session.endSession();
  }
};

/* =========================
   GET BILL BY ID
========================= */
export const getBillById = async (req, res) => {
  try {
    const bill = await Billing.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).lean();   // 👈 read only → lean

    if (!bill) return sendError(res, "Bill not found", 404);

    res.json({ bill });
  } catch (err) {
    sendError(res, "Failed to fetch bill", 500);
  }
};

/* =========================
   GET ALL SALES
========================= */
export const getAllSales = async (req, res) => {
  try {
    const sales = await Billing.find(
      { createdBy: req.user.id }
    )
      .sort({ createdAt: -1 })
      .lean();   // 👈 fast

    res.json({ sales });
  } catch (err) {
    sendError(res, "Failed to fetch sales", 500);
  }
};

/* =========================
   GET DAILY SALES
========================= */
export const getDailySales = async (req, res) => {
  try {
    const sales = await Billing.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
        },
      },

      { $unwind: "$items" },

      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata", // ✅ FIXED
              },
            },
            productName: "$items.productName",
          },
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: {
            $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] },
          },
        },
      },

      { $sort: { "_id.date": 1 } },

      {
        $group: {
          _id: "$_id.productName",
          dailySales: {
            $push: {
              date: "$_id.date",
              quantity: "$totalQuantity",
              sales: "$totalSales",
            },
          },
        },
      },
    ]);

    res.json(sales);
  } catch (err) {
    sendError(res, "Failed to fetch daily sales", 500);
  }
};


/* =========================
   GET MONTHLY SALES
========================= */
export const getMonthlySales = async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    res.json(
      data.map((i) => ({
        month: monthNames[i._id - 1],
        sales: i.totalSales,
      }))
    );
  } catch (err) {
    sendError(res, "Monthly sales fetch failed", 500);
  }
};

/* =========================
   GET ALL CUSTOMERS DATA
========================= */
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Billing.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: "$customerMobile",

          customerName: { $last: "$customerName" },
          customerEmail: { $last: "$customerEmail" },
          customerMobile: { $last: "$customerMobile" },

          totalPurchase: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$paidAmount" },

          lastBillDate: { $max: "$createdAt" },

          bills: {
            $push: {
              billNo: "$billNo",
              total: "$totalAmount",
              paid: "$paidAmount",
              date: "$createdAt",
              paymentMode: "$paymentMode",
            },
          },
        },
      },

      {
        $addFields: {
          totalDue: { $subtract: ["$totalPurchase", "$totalPaid"] },

          paymentStatus: {
            $cond: [
              { $eq: ["$totalPurchase", "$totalPaid"] },
              "Paid",
              {
                $cond: [
                  { $gt: ["$totalPaid", 0] },
                  "Partial",
                  "Pending",
                ],
              },
            ],
          },
        },
      },

      // ✅ REAL HERO SORT
      { $sort: { lastBillDate: -1 } },
    ]);

    res.json({ customers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Customer fetch failed" });
  }
};


