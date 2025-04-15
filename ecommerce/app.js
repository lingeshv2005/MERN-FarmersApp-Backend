import express from "express";
import cors from "cors";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productRequestRoutes from "./routes/productRequestRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import payment from './routes/paymentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({extended:true}));
app.use("/api/v1",payment);

// Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-requests", productRequestRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/orders", orderRoutes);

export default app;
