import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// ✅ Needed to correctly resolve paths in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://kethavath-navya-sree-food-delivery-app-1.onrender.com",
];

// ✅ CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /https:\/\/.*\.onrender\.com$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// middlewares
app.use(express.json());

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);

// ✅ Serve uploads folder with correct absolute path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`✅ Server started on http://localhost:${port}`)
);
