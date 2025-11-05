import React, { useEffect, useState } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CompletedTasks() {
  const { t } = useTranslation();
  const [completedTasks, setCompletedTasks] = useState([]);

  // Fetch completed tasks
  const fetchCompletedTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`)

      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setCompletedTasks(data.filter(task => task.completed));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  // Delete completed task manually
  const handleDelete = async (taskId) => {
    if (!window.confirm(t("Are you sure you want to delete this task?"))) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setCompletedTasks(prev => prev.filter(t => t._id !== taskId));
      alert(t("Task deleted"));
    } catch (err) {
      console.error(err);
      alert(t("Error deleting task"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">{t("Completed Tasks")}</h1>

      {completedTasks.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">No completed tasks yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completedTasks.map(task => {
            const taskDate = new Date(task.datetime);
            const displayTime = taskDate.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

            return (
              <div key={task._id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer opacity-80">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-500 flex items-center gap-2 line-through">
                    {task.title}
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </h2>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === "High" ? "bg-red-100 text-red-700" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-500 mb-3 line-through">{task.description}</p>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {displayTime}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-medium">{t("Completed")}</span>
                    <button className="text-red-600 hover:text-red-800 font-medium cursor-pointer" onClick={() => handleDelete(task._id)}>
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
