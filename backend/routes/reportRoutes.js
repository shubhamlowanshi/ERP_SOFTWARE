import express from "express";
import { getProfitLoss } from "../controllers/reportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profit-loss", authMiddleware, getProfitLoss);

export default router;
