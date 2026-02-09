import Users from "../models/Users.js";
import Billing from "../models/Billing.js";
import Inventory from "../models/Inventory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// reusable error handler – life easy ho jayegi
const sendError = (res, message, status = 400) =>
  res.status(status).json({ message });

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password required");
    }

    const existingUser = await Users.exists({ email });
    if (existingUser) {
      return sendError(res, "User already exists");
    }

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
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }).select("+password +tokenVersion");
    if (!user) return sendError(res, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, "Invalid credentials");

    const token = jwt.sign(
      {
        id: user._id,
        tokenVersion: user.tokenVersion,
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
   LOGOUT ALL DEVICES
========================= */
export const logoutAllDevices = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.user.id, {
      $inc: { tokenVersion: 1 },
    });

    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    sendError(res, "Logout failed", 500);
  }
};

/* =========================
   DELETE ACCOUNT (FULL CLEAN)
========================= */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      Billing.deleteMany({ createdBy: userId }),
      Inventory.deleteMany({ userId }),
      Users.findByIdAndDelete(userId),
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    sendError(res, "Account deletion failed", 500);
  }
};
