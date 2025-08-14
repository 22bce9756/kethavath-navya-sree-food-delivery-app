import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

const foodRouter = express.Router();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage that sends files straight to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "food-delivery", // folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

// Routes
foodRouter.get("/list", listFood);

// Upload image → store in Cloudinary → pass URL to controller
foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;
