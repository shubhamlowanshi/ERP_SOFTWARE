import express from "express";
import { registerUser ,loginUser,logoutAllDevices,deleteAccount} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; 
import rateLimit from "express-rate-limit";  
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, 
});
router.post("/register", registerUser);
router.post("/login",loginLimiter, loginUser);
router.post("/logout-all", authMiddleware, logoutAllDevices);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
