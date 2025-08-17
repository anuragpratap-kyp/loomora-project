import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// CORS: Frontend से requests allow करना
app.use(cors({
  origin: "https://loomora-project.vercel.app",
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  countInStock: Number
});
const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: String,
  orderItems: Array,
  shippingAddress: Object,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// Auth middleware
function auth(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({ message:"Not logged in" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch(err){
    res.status(401).json({ message:"Invalid token" });
  }
}

// APIs

// Get all products
app.get("/products", async (req,res)=>{
  try {
    const products = await Product.find();
    res.setHeader("Content-Type","application/json");
    res.status(200).json(products);
  } catch(err){
    res.status(500).json({ message:"Server error" });
  }
});

// Get single product
app.get("/products/:id", async (req,res)=>{
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ message:"Product not found" });
    res.setHeader("Content-Type","application/json");
    res.status(200).json(p);
  } catch(err){
    res.status(500).json({ message:"Server error" });
  }
});

// Place order
app.post("/orders", auth, async (req,res)=>{
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if(!orderItems?.length) return res.status(400).json({ message:"Cart empty" });

  // Validate each product
  for(let item of orderItems){
    const product = await Product.findById(item.product);
    if(!product) return res.status(400).json({ message:`Product ${item.name} not found` });
    if(item.qty > product.countInStock) return res.status(400).json({ message:`Insufficient stock for ${item.name}` });
    if(item.price !== product.price) return res.status(400).json({ message:`Price mismatch for ${item.name}` });
  }

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod
  });

  res.status(201).json(order);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
