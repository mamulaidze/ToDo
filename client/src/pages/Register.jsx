import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState(""); // ✅ name added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, email, password }); // ✅ pass object
    if (res.success) navigate("/"); 
    else alert(res.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
        {t("Register")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 sm:max-w-md mx-auto space-y-6"
      >
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("Enter your name")}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Enter your email")}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">{t("Password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("Enter your password")}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-2xl shadow-md transition"
        >
          <UserPlus className="w-5 h-5" />
          {t("Register")}
        </button>

        <div className="text-center text-sm text-gray-600">
          {t("Already have an account?")}{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t("Login")}
          </Link>
        </div>
      </form>
    </div>
  );
}
