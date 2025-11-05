import React, { useState } from "react";
import { Clock, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [repeat, setRepeat] = useState("none");

  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ge" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, datetime, priority, repeat };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`,
 {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("Failed to add task");

      alert(t("Task added!"));
      setTitle("");
      setDescription("");
      setDatetime("");
      setPriority("Medium");
      setRepeat("none");
    } catch (err) {
      console.error(err);
      alert(t("Error adding task"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
        {t("Add New Task")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 sm:max-w-lg mx-auto space-y-6"
      >
        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Title")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("Enter task title")}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("Enter task description")}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
            rows={3}
            required
          />
        </div>

        {/* Date and Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Due Date & Time")}</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Priority")}</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="High">{t("High")}</option>
            <option value="Medium">{t("Medium")}</option>
            <option value="Low">{t("Low")}</option>
          </select>
        </div>

        {/* Repeat */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Repeat")}</label>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="none">{t("No Repeat")}</option>
            <option value="daily">{t("Daily")}</option>
            <option value="weekly">{t("Weekly")}</option>
            <option value="monthly">{t("Monthly")}</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-2xl shadow-md transition"
        >
          <PlusCircle className="w-5 h-5" />
          {t("Add Task")}
        </button>
      </form>
    </div>
  );
}
