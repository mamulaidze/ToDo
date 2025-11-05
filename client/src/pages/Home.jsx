import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [user]);

  const now = new Date();

  // -------- AUTHENTICATED DATA --------
  let completedToday = 0,
    completedThisWeek = 0,
    completedThisMonth = 0,
    avgCompletionTime = 0,
    pendingCount = 0,
    completedCount = 0,
    pieData = [],
    categoryData = [];

  if (user && tasks.length > 0) {
    const completedTasks = tasks.filter((t) => t.completed);

    completedToday = completedTasks.filter(
      (t) => new Date(t.completedAt).toDateString() === now.toDateString()
    ).length;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    completedThisWeek = completedTasks.filter(
      (t) => new Date(t.completedAt) >= weekStart
    ).length;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    completedThisMonth = completedTasks.filter(
      (t) => new Date(t.completedAt) >= monthStart
    ).length;

    pendingCount = tasks.filter((t) => !t.completed).length;
    completedCount = completedTasks.length;

    pieData = [
      { name: t("Completed"), value: completedCount },
      { name: t("Pending"), value: pendingCount },
    ];

    const categoriesCount = {};
    tasks.forEach((t) => {
      categoriesCount[t.priority] = (categoriesCount[t.priority] || 0) + 1;
    });
    categoryData = Object.keys(categoriesCount).map((key) => ({
      category: key,
      count: categoriesCount[key],
    }));

    const completionTimes = completedTasks
      .map((task) => {
        if (!task.createdAt || !task.completedAt) return null;
        const start = new Date(task.createdAt);
        const end = new Date(task.completedAt);
        const diff = (end - start) / (1000 * 60); // minutes
        return diff >= 0 ? diff : null;
      })
      .filter((time) => time !== null && !isNaN(time));

    avgCompletionTime =
      completionTimes.length > 0
        ? (completionTimes.reduce((a, b) => a + b, 0) /
            completionTimes.length
          ).toFixed(1)
        : 0;
  }

  // -------- GUEST (FUN PLACEHOLDER DATA) --------
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const guestStats = {
    today: randomInt(1, 15),
    week: randomInt(10, 60),
    month: randomInt(25, 150),
    avgTime: randomInt(5, 50),
    pending: randomInt(5, 25),
    completed: randomInt(10, 70),
  };

  const guestPieData = [
    { name: t("Completed"), value: guestStats.completed },
    { name: t("Pending"), value: guestStats.pending },
  ];

  const guestCategoryData = [
    { category: "High", count: randomInt(5, 20) },
    { category: "Medium", count: randomInt(10, 30) },
    { category: "Low", count: randomInt(2, 15) },
  ];

  // Colors for cards
  const cardColors = ["#4ade80", "#22d3ee", "#facc15", "#3b82f6"];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
        {user ? t("Dashboard") : t("Welcome! Discover Your Productivity Stats")}
      </h1>

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 text-gray-700 font-semibold"
        >
          <p>{t("Login to unlock your real tasks and track your productivity!")}</p>
          <Link
            to="/login"
            className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            {t("Login / Register")}
          </Link>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {["Completed Today", "Completed This Week", "Completed This Month", "Avg Completion Time (min)"].map(
          (label, i) => {
            const values = user
              ? [completedToday, completedThisWeek, completedThisMonth, avgCompletionTime]
              : [guestStats.today, guestStats.week, guestStats.month, guestStats.avgTime];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-5 rounded-2xl shadow-md"
              >
                <h2 className="font-semibold text-gray-600">{t(label)}</h2>
                <p className={`text-2xl font-bold`} style={{ color: cardColors[i] }}>
                  <CountUp end={values[i]} duration={1.5} />
                </p>
              </motion.div>
            );
          }
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending vs Completed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-2xl shadow-md"
        >
          <h2 className="font-semibold mb-3">{t("Tasks Status")}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={user ? pieData : guestPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {(user ? pieData : guestPieData).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#4ade80", "#f87171"][index % 2]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Most Frequent Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-2xl shadow-md"
        >
          <h2 className="font-semibold mb-3">{t("Most Frequent Categories")}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={user ? categoryData : guestCategoryData}>
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
