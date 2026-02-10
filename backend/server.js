import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
// import salesRoutes from "./routes/salesRoutes.js";   
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://erp-software-seven-roan.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/billing", billingRoutes);
// app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);
