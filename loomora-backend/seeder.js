import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

const run = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});

    const admin = await User.create({
      name: "Admin",
      email: "admin@loomora.com",
      password: "admin123",
      isAdmin: true
    });

    const sample = [
      {
        name: "Embroidered Silk Cushion Cover",
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
        description: "Handcrafted silk cushion with floral zari embroidery.",
        price: 799,
        countInStock: 20
      },
      {
        name: "Cotton Curtain (Paisley Embroidery)",
        image: "https://images.unsplash.com/photo-1615873968403-89e06814d2bc",
        description: "Premium cotton curtain with traditional paisley stitch.",
        price: 1499,
        countInStock: 15
      },
      {
        name: "Boho Bed Runner",
        image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
        description: "Bohemian embroidered bed runner for modern bedrooms.",
        price: 1199,
        countInStock: 12
      }
    ];

    await Product.insertMany(sample);

    console.log("✅ Seeded: admin + products");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
