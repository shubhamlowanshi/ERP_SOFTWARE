import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
    },

    gstNumber: {
      type: String,
    },

    panNumber: {
      type: String,
    },

    ownerName: {
      type: String,
    },

    mobile: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: "India",
    },

    address: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 IMPORTANT: logout / force logout support
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
