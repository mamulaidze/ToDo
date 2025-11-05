import Task from "../models/Task.js";

// ✅ Get all tasks (sorted by datetime)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ datetime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add new task
export const addTask = async (req, res) => {
  const { title, description, datetime, priority, repeat } = req.body;
  try {
    const task = new Task({
      title,
      description,
      datetime,
      priority,
      repeat,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Toggle task completion (sets/unsets completedAt)
export const toggleTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark as completed (used for repeating tasks)
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = true;
    task.completedAt = new Date();
    const updatedTask = await task.save();

    // Handle repeating tasks
    if (task.repeat && task.repeat !== "none") {
      let nextDate = new Date(task.datetime);
      switch (task.repeat) {
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
      }

      const newTask = new Task({
        title: task.title,
        description: task.description,
        datetime: nextDate,
        priority: task.priority,
        repeat: task.repeat,
      });
      await newTask.save();
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Automatically delete overdue incomplete tasks
export const cleanupOverdueTasks = async () => {
  try {
    const now = new Date();
    const result = await Task.deleteMany({
      datetime: { $lt: now },
      completed: false,
    });
    if (result.deletedCount > 0) {
      console.log(`Overdue tasks deleted: ${result.deletedCount}`);
    }
  } catch (err) {
    console.error("Error cleaning overdue tasks:", err.message);
  }
};
