import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getDailySales,
  getDashboardOverview
} from "../controllers/inventoryController.js";
import Inventory from "../models/Inventory.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 ALL ROUTES PROTECTED
router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, addProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/daily-sales", authMiddleware, getDailySales);
router.get("/overview", authMiddleware, getDashboardOverview);

// 🔥 REDUCE STOCK (SECURE VERSION)
router.post("/reduce-stock/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🧱 ISOLATION WALL
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.stock -= quantity;
    product.value = product.stock * product.costPrice;

    if (product.stock === 0) product.status = "Out of Stock";
    else if (product.stock < 20) product.status = "Low Stock";
    else product.status = "In Stock";

    await product.save();

    res.json({ message: "Stock updated successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stock update failed ❌" });
  }
});

export default router;
