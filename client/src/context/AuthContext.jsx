import React, { createContext, useContext, useState, useEffect } from "react";
import { post, get } from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Register
  const register = async ({ name, email, password }) => {
    try {
      const data = await post("/auth/register", { name, email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error("Register error:", err.message || err);
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  // ✅ Login
  const login = async ({ email, password }) => {
    try {
      const data = await post("/auth/login", { email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err.message || err);
      return { success: false, message: err.message || "Login failed" };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err.message || err);
    }
  };

  // ✅ Fetch current user on page load
  const fetchMe = async () => {
    try {
      const data = await get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
