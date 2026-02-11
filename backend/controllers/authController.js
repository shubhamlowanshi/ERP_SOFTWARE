import Users from "../models/Users.js";
import Billing from "../models/Billing.js";
import Inventory from "../models/Inventory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// reusable error handler
const sendError = (res, message, status = 400) =>
  res.status(status).json({ message });

/* =========================
   REGISTER (Optimized)
========================= */
export const registerUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password required");
    }

    // FAST EXIST CHECK (projection only _id)
    const existingUser = await Users.findOne(
      { email },
      { _id: 1 }
    ).lean();

    if (existingUser) {
      return sendError(res, "User already exists");
    }

    // Hashing heavy hota hai – await sahi hai
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

/* =========================
   LOGIN (Optimized)
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sirf required fields select
    const user = await Users.findOne(
      { email },
      { password: 1, tokenVersion: 1, email: 1, businessName: 1 }
    ).lean();

    if (!user) return sendError(res, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, "Invalid credentials");

    // MINIMAL JWT PAYLOAD = fast verify
    const token = jwt.sign(
      {
        id: user._id,
        v: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

/* =========================
   LOGOUT ALL DEVICES (FAST)
========================= */
export const logoutAllDevices = async (req, res) => {
  try {
    await Users.updateOne(
      { _id: req.user.id },
      { $inc: { tokenVersion: 1 } }
    );

    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    sendError(res, "Logout failed", 500);
  }
};

/* =========================
   DELETE ACCOUNT (PARALLEL CLEAN)
========================= */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // SAB EK SAATH – time bacha 💨
    await Promise.all([
      Billing.deleteMany({ createdBy: userId }),
      Inventory.deleteMany({ userId }),
      Users.deleteOne({ _id: userId }),
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    sendError(res, "Account deletion failed", 500);
  }
};
