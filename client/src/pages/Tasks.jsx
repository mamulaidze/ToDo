import React, { useEffect, useState } from "react";
import { Clock, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Tasks() {
  const now = new Date();
  const [tasks, setTasks] = useState([]);
  const [highlight, setHighlight] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ge" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    const interval = setInterval(() => setHighlight(prev => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks & clean overdue
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      let data = await res.json();

      // Filter out completed tasks
      data = data.filter(task => !task.completed);

      // Delete overdue tasks
      const overdueTasks = data.filter(task => new Date(task.datetime) < now);
      for (let task of overdueTasks) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, { method: "DELETE" });
      }

      setTasks(data.filter(task => new Date(task.datetime) >= now));
    } catch (err) {
      console.error(err);
      alert(t("Error fetching tasks"));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId) => {
    if (!window.confirm(t("Are you sure"))) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to mark task as completed");
      setTasks(prev => prev.filter(t => t._id !== taskId));
      alert(t("Task marked"));
    } catch (err) {
      console.error(err);
      alert(t("Error completing task"));
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm(t("Are you sure you want to delete this task?"))) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(prev => prev.filter(t => t._id !== taskId));
      alert(t("Task deleted"));
    } catch (err) {
      console.error(err);
      alert(t("Error deleting task"));
    }
  };

  // Group tasks by day
  const getTaskGroups = () => {
    const groups = { Today: [], Tomorrow: [], "Day After Tomorrow": [], Others: [] };

    tasks.forEach(task => {
      const taskDate = new Date(task.datetime);
      const diffDays = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) groups.Today.push(task);
      else if (diffDays === 1) groups.Tomorrow.push(task);
      else if (diffDays === 2) groups["Day After Tomorrow"].push(task);
      else groups.Others.push(task);
    });

    return groups;
  };

  const groups = getTaskGroups();

  const renderTaskCard = (task) => {
    const taskDate = new Date(task.datetime);
    const displayTime = taskDate.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const borderClass = highlight ? "border-l-4 border-red-500" : "";

    return (
      <div key={task._id} className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${borderClass}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {task.title} {new Date(task.datetime).toDateString() === now.toDateString() && <Pin className="w-4 h-4 text-blue-500" />}
          </h2>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === "High" ? "bg-red-100 text-red-700" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-gray-600 mb-3">{task.description}</p>
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{displayTime}</span>
          <div className="flex gap-3">
            <button className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer" onClick={() => handleComplete(task._id)}>{t("complete")}</button>
            <button className="text-red-600 hover:text-red-800 font-medium cursor-pointer" onClick={() => handleDelete(task._id)}>{t("delete")}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">{t("myTasks")}</h1>
      {Object.entries(groups).map(([groupName, groupTasks]) => groupTasks.length > 0 && (
        <div key={groupName} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t(groupName)}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groupTasks.map(renderTaskCard)}
          </div>
        </div>
      ))}
    </div>
  );
}
