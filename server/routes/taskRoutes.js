import express from "express";
import {
  getTasks,
  addTask,
  toggleTaskCompleted,
  completeTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// ✅ Get all tasks
router.get("/", getTasks);

// ✅ Add a new task
router.post("/", addTask);

// ✅ Toggle task completion (mark/unmark complete)
router.patch("/:id/toggle", toggleTaskCompleted);

// ✅ Mark task as completed (used for repeating tasks)
router.patch("/:id/complete", completeTask);

// ✅ Delete a task
router.delete("/:id", deleteTask);

export default router;
