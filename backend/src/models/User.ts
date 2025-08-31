import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  picture: String,
  provider: { type: String, default: "google" },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);