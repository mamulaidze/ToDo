// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import { connectDB } from "./utils/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { cleanupOverdueTasks } from "./controllers/taskController.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration for frontend with credentials
app.use(cors({
  origin: ["http://localhost:5173", "https://besttodoonworld.netlify.app"],
  credentials: true,
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Daily CRON task to clean overdue tasks at 00:00
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily overdue tasks cleanup...");
  try {
    await cleanupOverdueTasks();
  } catch (err) {
    console.error("Error during CRON cleanup:", err);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
