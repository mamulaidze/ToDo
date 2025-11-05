// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
    name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
