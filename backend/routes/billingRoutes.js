import express from "express";
import { createBill, getBillById ,getAllSales,getDailySales,getMonthlySales,getAllCustomers} from "../controllers/billingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createBill);   // Confirm bill
router.get("/daily-sales",authMiddleware,   getDailySales);
router.get("/monthly-sales",authMiddleware,   getMonthlySales);
router.get("/:id",authMiddleware,   getBillById);      // Generate bill
router.get("/",authMiddleware,   getAllSales); // Get all sales       
router.get("/customers/all",authMiddleware,   getAllCustomers); // Get all customers
export default router;
