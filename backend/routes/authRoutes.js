import express from "express";
import { registerUser ,loginUser,logoutAllDevices,deleteAccount} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";   
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout-all", authMiddleware, logoutAllDevices);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
