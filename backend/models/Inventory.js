import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: { type: String, required: true },
    category: { type: String, required: true },

    stock: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },

    value: Number,

    soldQty: { type: Number, default: 0 }, // ✅ real data
  },
  { timestamps: true }
);

/* =========================
   🔥 STOCK STATUS (VIRTUAL)
========================= */
inventorySchema.virtual("status").get(function () {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock < 20) return "Low Stock";
  return "In Stock";
});

/* =========================
   📊 DAILY SALES (VIRTUAL)
========================= */
inventorySchema.virtual("dailySales").get(function () {
  return this.soldQty * this.sellingPrice;
});

// 👇 VERY IMPORTANT
inventorySchema.set("toJSON", { virtuals: true });
inventorySchema.set("toObject", { virtuals: true });

export default mongoose.model("Inventory", inventorySchema);
