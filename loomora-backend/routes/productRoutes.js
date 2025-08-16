import express from "express";
import Product from "./models/Product.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// All products
router.get("/", async (_req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Create (admin)
router.post("/", protect, admin, async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
});

// Update (admin)
router.put("/:id", protect, admin, async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  Object.assign(item, req.body);
  const saved = await item.save();
  res.json(saved);
});

// Delete (admin)
router.delete("/:id", protect, admin, async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  await item.deleteOne();
  res.json({ message: "Product removed" });
});

export default router;
