import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;

// Allowed origins (add your deployed frontend here)
const allowedOrigins = [
  "http://localhost:5173",
  "https://kethavath-navya-sree-food-delivery-app-1.onrender.com",
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// DB connection
connectDB();

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static(path.join(__dirname, "uploads"))); // Static images
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root test route
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
