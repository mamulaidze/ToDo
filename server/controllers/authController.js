// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const TOKEN_EXPIRES = "7d";

const createToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

const cookieOptions = {
  httpOnly: true,
  secure: true,            // ✅ required for cross-site cookies
  sameSite: "none",        // ✅ required for Netlify <-> Render
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name });
    await user.save();

    const token = createToken({ id: user._id });
    res.cookie("token", token, cookieOptions);

    const { password: _p, ...userSafe } = user.toObject();
    res.status(201).json({ user: userSafe });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken({ id: user._id });
    res.cookie("token", token, cookieOptions);

    const { password: _p, ...userSafe } = user.toObject();
    res.json({ user: userSafe });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
};
