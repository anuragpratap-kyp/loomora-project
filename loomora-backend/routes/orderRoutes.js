import express from "express";
import Order from "../models/order.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create order (COD)
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod = "COD" } = req.body;

  if (!orderItems?.length) return res.status(400).json({ message: "No order items" });

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount
  });

  res.status(201).json(order);
});

// My orders
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// All orders (admin)
router.get("/", protect, admin, async (_req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
