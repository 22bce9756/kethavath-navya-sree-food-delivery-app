import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS setup for localhost & Render frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://kethavath-navya-sree-food-delivery-app.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // ✅ to read cookies

// Connect DB
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
