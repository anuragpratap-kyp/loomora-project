import express from "express";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const router = express.Router();

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    return res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: genToken(user._id) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: genToken(user._id) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
