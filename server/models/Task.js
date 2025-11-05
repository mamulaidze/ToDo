import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    datetime: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null }, 
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
