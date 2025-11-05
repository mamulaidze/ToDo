import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ge" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);

    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/login"); // 🔹 redirect if not logged in
    } else {
      const confirmLogout = window.confirm(t("Do you want to log out?"));
      if (confirmLogout) logout();
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm font-sans relative">

      <Link
        to="/"
        className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight"
      >
        {t("home")}
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/tasks"
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          {t("tasks")}
        </Link>
        <Link
          to="/add-task"
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          {t("addTask")}
        </Link>
        <Link
          to="/completed-tasks"
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          {t("completedTasks")}
        </Link>

        {/* 🔹 User Icon */}
        <button
          onClick={handleUserClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label={user ? t("Logout") : t("Login")}
        >
          <User className="w-6 h-6 text-gray-600 hover:text-blue-500" />
        </button>

        <button
          onClick={toggleLanguage}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Change language"
        >
          <Globe
            className={`w-6 h-6 text-gray-600 hover:text-blue-500 active:text-red-500 transition-transform duration-500 ${
              isSpinning ? "rotate-[360deg]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 md:hidden animate-fadeIn shadow-2xl">
          <div className="flex flex-col items-start px-6 py-4 space-y-4">
            <Link
              to="/tasks"
              className="text-gray-700 hover:text-blue-600 w-full"
              onClick={() => setMenuOpen(false)}
            >
              {t("tasks")}
            </Link>
            <Link
              to="/add-task"
              className="text-gray-700 hover:text-blue-600 w-full"
              onClick={() => setMenuOpen(false)}
            >
              {t("addTask")}
            </Link>
            <Link
              to="/completed-tasks"
              className="text-gray-700 hover:text-blue-600 w-full"
              onClick={() => setMenuOpen(false)}
            >
              {t("completedTasks")}
            </Link>

            {/* 🔹 User Icon Mobile */}
            <button
              onClick={() => {
                handleUserClick();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              {user ? t("Logout") : t("Login")}
            </button>

            <button
              onClick={() => {
                toggleLanguage();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <Globe
                className={`w-5 h-5 transition-transform duration-500 ${
                  isSpinning ? "rotate-[360deg]" : ""
                }`}
              />
              {t("changeLanguage")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
